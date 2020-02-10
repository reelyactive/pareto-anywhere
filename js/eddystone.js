/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


let eddystone = (function() {

  // Internal constants
  const SERVICE_UUID = 'feaa';

  // Internal variables

  // Parse the given service data
  let parseServiceData = function(transmitterSignature, data, callback) {
    switch(data[0]) {
      case 0x00:
        parseEddystoneUid(data, callback);
        break;
      case 0x10:
        parseEddystoneUrl(data, callback);
        break;
      case 0x20:
        parseEddystoneTlm(data, callback);
        break;
      default:
        return callback(transmitterSignature, null, null);
    }
  }

  // Parse the given Eddystone-UID data
  function parseEddystoneUid(transmitterSignature, data, callback) {
    let documentFragment = document.createDocumentFragment();
    let body = document.createElement('div');
    body.setAttribute('class', 'card-body');
    body.textContent = 'UID: ' + data;
    documentFragment.appendChild(body);
    return callback(transmitterSignature, null, documentFragment);
  }

  // Parse the given Eddystone-URL data
  function parseEddystoneUrl(transmitterSignature, data, callback) {
    let documentFragment = document.createDocumentFragment();
    let body = document.createElement('div');
    body.setAttribute('class', 'card-body');
    body.textContent = 'URL: ' + data;
    documentFragment.appendChild(body);
    return callback(transmitterSignature, null, documentFragment);
  }

  // Parse the given Eddystone-TLM data
  function parseEddystoneTlm(transmitterSignature, data, callback) {
    let documentFragment = document.createDocumentFragment();
    let body = document.createElement('div');
    body.setAttribute('class', 'card-body');
    body.textContent = 'TLM: ' + data;
    documentFragment.appendChild(body);
    return callback(transmitterSignature, null, documentFragment);
  }

  // Expose the following functions and variables
  return {
    SERVICE_UUID: SERVICE_UUID,
    parseServiceData: parseServiceData
  }

}());