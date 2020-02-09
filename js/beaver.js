/**
 * Copyright reelyActive 2016-2019
 * We believe in an open Internet of Things
 */


let beaver = (function() {

  // Internal constants
  const SIGNATURE_SEPARATOR = '/';
  const ALL_EVENTS_INDEX_LIST = [ 0, 1, 2, 3, 4 ];
  const DEFAULT_DISAPPEARANCE_MILLISECONDS = 15000;

  // Internal variables
  let transmitters = {};
  let eventCallbacks = [ [], [], [], [], [] ];
  let disappearanceMilliseconds = DEFAULT_DISAPPEARANCE_MILLISECONDS;
  let purgeTimeout = null;

  // Get the given raddec's transmitter signature
  function getTransmitterSignature(raddec) {
    return raddec.transmitterId + SIGNATURE_SEPARATOR +
           raddec.transmitterIdType;
  }

  // Handle the given raddec
  function handleRaddec(raddec) {
    let transmitterSignature = getTransmitterSignature(raddec);
    let isNewTransmitter = !transmitters.hasOwnProperty(transmitterSignature);

    raddec.timestamp = raddec.timestamp || new Date().getTime();
    raddec.packets = raddec.packets || [];
    raddec.events = raddec.events || [ 3 ];

    if(isNewTransmitter) {
      transmitters[transmitterSignature] = {};
    }
    transmitters[transmitterSignature].raddec = raddec;
    handleEventCallbacks(raddec);
  }

  // Handle legacy events (Pareto & open source v0.x)
  function handleLegacyEvent(event, var1, var2) {
    let events = [ 'appearance', 'displacement', 'packets', 'keep-alive',
                   'disappearance' ];
    let raddec = {
        transmitterId: event.deviceId,
        transmitterIdType: 0,
        rssiSignature: [ {
          receiverId: event.receiverId,
          receiverIdType: 0,
          rssi: event.rssi,
          numberOfDecodings: 1
        } ],
        events: [ events.indexOf(event.event) ],
        timestamp: event.time
    };
    handleRaddec(raddec);
  }

  // Handle the given Web Bluetooth Scanning event
  function handleWebBluetoothScanningEvent(event) {
    let raddec = {
        transmitterId: base64toHex(event.device.id),
        transmitterIdType: 0,
        rssiSignature: [ {
          receiverId: "WebBluetooth",
          receiverIdType: 0,
          rssi: event.rssi,
          numberOfDecodings: 1
        } ],
        timestamp: Date.now(),
        uuids: [],                   // TODO: standardise
        manufacturerData: new Map(), //       how these properties
        serviceData: new Map()       //       are represented
    };

    event.uuids.forEach(function(uuid) {
      raddec.uuids.push(uuid);
    });
    event.manufacturerData.forEach(function(data, manufacturerId) {
      raddec.manufacturerData.set(manufacturerId, data);
    });
    event.serviceData.forEach(function(data, uuid) {
      raddec.serviceData.set(uuid, data);
    });

    handleRaddec(raddec);
  }

  // Convert base64 to hexadecimal
  function base64toHex(encodedValue) {
    let decodedValue = atob(encodedValue);
    let hexString = '';

    for(let cChar = 0; cChar < decodedValue.length; cChar++) {
      let hex = '0'+ decodedValue.charCodeAt(cChar).toString(16);
      hexString += hex.slice(-2);
    }

    return hexString;
  }

  // Handle each registered callback once for the given raddec/event(s)
  function handleEventCallbacks(raddec) {
    let completedCallbacks = [];

    eventCallbacks.forEach(function(callbacks, eventIndex) {
      if(raddec.events.includes(eventIndex)) {
        callbacks.forEach(function(callback) {
          if(callback && (!completedCallbacks.includes(callback))) {
            callback(raddec);
          }
        });
      }
    });
  }

  // Purge any stale transmitters as disappearances
  function purgeDisappearances() {
    let currentTime = new Date().getTime();
    let nextPurgeTime = currentTime + disappearanceMilliseconds;
    for(transmitterSignature in transmitters) {
      let raddec = transmitters[transmitterSignature].raddec;
      let stalenessMilliseconds = currentTime - raddec.timestamp;
      if(stalenessMilliseconds > disappearanceMilliseconds) {
        raddec.events = [ 4 ];
        handleEventCallbacks(raddec);
        delete transmitters[transmitterSignature]; // TODO: delete only raddec?
      }
      else {
        let purgeTime = raddec.timestamp + disappearanceMilliseconds;
        if(purgeTime < nextPurgeTime) {
          nextPurgeTime = purgeTime;
        }
      }
    }
    let timeoutMilliseconds = Math.max(nextPurgeTime - currentTime, 10);
    purgeTimeout = setTimeout(purgeDisappearances, timeoutMilliseconds);
  }

  // Listen on the given WebSocket
  let listen = function(socket, options) {
    options = options || {};
    let printStatus = options.printStatus || false;

    socket.on('raddec', handleRaddec);
    socket.on('appearance', handleLegacyEvent);
    socket.on('displacement', handleLegacyEvent);
    socket.on('keep-alive', handleLegacyEvent);
    socket.on('disappearance', handleLegacyEvent);

    if(printStatus) {
      socket.on('connect', function() {
        console.log('beaver connected to socket');
      });
      socket.on('disconnect', function(message) {
        console.log('beaver disconnected from socket:', message);
      });
    }

    if(!purgeTimeout) {
      purgeDisappearances();
    }
  };

  // Register a callback for the given event type(s)
  let setEventCallback = function(events, callback) {
    if(!(callback && (typeof callback === 'function'))) { 
      return;
    }
    if(!Array.isArray(events)) {
      events = ALL_EVENTS_INDEX_LIST;
    }
    events.forEach(function(event) {
      if(ALL_EVENTS_INDEX_LIST.includes(event)) {
        eventCallbacks[event].push(callback);
      }
    });
  }

  // Expose the following functions and variables
  return {
    listen: listen,
    on: setEventCallback,
    transmitters: transmitters,
    handleWebBluetoothScanningEvent: handleWebBluetoothScanningEvent
  }

}());
