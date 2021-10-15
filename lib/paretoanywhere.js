/**
 * Copyright reelyActive 2014-2021
 * We believe in an open Internet of Things
 */


const http = require('http');
const dgram = require('dgram');
const path = require('path');
const express = require('express');
const cors = require('cors');
const advlib = require('advlib');
const socketio = require('socket.io');
const Barnowl = require('barnowl');
const BarnowlAruba = require('barnowl-aruba');
const BarnowlHuawei = require('barnowl-huawei');
const BarnowlMinew = require('barnowl-minew');
const BarnowlReel = require('barnowl-reel');
const Barnacles = require('barnacles');
const BarnaclesElasticsearch = require('barnacles-elasticsearch');
const BarnaclesSocketIO = require('barnacles-socketio');
const Barterer = require('barterer');
const Chickadee = require('chickadee');
const RaddecRelayUdp = require('raddec-relay-udp');


const PORT = process.env.PORT || 3001;
const REEL_PORT = process.env.REEL_PORT || 50000;
const RADDEC_PORT = process.env.RADDEC_PORT || 50001;
const HUAWEI_PORT = process.env.HUAWEI_PORT || 50010;
const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE ||
                           'http://localhost:9200';


const DEFAULT_USE_CORS = true;
const SOCKETIO_CORS_OPTIONS = {
    cors: { origin: "*", methods: [ "GET", "POST" ] }
};
const DEFAULT_PACKET_PROCESSORS = [
    { processor: require('advlib-ble'),
      libraries: [ require('advlib-ble-services'),
                   require('advlib-ble-manufacturers') ],
      options: { ignoreProtocolOverhead: true,
                 indices: [ require('sniffypedia') ] } }
];
const DEFAULT_PACKET_INTERPRETERS = [ require('advlib-interoperable') ];


/**
 * ParetoAnywhere Class
 * The reelyActive open source software suite that enables computers to
 * understand physical spaces and the real-time dynamics of the people and
 * assets within.
 */
class ParetoAnywhere {

  /**
   * ParetoAnywhere constructor
   * @param {Object} options The configuration options.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};

    this.app = express();
    this.server = http.createServer(self.app);
    this.router = express.Router();
    this.io = createSocketIO(self.server, options);

    initialiseExpressMiddleware(self.app, self.router, self, options);

    this.barnowl = createBarnowl(self.app, self.server, options);
    this.barnacles = createBarnacles(self.barnowl, self.io, options);
    this.barterer = createBarterer(self.app, self.barnacles, self.io, options);
    this.chickadee = createChickadee(self.app, self.barnacles, self.io,
                                     options);

    initialiseServer(self.server, options);
  }

}


/**
 * Initialise the middleware for the given Express instance.
 * @param {Express} app The Express instance.
 * @param {Router} router The Express router.
 * @param {ParetoAnywhere} instance The Pareto Anywhere instance.
 * @param {Object} options The configuration options.
 */
function initialiseExpressMiddleware(app, router, instance, options) {
  app.use(exceptMinew(express.json()));
  app.use(function(req, res, next) {
    req.pa = instance;
    next();
  });
  app.use('/', express.static(path.resolve(__dirname + '/../web')));
  app.use('/', router);

  if(!options.hasOwnProperty('useCors')) {
    options.useCors = DEFAULT_USE_CORS;
  }
  if(options.useCors) {
    app.use(cors());
  }
}


/**
 * Create the socket.io server.
 * @param {Server} server The server instance.
 * @param {Object} options The configuration options.
 */
function createSocketIO(server, options) {
  let socketOptions = {};

  if(!options.hasOwnProperty('useCors')) {
    options.useCors = DEFAULT_USE_CORS;
  }
  if(options.useCors) {
    socketOptions = SOCKETIO_CORS_OPTIONS;
  }

  return socketio(server, socketOptions);
}


/**
 * Initialise the HTTP server by listening and handling errors.
 * @param {Server} server The server instance.
 * @param {Object} options The configuration options.
 */
function initialiseServer(server, options) {
  server.on('error', function(error) {
    if(error.code === 'EADDRINUSE') {
      console.log('Port', PORT, 'is already in use.',
                  'Is another Pareto Anywhere instance running?');
    }
  });

  server.listen(PORT, function() {
    console.log('Pareto Anywhere by reelyActive is running on port', PORT);
  });
}


/**
 * Create a barnowl instance with reel and Minew listeners.
 * @param {Express} app The Express instance.
 * @param {Server} server The HTTP server instance.
 * @param {Object} options The configuration options.
 * @return {Barnowl} The Barnowl instance.
 */
function createBarnowl(app, server, options) {
  if(!options.hasOwnProperty('barnowl')) {
    options.barnowl = { enableMixing: true };
  }

  let barnowl = new Barnowl(options.barnowl);

  barnowl.addListener(BarnowlReel, {}, BarnowlReel.UdpListener,
                      { path: "0.0.0.0:" + REEL_PORT });
  barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.HttpListener,
                      { app: app, express: express });
  barnowl.addListener(BarnowlAruba, {}, BarnowlAruba.WsListener,
                      { server: server });
  barnowl.addListener(BarnowlHuawei, {}, BarnowlHuawei.UdpListener,
                      { path: "0.0.0.0:" + HUAWEI_PORT });

  return barnowl;
}


/**
 * Create a barnacles instance with socket.io output.
 * @param {Barnowl} The Barnowl instance.
 * @param {SocketIO} The socket.io instance.
 * @param {Object} options The configuration options.
 * @return {Barnacles} The Barnacles instance.
 */
function createBarnacles(barnowl, io, options) {
  if(!options.hasOwnProperty('barnacles')) {
    options.barnacles = {};
  }
  options.barnacles.barnowl = barnowl;
  options.barnacles.packetProcessors = options.barnacles.packetProcessors ||
                                       DEFAULT_PACKET_PROCESSORS;
  options.barnacles.packetInterpreters = options.barnacles.packetInterpreters ||
                                         DEFAULT_PACKET_INTERPRETERS;

  let barnacles = new Barnacles(options.barnacles);
  let sources = [ { address: "0.0.0.0", port: RADDEC_PORT } ];
  let raddecHandler = barnacles.handleRaddec.bind(barnacles);

  let relay = new RaddecRelayUdp({ sources: sources,
                                   raddecHandler: raddecHandler });

  barnacles.addInterface(BarnaclesElasticsearch, { node: ELASTICSEARCH_NODE });
  barnacles.addInterface(BarnaclesSocketIO, { io: io });

  return barnacles;
}


/**
 * Create a barterer instance.
 * @param {Express} app The Express instance.
 * @param {Barnacles} The Barnacles instance.
 * @param {SocketIO} The socket.io instance.
 * @param {Object} options The configuration options.
 * @return {Barterer} The Barterer instance.
 */
function createBarterer(app, barnacles, io, options) {
  if(!options.hasOwnProperty('barterer')) {
    options.barterer = {};
  }
  options.barterer.app = app;
  options.barterer.io = io;
  options.barterer.barnacles = barnacles;

  let barterer = new Barterer(options.barterer);

  return barterer;
}


/**
 * Create a chickadee instance.
 * @param {Express} app The Express instance.
 * @param {Barnacles} The Barnacles instance.
 * @param {SocketIO} The socket.io instance.
 * @param {Object} options The configuration options.
 * @return {Chickadee} The Chickadee instance.
 */
function createChickadee(app, barnacles, io, options) {
  if(!options.hasOwnProperty('chickadee')) {
    options.chickadee = {};
  }
  options.chickadee.app = app;
  options.chickadee.io = io;
  options.chickadee.barnacles = barnacles;

  let chickadee = new Chickadee(options.chickadee);

  return chickadee;
}


/* Temporary function to handle the case where Minew sends binary data */
/*   erroneously indicated with Content-Type: "application/json".      */
/* TODO: remove if/when Minew update to use application/octet-stream   */
function exceptMinew(middleware) {
  return function(req, res, next) {
    if(req.path === '/minew') {
      next();
    }
    else {
      middleware(req, res, next);
    }
  }
}


module.exports = ParetoAnywhere;