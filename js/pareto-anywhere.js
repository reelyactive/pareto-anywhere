/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


// Constant definitions
const SCAN_OPTIONS = {
    acceptAllAdvertisements: true,
    keepRepeatedDevices: true
};
const STATS_INTERVAL_MILLISECONDS = 1000;
const PROXIMITY_INTERVAL_MILLISECONDS = 1000;
const SIGNATURE_SEPARATOR = '/';
const CARD_ID_PREFIX = 'dev-';
const DEFAULT_NUMBER_OF_DEVICES_TO_DISPLAY = 3;
const DEFAULT_RSSI_THRESHOLD = -72;
const UNKNOWN_RSSI_VALUE = -127;
const SNIFFYPEDIA_BASE_URL = 'https://sniffypedia.org/';
const NO_DEVICES_IN_PROXIMITY_MESSAGE = 'Nothing nearby';


// DOM elements
let scanButton = document.querySelector('#scanButton');
let stopButton = document.querySelector('#stopButton');
let nearestLimitInput = document.querySelector('#nearestLimitInput');
let nearestLimitDisplay = document.querySelector('#nearestLimitDisplay');
let rssiThresholdInput = document.querySelector('#rssiThresholdInput');
let rssiThresholdDisplay = document.querySelector('#rssiThresholdDisplay');
let scanStats = document.querySelector('#scanStats');
let scanError = document.querySelector('#scanError');
let raddecRate = document.querySelector('#raddecRate');
let numTransmitters = document.querySelector('#numTransmitters');
let nearestTitle = document.querySelector('#nearestTitle');
let nearestCount = document.querySelector('#nearestCount');
let proximityCards = document.querySelector('#proximityCards');
let debugMessage = document.querySelector('#debugMessage');


// Other variables
let devices = {};
let rssiThreshold = DEFAULT_RSSI_THRESHOLD;
let numberOfDevicesToDisplay = DEFAULT_NUMBER_OF_DEVICES_TO_DISPLAY;


// Set default settings values
rssiThresholdInput.value = rssiThreshold;
nearestLimitInput.value = numberOfDevicesToDisplay;


// Non-disappearance events
beaver.on([ 0, 1, 2, 3 ], function(raddec) {
  updateDevice(raddec);
});


// Disappearance events
beaver.on([ 4 ], function(raddec) {
  removeDevice(raddec);
});


// Update the device associated with the given raddec
function updateDevice(raddec) {
  let transmitterSignature = raddec.transmitterId + SIGNATURE_SEPARATOR +
                             raddec.transmitterIdType;
  let id = (CARD_ID_PREFIX + transmitterSignature).substring(0,12);
  let rssi = raddec.rssiSignature[0].rssi || UNKNOWN_RSSI_VALUE;
  let isTrackedDevice = devices.hasOwnProperty(transmitterSignature);
  let isUpdateRequired = isTrackedDevice || (rssi >= rssiThreshold);

  if(!isUpdateRequired) {
    return;
  }

  if(!isTrackedDevice) {
    devices[transmitterSignature] = { raddecs: [ raddec ],
                                      stories: [],
                                      data: [],
                                      associations: {},
                                      urls: [],
                                      rssi: rssi,
                                      id: id };
  }
  else {
    devices[transmitterSignature].raddecs.unshift(raddec);
    devices[transmitterSignature].rssi = rssi;
  }

  let device = devices[transmitterSignature];
  parseRaddecPayload(raddec, device);
  trimStaleDeviceData(device);
}


// Remove the device associated with the given raddec
function removeDevice(raddec) {
  let transmitterSignature = raddec.transmitterId + SIGNATURE_SEPARATOR +
                             raddec.transmitterIdType;

  let card = document.getElementById(transmitterSignature);
  proximityCards.removeChild(card);
  delete devices[transmitterSignature];
}


// Parse the given raddec's payload for structured data
function parseRaddecPayload(raddec, device) {
  let hasUuids = (raddec.hasOwnProperty('uuids') && raddec.uuids.length);
  let hasServiceData = (raddec.hasOwnProperty('serviceData') &&
                        (raddec.serviceData.size > 0));
  let hasManufacturerData = (raddec.hasOwnProperty('manufacturerData') &&
                             (raddec.manufacturerData.size > 0));

  if(hasUuids) {
    device.data.unshift({ uuids: raddec.uuids });
  }
  if(hasServiceData) {
    parseServiceData(raddec.serviceData, device, raddec.timestamp);
  }
  if(hasManufacturerData) {
    parseManufacturerData(raddec.manufacturerData, device, raddec.timestamp);
  }
}


// Parse the given service data
function parseServiceData(serviceData, device, timestamp) {
  serviceData.forEach(function(data, uuid) {
    let parsedData = null;
    let isUuid16 = (uuid.substring(0,4) === '0000');

    if(isUuid16) {
      let uuid16 = uuid.substring(4,8);
      let isEddystone = (uuid16 === eddystone.SERVICE_UUID);
      let isMinew = (uuid16 === minew.SERVICE_UUID);
      if(isEddystone) {
        parsedData = eddystone.parseServiceData(new Uint8Array(data.buffer));
      }
      else if(isMinew) {
        parsedData = minew.parseServiceData(new Uint8Array(data.buffer));
      }
      else {
        parsedData = { uuid: uuid16, data: new Uint8Array(data.buffer) };
      }

      if(sniffypedia.ble.uuid16.hasOwnProperty(uuid16)) {
        let url = SNIFFYPEDIA_BASE_URL + sniffypedia.ble.uuid16[uuid16];
        let isNewUrl = (device.urls.indexOf(url) < 0);

        if(isNewUrl) {
          device.urls.push(url);
          cormorant.retrieveStory(url, function(story) {
            device.stories.push(story);
          });
        }
      }
    }

    if(parsedData) {
      let hasNewUrl = parsedData.hasOwnProperty('url') &&
                      (device.urls.indexOf(parsedData.url) < 0);

      if(hasNewUrl) {
        device.urls.push(parsedData.url);
        cormorant.retrieveStory(parsedData.url, function(story) {
          device.stories.push(story);
        });
      }

      parsedData.timestamp = timestamp;
      device.data.unshift(parsedData);
    }
  });
}


// Parse the given manufacturer data
function parseManufacturerData(manufacturerData, device, timestamp) {
  manufacturerData.forEach(function(data, manufacturer) {
    let manufacturerHex = ('000' + manufacturer.toString(16)).substr(-4);
    let unprocessedData = { manufacturer: manufacturerHex,
                            data: bufferToHex(data.buffer),
                            timestamp: timestamp };
    device.data.unshift(unprocessedData);

    if(sniffypedia.ble.companyIdentifiers.hasOwnProperty(manufacturerHex)) {
      let url = SNIFFYPEDIA_BASE_URL +
                sniffypedia.ble.companyIdentifiers[manufacturerHex];
      let isNewUrl = (device.urls.indexOf(url) < 0);

      if(isNewUrl) {
        device.urls.push(url);
        cormorant.retrieveStory(url, function(story) {
          device.stories.push(story);
        });
      }
    }
  });
}


// Trim any stale data from the given device
function trimStaleDeviceData(device) {
  if(device.raddecs.length > 3) { // TODO: trim based on timestamp
    device.raddecs.pop();
  }
  if(device.data.length > 3) {    // TODO: trim based on timestamp
    device.data.pop();
  }
}


// Attempt to run the experimental requestLEScan function
async function scanForAdvertisements() {
  try {
    const scan = await navigator.bluetooth.requestLEScan(SCAN_OPTIONS);
    let statsInterval = setInterval(updateStats, STATS_INTERVAL_MILLISECONDS);
    let proximityInterval = setInterval(updateProximityCards,
                                        PROXIMITY_INTERVAL_MILLISECONDS);
    let eventStatsCount = 0;
    scanButton.textContent = 'Scanning...';
    scanButton.setAttribute('class', 'btn btn-outline-dark');
    scanButton.setAttribute('disabled', true);
    stopButton.setAttribute('class', 'btn btn-primary');
    stopButton.removeAttribute('disabled');
    raddecRate.textContent = 0;
    numTransmitters.textContent = 0;
    scanStats.removeAttribute('hidden');

    navigator.bluetooth.addEventListener('advertisementreceived', event => {
      beaver.handleWebBluetoothScanningEvent(event);
      eventStatsCount++;
    });

    function updateStats() {
      raddecRate.textContent = Math.round(eventStatsCount /
                                          (STATS_INTERVAL_MILLISECONDS / 1000));
      numTransmitters.textContent = Object.keys(beaver.transmitters).length;
      eventStatsCount = 0;
    }

    function stopScan() {
      let stopTime = new Date().toLocaleTimeString();
      scan.stop();
      clearInterval(statsInterval);
      clearInterval(proximityInterval);
      scanButton.textContent = 'Scan';
      scanButton.setAttribute('class', 'btn btn-primary');
      scanButton.removeAttribute('disabled');
      stopButton.setAttribute('class', 'btn btn-outline-dark');
      stopButton.setAttribute('disabled', true);
      stopButton.removeEventListener('click', stopScan);
      scanStats.setAttribute('hidden', true);
    }

    stopButton.addEventListener('click', stopScan);
  }
  catch(error)  {
    scanError.removeAttribute('hidden');
  }
}


// Update the proximity cards
function updateProximityCards() {
  let updatedFragment = document.createDocumentFragment();
  let sortedArray = [];
  let numberOfDisplayedCards = 0;

  for(transmitterSignature in devices) {
    sortedArray.push(devices[transmitterSignature]);
  }
  sortedArray.sort(function(device1, device2) {
    return device2.rssi - device1.rssi; // Decreasing RSSI
  });

  sortedArray.forEach(function(device, index) {
    if(index < numberOfDevicesToDisplay) {
      let card = document.querySelector('#' + device.id);

      if(!card) {
        card = document.createElement('div');
        card.setAttribute('id', device.id);
        card.setAttribute('class', 'card my-4');
      }
      updatedFragment.appendChild(card);
      numberOfDisplayedCards++;
      cuttlefish.renderAsTabs(card, device.stories, device.data,
                              device.associations, device.raddecs);
    }
  });

  if(numberOfDisplayedCards === 0) {
    nearestCount.textContent = NO_DEVICES_IN_PROXIMITY_MESSAGE;
  }
  else {
    nearestCount.textContent = 'Nearest ' + numberOfDisplayedCards;
    nearestTitle.removeAttribute('hidden');
  }

  proximityCards.innerHTML = '';
  proximityCards.appendChild(updatedFragment);
}


// Update the nearest limit and rssi threshold settings
function updateSettings() {
  numberOfDevicesToDisplay = nearestLimitInput.value;
  nearestLimitDisplay.textContent = numberOfDevicesToDisplay;

  rssiThreshold = rssiThresholdInput.value;
  rssiThresholdDisplay.textContent = rssiThreshold + ' dBm';
}


// Convert the given buffer to a hexadecimal string
function bufferToHex(buffer) {
  let bytes = new Uint8Array(buffer);
  let hexString = '';

  bytes.forEach(function(byte) {
    hexString += ('0' + byte.toString(16)).substr(-2);
  });

  return hexString;
}


// Handle scan button click and settings change
scanButton.addEventListener('click', scanForAdvertisements);
nearestLimitInput.addEventListener('change', updateSettings);
rssiThresholdInput.addEventListener('change', updateSettings);