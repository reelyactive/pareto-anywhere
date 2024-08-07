/**
 * Copyright reelyActive 2014-2024
 * We believe in an open Internet of Things
 */


const http = require('http');
const https = require('https');
const dgram = require('dgram');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const advlib = require('advlib');
const socketio = require('socket.io');
const Barnowl = require('barnowl');
const BarnowlAruba = require('barnowl-aruba');
const BarnowlAxis = require('barnowl-axis');
const BarnowlCsl = require('barnowl-csl');
const BarnowlHuawei = require('barnowl-huawei');
const BarnowlImpinj = require('barnowl-impinj');
const BarnowlMinew = require('barnowl-minew');
const BarnowlReel = require('barnowl-reel');
const BarnowlRFControls = require('barnowl-rfcontrols');
const Barnacles = require('barnacles');
const BarnaclesSocketIO = require('barnacles-socketio');
const Barterer = require('barterer');
const Chickadee = require('chickadee');
const Chimps = require('chimps');
const JSONSilo = require('json-silo');


const CONFIG_PATH = process.env.PARETO_ANYWHERE_CONFIG_PATH || 'config';
const PORT = process.env.PORT || 3001;
const REEL_PORT = process.env.REEL_PORT || 50000;
const RADDEC_PORT = process.env.RADDEC_PORT || 50001;
const HUAWEI_PORT = process.env.HUAWEI_PORT || 50010;


const DEFAULT_USE_CORS = true;
const SOCKETIO_CORS_OPTIONS = {
    cors: { origin: "*", methods: [ "GET", "POST" ] }
};
const BLE_PACKET_PROCESSOR = {
    processor: require('advlib-ble'),
    libraries: [ require('advlib-ble-services'),
                 require('advlib-ble-manufacturers') ],
    options: { ignoreProtocolOverhead: true,
               indices: [ require('sniffypedia') ] }
};
const PROTOCOL_SPECIFIC_DATA_PROCESSORS = [{
    processor: require('advlib-ble'),
    libraries: [ require('advlib-ble-gatt') ]
}];
const DEFAULT_PACKET_INTERPRETERS = [ require('advlib-interoperable') ];
let enoceanPacketProcessor = {
    processor: require('advlib-esp'),
    libraries: [ require('advlib-eep-4bs'),
                 require('advlib-eep-msc'),
                 require('advlib-eep-rps'),
                 require('advlib-eep-vld') ],
    options: { ignoreProtocolOverhead: true,
               deviceProfiles: {} }
};


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
    this.server = createServer(self.app, options);
    this.router = express.Router();
    this.io = createSocketIO(self.server, options);

    initialiseExpressMiddleware(self.app, self.router, self, options);

    this.barnowl = createBarnowl(self.app, self.server, options);
    this.barnacles = createBarnacles(self.barnowl, self.io, options);
    this.chimps = createChimps(self.barnowl, self.barnacles, self.io, options);
    this.barterer = createBarterer(self.app, self.barnacles, self.chimps,
                                   self.io, options);
    this.chickadee = createChickadee(self.app, self.barnacles, self.chimps,
                                     self.io, options);
    this.jsonsilo = createJsonSilo(self.app, options);

    initialiseServer(self.server, options);
  }

}


/**
 * Create the https server, if credentials found, else http.
 * @param {Express} app The Express instance.
 * @param {Object} options The configuration options.
 */
function createServer(app, options) {
  let server;

  try {
    let credentials = {
        cert: fs.readFileSync(path.resolve(CONFIG_PATH  + '/certificate.pem')),
        key: fs.readFileSync(path.resolve(CONFIG_PATH + '/key.pem'))
    };
    server = https.createServer(credentials, app);
  }
  catch(err) {
    console.log('Pareto Anywhere by reelyActive is using HTTP');
    return http.createServer(app);
  }

  console.log('Pareto Anywhere by reelyActive is using HTTPS');
  return server;
}


/**
 * Initialise the middleware for the given Express instance.
 * @param {Express} app The Express instance.
 * @param {Router} router The Express router.
 * @param {ParetoAnywhere} instance The Pareto Anywhere instance.
 * @param {Object} options The configuration options.
 */
function initialiseExpressMiddleware(app, router, instance, options) {
  app.use(express.json());
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

  barnowl.addListener(Barnowl, {}, Barnowl.UdpListener,
                      { path: "0.0.0.0:" + RADDEC_PORT });
  barnowl.addListener(BarnowlReel, {}, BarnowlReel.UdpListener,
                      { path: "0.0.0.0:" + REEL_PORT });
  barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.HttpListener,
                      { app: app, express: express });
  barnowl.addListener(BarnowlAruba, {}, BarnowlAruba.WsListener,
                      { server: server, decodingOptions: {
                                             acceptTelemetryReports: true } });
  barnowl.addListener(BarnowlHuawei, {}, BarnowlHuawei.UdpListener,
                      { path: "0.0.0.0:" + HUAWEI_PORT });
  barnowl.addListener(BarnowlImpinj, {}, BarnowlImpinj.HttpListener,
                      { app: app, express: express });
  barnowl.addListener(BarnowlCsl, {}, BarnowlCsl.HttpListener,
                      { app: app, express: express });
  barnowl.addListener(BarnowlRFControls, {}, BarnowlRFControls.WsListener, {});
  barnowl.addListener(BarnowlAxis, {}, BarnowlAxis.MqttListener, {});

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
                                       createPacketProcessors();
  options.barnacles.protocolSpecificDataProcessors =
                             options.barnacles.protocolSpecificDataProcessors ||
                             PROTOCOL_SPECIFIC_DATA_PROCESSORS;
  options.barnacles.packetInterpreters = options.barnacles.packetInterpreters ||
                                         DEFAULT_PACKET_INTERPRETERS;

  let barnacles = new Barnacles(options.barnacles);

  barnacles.addInterface(BarnaclesSocketIO, { io: io });

  return barnacles;
}


/**
 * Create a barterer instance.
 * @param {Express} app The Express instance.
 * @param {Barnacles} The Barnacles instance.
 * @param {Chimps} The Chimps instance.
 * @param {SocketIO} The socket.io instance.
 * @param {Object} options The configuration options.
 * @return {Barterer} The Barterer instance.
 */
function createBarterer(app, barnacles, chimps, io, options) {
  if(!options.hasOwnProperty('barterer')) {
    options.barterer = {};
  }
  options.barterer.app = app;
  options.barterer.io = io;
  options.barterer.barnacles = barnacles;
  options.barterer.chimps = chimps;

  let barterer = new Barterer(options.barterer);

  return barterer;
}


/**
 * Create a chickadee instance.
 * @param {Express} app The Express instance.
 * @param {Barnacles} The Barnacles instance.
 * @param {Chimps} The Chimps instance.
 * @param {SocketIO} The socket.io instance.
 * @param {Object} options The configuration options.
 * @return {Chickadee} The Chickadee instance.
 */
function createChickadee(app, barnacles, chimps, io, options) {
  if(!options.hasOwnProperty('chickadee')) {
    options.chickadee = {};
  }
  options.chickadee.app = app;
  options.chickadee.io = io;
  options.chickadee.barnacles = barnacles;
  options.chickadee.chimps = chimps;

  let chickadee = new Chickadee(options.chickadee);

  return chickadee;
}


/**
 * Create a chimps instance with socket.io output.
 * @param {Barnowl} The Barnowl instance.
 * @param {Barnacles} The Barnacles instance.
 * @param {SocketIO} The socket.io instance.
 * @param {Object} options The configuration options.
 * @return {Chimps} The Chimps instance.
 */
function createChimps(barnowl, barnacles, io, options) {
  if(!options.hasOwnProperty('chimps')) {
    options.chimps = {};
  }
  options.chimps.barnowl = barnowl;
  options.chimps.barnacles = barnacles;

  let chimps = new Chimps(options.chimps);

  // TODO: share barnowl-socketio instance with barnacles
  chimps.addInterface(BarnaclesSocketIO, { io: io });

  return chimps;
}


/**
 * Create a json-silo instance.
 * @param {Express} app The Express instance.
 * @param {Object} options The configuration options.
 * @return {JSONSilo} The JSONSilo instance.
 */
function createJsonSilo(app, options) {
  if(!options.hasOwnProperty('jsonsilo')) {
    options.jsonsilo = {};
  }
  options.jsonsilo.app = app;

  let jsonsilo = new JSONSilo(options.jsonsilo);

  return jsonsilo;
}


/**
 * Create a packet processors object (for advlib).
 * @param {function} callback The function to call on completion.
 */
function createPacketProcessors() {
  fs.readFile(path.resolve(__dirname + '/../config/enocean.json'),
              (err, data) => {
    if(!err) {
      try {
        enoceanPacketProcessor.options.deviceProfiles = JSON.parse(data);
        console.log('Loaded device profiles from config/enocean.json');
      }
      catch(err) {
        console.log('Warning: could not parse config/enocean.json');
      }
    }
  });

  return [ enoceanPacketProcessor, BLE_PACKET_PROCESSOR ];
}


module.exports = ParetoAnywhere;
