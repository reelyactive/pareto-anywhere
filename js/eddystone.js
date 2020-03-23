/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


let eddystone = (function() {

  // Internal constants
  const SERVICE_UUID = 'feaa';

  // Internal variables

  // Parse the given service data
  let parseServiceData = function(serviceData, data, urls) {
    switch(serviceData[0]) {
      case 0x00:
        parseEddystoneUid(serviceData, data, urls);
        break;
      case 0x10:
        parseEddystoneUrl(serviceData, data, urls);
        break;
      case 0x20:
        parseEddystoneTlm(serviceData, data, urls);
        break;
      default:
        return;
    }
  }

  // Parse the given Eddystone-UID data
  function parseEddystoneUid(serviceData, data, urls) {
    let namespace = parseId(serviceData, 2, 11);
    let instance = parseId(serviceData, 12, 17);
    let uidData = { namespace: namespace, instance: instance };
    data.unshift(uidData);
  }

  // Parse the given Eddystone-URL data
  function parseEddystoneUrl(serviceData, data, urls) {
    let url = parseUrlSchemeByte(serviceData[2]);

    if(!url) {
      return;
    }

    for(let cChar = 3; cChar < serviceData.length; cChar++) {
      url += parseUrlCharByte(serviceData[cChar]);
    }

    let isNewUrl = (urls.indexOf(url) < 0);
    if(isNewUrl) {
      urls.push(url);
    }
  }

  // Parse the given Eddystone-TLM data
  function parseEddystoneTlm(serviceData, data, urls) {
    let tlmData = { tlm: serviceData };
    data.unshift(tlmData);
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