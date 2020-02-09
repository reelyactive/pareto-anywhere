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


// DOM elements
let scanButton = document.querySelector('#scanButton');
let stopButton = document.querySelector('#stopButton');
let scanStats = document.querySelector('#scanStats');
let scanError = document.querySelector('#scanError');
let raddecRate = document.querySelector('#raddecRate');
let numTransmitters = document.querySelector('#numTransmitters');
let serviceDataStatus = document.querySelector('#serviceDataStatus');
let serviceDataDisplay = document.querySelector('#serviceDataDisplay');
let uuidTotal = document.querySelector('#uuidTotal');
let manufacturerDataTotal = document.querySelector('#manufacturerDataTotal');
let serviceDataTotal = document.querySelector('#serviceDataTotal');


// Non-disappearance events
beaver.on([ 0, 1, 2, 3 ], function(raddec) {
  let hasServiceData = (raddec.hasOwnProperty('serviceData') &&
                        (raddec.serviceData.size > 0));
  if(hasServiceData) {
    serviceDataStatus.textContent = 'Service Data @ ' + raddec.rssi + 'dBm';
    raddec.serviceData.forEach(function(data, uuid) {
      let isEddystone = (uuid.substring(0,8) === '0000feaa');
      if(isEddystone) {
        let dataArray = new Uint8Array(data.buffer);
        switch(dataArray[0]) {
          case 0x00:
            serviceDataDisplay.textContent = 'UID: ' + dataArray;
            break;
          case 0x10:
            serviceDataDisplay.textContent = 'URL: ' + dataArray;
            break;
          case 0x20:
            serviceDataDisplay.textContent = 'TLM: ' + dataArray;
            break;
          default:
            serviceDataDisplay.textContent = 'Other: ' + dataArray;
        }
      }
    });
  }
});


// Disappearance events
beaver.on([ 4 ], function(raddec) {

});


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


// Handle scan button click
scanButton.addEventListener('click', scanForAdvertisements);