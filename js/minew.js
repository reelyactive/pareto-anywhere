/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


let minew = (function() {

  // Internal constants
  const SERVICE_UUID = 'ffe1';

  // Internal variables

  // Parse the given service data
  let parseServiceData = function(transmitterSignature, serviceData,
                                  deviceData) {
    if(serviceData[0] === 0xa1) {
      switch(serviceData[1]) {
        case 0x01:
          parseTemperatureHumidity(transmitterSignature, serviceData,
                                   deviceData);
          break;
        case 0x02:
          parseVisibleLight(transmitterSignature, serviceData, deviceData);
          break;
        case 0x03:
          parseAccelerometer(transmitterSignature, serviceData, deviceData);
          break;
        case 0x08:
          parseInfo(transmitterSignature, serviceData, deviceData);
          break;
        default:
          return;
      }
    }
  }

  // Parse the given temperature and humidity data
  function parseTemperatureHumidity(transmitterSignature, serviceData,
                                    deviceData) {
    let temperature = 0;
    let humidityPercentage = 0;
    let batteryPercentage = 100;
    let data = { temperature: temperature,
                 humidityPercentage: humidityPercentage,
                 batteryPercentage: batteryPercentage };
    deviceData.push(data);
  }

  // Parse the given visible light data
  function parseVisibleLight(transmitterSignature, serviceData, deviceData) {
    let visibleLight = true;
    let batteryPercentage = 100;
    let data = { visibleLight: visibleLight,
                 batteryPercentage: batteryPercentage };
    deviceData.push(data);
  }

  // Parse the given accelerometer data
  function parseAccelerometer(transmitterSignature, serviceData, deviceData) {
    let acceleration = [ 0, 0, 0 ];
    let batteryPercentage = 100;
    let data = { acceleration: acceleration,
                 batteryPercentage: batteryPercentage };
    deviceData.push(data);
  }

  // Parse the given info data
  function parseInfo(transmitterSignature, serviceData, deviceData) {
    let name = 'PLUS';
    let batteryPercentage = 100;
    let data = { name: name, batteryPercentage: batteryPercentage };
    deviceData.push(data);
  }

  // Expose the following functions and variables
  return {
    SERVICE_UUID: SERVICE_UUID,
    parseServiceData: parseServiceData
  }

}());