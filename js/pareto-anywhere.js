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
const SIGNATURE_SEPARATOR = '/';
const CARD_ID_PREFIX = 'device-';
const DEFAULT_NUMBER_OF_DEVICES_TO_DISPLAY = 3;
const DEFAULT_RSSI_THRESHOLD = -72;
const UNKNOWN_RSSI_VALUE = -127;


// DOM elements
let scanButton = document.querySelector('#scanButton');
let stopButton = document.querySelector('#stopButton');
let scanStats = document.querySelector('#scanStats');
let scanError = document.querySelector('#scanError');
let raddecRate = document.querySelector('#raddecRate');
let numTransmitters = document.querySelector('#numTransmitters');
let proximityCards = document.querySelector('#proximityCards');
let debugMessage = document.querySelector('#debugMessage');


// Other variables
let devices = {};
let rssiThreshold = DEFAULT_RSSI_THRESHOLD;
let numberOfDevicesToDisplay = DEFAULT_NUMBER_OF_DEVICES_TO_DISPLAY;


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
  let cardId = transmitterSignature.substring(12);
  let rssi = raddec.rssiSignature[0].rssi || UNKNOWN_RSSI_VALUE;
  let isTrackedDevice = devices.hasOwnProperty(transmitterSignature);
  let isUpdateRequired = isTrackedDevice || (rssi >= rssiThreshold);
  let card = document.getElementById(cardId);

  if(!isUpdateRequired) {
    return;
  }

  if(!isTrackedDevice) {
    devices[transmitterSignature] = { raddecs: [ raddec ],
                                      stories: [],
                                      data: [],
                                      associations: {},
                                      rssi: rssi };
    card = document.createElement('div');
    card.setAttribute('id', cardId);
    card.setAttribute('class', 'card my-4');
    card.hidden = true;
    proximityCards.append(card);
  }
  else {
    devices[transmitterSignature].raddecs.unshift(raddec);
    devices[transmitterSignature].rssi = rssi;
  }

  let device = devices[transmitterSignature];
  parseRaddecPayload(transmitterSignature, raddec, device.data);
  trimStaleDeviceData(device);

  cuttlefish.renderAsTabs(card, device.stories, device.data,
                          device.associations, device.raddecs);
  card.setAttribute('rssi', rssi);
  sortCards();
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
function parseRaddecPayload(transmitterSignature, raddec, deviceData) {
  let hasUuids = (raddec.hasOwnProperty('uuids') && raddec.uuids.length);
  let hasServiceData = (raddec.hasOwnProperty('serviceData') &&
                        (raddec.serviceData.size > 0));
  let hasManufacturerData = (raddec.hasOwnProperty('manufacturerData') &&
                             (raddec.manufacturerData.size > 0));

  if(hasUuids) {
    devices[transmitterSignature].data.unshift({ uuids: raddec.uuids });
  }
  if(hasServiceData) {
    parseServiceData(transmitterSignature, raddec.serviceData, deviceData);
  }
  if(hasManufacturerData) {
    parseManufacturerData(transmitterSignature, raddec.manufacturerData,
                          deviceData);
  }
}


// Parse the given service data
function parseServiceData(transmitterSignature, serviceData, deviceData) {
  serviceData.forEach(function(data, uuid) {
    let isUuid16 = (uuid.substring(0,4) === '0000');

    if(isUuid16) {
      let isEddystone = (uuid.substring(4,8) === eddystone.SERVICE_UUID);
      let isMinew = (uuid.substring(4,8) === minew.SERVICE_UUID);
      if(isEddystone) {
        eddystone.parseServiceData(transmitterSignature,
                                   new Uint8Array(data.buffer), deviceData);
      }
      else if(isMinew) {
        minew.parseServiceData(transmitterSignature,
                               new Uint8Array(data.buffer),
                               deviceData);
      }
      else {
        let unprocessedData = { uuid: uuid.substring(4,8),
                                data: new Uint8Array(data.buffer) };
        deviceData.unshift(unprocessedData);
      }
    }
  });
}


// Parse the given manufacturer data
function parseManufacturerData(transmitterSignature, manufacturerData,
                               deviceData) {
  manufacturerData.forEach(function(data, manufacturer) {
    let manufacturerHex = ('000' + manufacturer.toString(16)).substr(-4);
    let unprocessedData = { manufacturer: manufacturerHex,
                            data: new Uint8Array(data.buffer) };
    deviceData.unshift(unprocessedData);
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
      scanButton.textContent = 'Scan';
      scanButton.setAttribute('class', 'btn btn-primary mb-2');
      scanButton.removeAttribute('disabled');
      stopButton.setAttribute('class', 'btn btn-outline-dark mb-2');
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


// Sort the proximity cards
function sortCards() {
  let cards = Array.from(proximityCards.children);
  let sortedFragment = document.createDocumentFragment();

  cards.sort(sortFunction);

  cards.forEach(function(card, index) {
    if(index < numberOfDevicesToDisplay) {
      card.hidden = false;
    }
    else {
      card.hidden = true;
    }
    sortedFragment.appendChild(card);
  });

  proximityCards.innerHTML = '';
  proximityCards.appendChild(sortedFragment);
}


// Sort by decreasing RSSI
function sortFunction(card1, card2) {
  if(parseInt(card1.getAttribute('rssi')) >
     parseInt(card2.getAttribute('rssi'))) {
    return -1;
  };
  return 1;
}


// Handle scan button click
scanButton.addEventListener('click', scanForAdvertisements);