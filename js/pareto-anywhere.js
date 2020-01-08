/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


// Constant definitions
const SCAN_OPTIONS = {
    acceptAllAdvertisements: true,
    keepRepeatedDevices: true
};


// DOM elements
let scanButton = document.querySelector('#scanButton');
let stopButton = document.querySelector('#stopButton');
let scanError = document.querySelector('#scanError');


// Attempt to run the experimental requestLEScan function
async function scanForAdvertisements() {
  try {
    const scan = await navigator.bluetooth.requestLEScan(SCAN_OPTIONS);
    let numberOfEvents = 0;
    scanButton.textContent = 'Scanning...';
    scanButton.setAttribute('class', 'btn btn-outline-dark');
    scanButton.setAttribute('disabled', true);
    stopButton.setAttribute('class', 'btn btn-primary');
    stopButton.removeAttribute('disabled');

    navigator.bluetooth.addEventListener('advertisementreceived', event => {
      handleScanEvent(event);
      numberOfEvents++;
    });

    function stopScan() {
      let stopTime = new Date().toLocaleTimeString();
      scan.stop();
      scanButton.textContent = 'Scan';
      scanButton.setAttribute('class', 'btn btn-primary mb-2');
      scanButton.removeAttribute('disabled');
      stopButton.setAttribute('class', 'btn btn-outline-dark mb-2');
      stopButton.setAttribute('disabled', true);
      stopButton.removeEventListener('click', stopScan);
    }

    stopButton.addEventListener('click', stopScan);
  }
  catch(error)  {
    scanError.removeAttribute('hidden');
  }
}


// Handle a scan event
function handleScanEvent(event) {
  let deviceId = base64toHex(event.device.id);
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


// Handle scan button click
scanButton.addEventListener('click', scanForAdvertisements);