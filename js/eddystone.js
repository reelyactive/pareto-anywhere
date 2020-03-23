/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


let eddystone = (function() {

  // Internal constants
  const SERVICE_UUID = 'feaa';

  // Internal variables

  // Parse the given service data
  let parseServiceData = function(serviceData) {
    switch(serviceData[0]) {
      case 0x00:
        return parseEddystoneUid(serviceData);
      case 0x10:
        return parseEddystoneUrl(serviceData);
      case 0x20:
        return parseEddystoneTlm(serviceData);
      default:
        return null;
    }
  }

  // Parse the given Eddystone-UID data
  function parseEddystoneUid(serviceData) {
    let namespace = parseId(serviceData, 2, 11);
    let instance = parseId(serviceData, 12, 17);

    return { namespace: namespace, instance: instance };
  }

  // Parse the given Eddystone-URL data
  function parseEddystoneUrl(serviceData) {
    let url = parseUrlSchemeByte(serviceData[2]);

    if(!url) {
      return;
    }

    for(let cChar = 3; cChar < serviceData.length; cChar++) {
      url += parseUrlCharByte(serviceData[cChar]);
    }

    return { url: url };
  }

  // Parse the given Eddystone-TLM data
  function parseEddystoneTlm(serviceData) {
    let version = serviceData[1];

    if(version === 0x00) {
      let batteryVoltage = ((serviceData[2] * 256) + serviceData[3]) / 1000;
      let temperature = toDecimal(serviceData[4], serviceData[5]);
      let advertisingCount = (serviceData[6] << 24) + (serviceData[7] << 16) +
                             (serviceData[8] << 8) + serviceData[9];
      let uptime = ((serviceData[10] << 24) + (serviceData[11] << 16) +
                    (serviceData[12] << 8) + serviceData[13]) * 1000;

      return { batteryVoltage: batteryVoltage,
               temperature: temperature,
               advertisingCount: advertisingCount,
               uptime: uptime };
    }
    else if(version === 0x01) {
      let encryptedTlm = parseId(serviceData, 2, 13);
      let salt = parseId(serviceData, 14, 15);
      let mic = parseId(serviceData, 16, 17);

      return { encryptedTlm: encryptedTlm,
               salt: salt,
               mic: mic };
    }

    return null;
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

  // Convert the given signed 8.8 fixed-point bytes to decimal.
  function toDecimal(integerByte, decimalByte) {
    let integer = integerByte;
    let decimal = decimalByte / 256;

    if(integer > 127) {
      return (integer - 256) + decimal;
    }
    return integer + decimal;
  }

  // Expose the following functions and variables
  return {
    SERVICE_UUID: SERVICE_UUID,
    parseServiceData: parseServiceData
  }

}());