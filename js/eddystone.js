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
        parseEddystoneUid(transmitterSignature, data, callback);
        break;
      case 0x10:
        parseEddystoneUrl(transmitterSignature, data, callback);
        break;
      case 0x20:
        parseEddystoneTlm(transmitterSignature, data, callback);
        break;
      default:
        return callback(transmitterSignature, null, null);
    }
  }

  // Parse the given Eddystone-UID data
  function parseEddystoneUid(transmitterSignature, data, callback) {
    let namespace = parseId(data, 2, 11);
    let instance = parseId(data, 12, 17);
    let documentFragment = document.createDocumentFragment();
    let body = document.createElement('div');
    body.setAttribute('class', 'card-body');
    body.textContent = 'UID namespace: ' + namespace + ' instance: ' + instance;
    documentFragment.appendChild(body);
    return callback(transmitterSignature, null, documentFragment);
  }

  // Parse the given Eddystone-URL data
  function parseEddystoneUrl(transmitterSignature, data, callback) {
    let url = parseUrlSchemeByte(data[2]);

    if(!url) {
      return callback(transmitterSignature, null, null);
    }

    for(let cChar = 3; cChar < data.length; cChar++) {
      url += parseUrlCharByte(data[cChar]);
    }

    return callback(transmitterSignature, url, null);
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

  // Parse the id from the given data byte range
  function parseId(bytes, startIndex, stopIndex) {
    let id = '';

    for(cByte = startIndex; cByte <= stopIndex; cByte++) {
      id += ('00' + bytes[cByte].toString(16)).substr(-2);
    }

    return id;
  }

  // Parse the given URL scheme byte
  function parseUrlSchemeByte(byte) {
    switch(byte) {
      case 0x00:
        return 'http://www.';
      case 0x01:
        return 'https://www.';
      case 0x02:
        return 'http://';
      case 0x03:
        return 'https://';
      default:
        return null;
    }
  }

  // Parse the given URL character byte
  function parseUrlCharByte(byte) {
    switch(byte) {
      case 0x00:
        return '.com/';
      case 0x01:
        return '.org/';
      case 0x02:
        return '.edu/';
      case 0x03:
        return '.net/';
      case 0x04:
        return '.info/';
      case 0x05:
        return '.biz/';
      case 0x06:
        return '.gov/';
      case 0x07:
        return '.com';
      case 0x08:
        return '.org';
      case 0x09:
        return '.edu';
      case 0x0a:
        return '.net';
      case 0x0b:
        return '.info';
      case 0x0c:
        return '.biz';
      case 0x0d:
        return '.gov';
      default:
        return String.fromCharCode(byte);
    }
  }

  // Expose the following functions and variables
  return {
    SERVICE_UUID: SERVICE_UUID,
    parseServiceData: parseServiceData
  }

}());