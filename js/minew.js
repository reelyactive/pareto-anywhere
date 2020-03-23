/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


let minew = (function() {

  // Internal constants
  const SERVICE_UUID = 'ffe1';

  // Internal variables

  // Parse the given service data
  let parseServiceData = function(serviceData, data, urls) {
    if(serviceData[0] === 0xa1) {
      switch(serviceData[1]) {
        case 0x01:
          parseTemperatureHumidity(serviceData, data, urls);
          break;
        case 0x02:
          parseVisibleLight(serviceData, data, urls);
          break;
        case 0x03:
          parseAccelerometer(serviceData, data, urls);
          break;
        case 0x08:
          parseInfo(serviceData, data, urls);
          break;
        default:
          return;
      }
    }
  }

  // Parse the given temperature and humidity data
  function parseTemperatureHumidity(serviceData, data, urls) {
    let batteryPercentage = serviceData[2];
    let temperature = toDecimal(serviceData[3], serviceData[4]);
    let humidityPercentage = toDecimal(serviceData[5], serviceData[6]);
    let macAddress = toMacAddress(serviceData, 7);
    let sensorData = { temperature: temperature,
                       humidityPercentage: humidityPercentage,
                       batteryPercentage: batteryPercentage,
                       macAddress: macAddress };
    data.unshift(sensorData);
  }

  // Parse the given visible light data
  function parseVisibleLight(serviceData, data, urls) {
    let batteryPercentage = serviceData[2];
    let visibleLight = (serviceData[3] > 0);
    let macAddress = toMacAddress(serviceData, 4);
    let sensorData = { visibleLight: visibleLight,
                       batteryPercentage: batteryPercentage,
                       macAddress: macAddress };
    data.unshift(sensorData);
  }

  // Parse the given accelerometer data
  function parseAccelerometer(serviceData, data, urls) {
    let batteryPercentage = serviceData[2];
    let acceleration = [ toDecimal(serviceData[3], serviceData[4]),
                         toDecimal(serviceData[5], serviceData[6]),
                         toDecimal(serviceData[7], serviceData[8]) ];
    let macAddress = toMacAddress(serviceData, 9);
    let sensorData = { acceleration: acceleration,
                       batteryPercentage: batteryPercentage,
                       macAddress: macAddress };
    data.unshift(sensorData);
  }

  // Parse the given info data
  function parseInfo(serviceData, data, urls) {
    let batteryPercentage = serviceData[2];
    let macAddress = toMacAddress(serviceData, 3);
    let name = 'PLUS';  // TODO: make dynamic
    let infoData = { name: name, batteryPercentage: batteryPercentage,
                     macAddress: macAddress };
    data.unshift(infoData);
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

  // Convert the given bytes to a MAC address
  function toMacAddress(bytes, startIndex) {
    let macAddress = '';

    for(let cByte = 5; cByte >= 0; cByte--) {
      macAddress += ('0' + bytes[startIndex + cByte].toString(16)).substr(-2);
    }

    return macAddress;
  }

  // Expose the following functions and variables
  return {
    SERVICE_UUID: SERVICE_UUID,
    parseServiceData: parseServiceData
  }

}());