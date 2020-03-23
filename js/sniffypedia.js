/*
 * This Sniffypedia is made available under the Open Database License:
 * http://opendatacommons.org/licenses/odbl/1.0/.
 * Any rights in individual contents of the database are licensed under
 * Creative Commons Attribution-ShareAlike 4.0 International:
 * https://creativecommons.org/licenses/by-sa/4.0/
 */


let sniffypedia = (function() {

  // Bluetooth Low Energy 16-bit UUIDs
  // See: https://www.bluetooth.com/specifications/assigned-numbers/16-bit-uuids-for-members
  let ble_uuid16 = {
    "fefd": "Organization/Gimbal_Inc/",
    "fefc": "Organization/Gimbal_Inc/",
    "fefa": "Organization/PayPal_Inc/",
    "fef9": "Organization/PayPal_Inc/",
    "fef8": "Organization/Aplix_Corporation/",
    "fef7": "Organization/Aplix_Corporation/",
    "fef6": "Organization/Wicentric_Inc/",
    "fef5": "Organization/Dialog_Semiconductor_BV/",
    "fef4": "Organization/Google/",
    "fef3": "Organization/Google/",
    "fef2": "Organization/CSR/",
    "fef1": "Organization/CSR/",
    "feef": "Organization/Polar_Electro_Oy/",
    "feee": "Organization/Polar_Electro_Oy/",
    "feed": "Product/Tile_Tile/",
    "feeb": "Organization/Swirl_Networks_Inc/",
    "feea": "Organization/Swirl_Networks_Inc/",
    "fee7": "Organization/Tencent_Holdings_Limited/",
    "fee6": "Organization/Seed_Labs_Inc/",
    "fee5": "Organization/Nordic_Semiconductor_ASA/",
    "fee4": "Organization/Nordic_Semiconductor_ASA/",
    "fedd": "Organization/Jawbone/",
    "fedc": "Organization/Jawbone/",
    "fed9": "Organization/Pebble_Technology_Corporation/",
    "fed4": "Organization/Apple_Inc/",
    "fed3": "Organization/Apple_Inc/",
    "fed2": "Organization/Apple_Inc/",
    "fed1": "Organization/Apple_Inc/",
    "fed0": "Organization/Apple_Inc/",
    "fecf": "Organization/Apple_Inc/",
    "fece": "Organization/Apple_Inc/",
    "fecd": "Organization/Apple_Inc/",
    "fecc": "Organization/Apple_Inc/",
    "fecb": "Organization/Apple_Inc/",
    "feca": "Organization/Apple_Inc/",
    "fec9": "Organization/Apple_Inc/",
    "fec8": "Organization/Apple_Inc/",
    "fec7": "Organization/Apple_Inc/",
    "fec4": "Organization/PLUS_Location_Systems/",
    "febe": "Organization/Bose_Corporation/",
    "feba": "Organization/Tencent_Holdings_Limited/",
    "feb9": "Organization/LG_Electronics/",
    "feb8": "Organization/Facebook_Inc/",
    "feb7": "Organization/Facebook_Inc/",
    "feb2": "Organization/Microsoft/",
    "feb0": "Organization/Nest_Labs/",
    "feaf": "Organization/Nest_Labs/",
    "feaa": "Product/Google_Eddystone/",
    "fea6": "Organization/GoPro_Inc/",
    "fea5": "Organization/GoPro_Inc/",
    "fea0": "Product/Google_Chromecast/",
    "fe9f": "Product/Google_Chromecast/",
    "fe9e": "Organization/Dialog_Semiconductor_BV/",
    "fe9a": "Organization/Estimote_Inc/",
    "fe95": "Organization/Xiaomi/",
    "fe8f": "Organization/CSR/",
    "fe8b": "Organization/Apple_Inc/",
    "fe8a": "Organization/Apple_Inc/",
    "fe86": "Organization/Huawei_Technologies_Co_Ltd/",
    "fe65": "Organization/CHIPOLO/",
    "fe61": "Organization/Logitech_International_SA/",
    "fe59": "Organization/Nordic_Semiconductor_ASA/",
    "fe58": "Organization/Nordic_Semiconductor_ASA/",
    "fe56": "Organization/Google/",
    "fe55": "Organization/Google/",
    "fe50": "Organization/Google/",
    "fe3b": "https://www.dolby.com/",
    "fe36": "Organization/Huawei_Technologies_Co_Ltd/",
    "fe35": "Organization/Huawei_Technologies_Co_Ltd/",
    "fe33": "Organization/CHIPOLO/",
    "fe2c": "Organization/Google/",
    "fe27": "Organization/Google/",
    "fe26": "Organization/Google/",
    "fe25": "Organization/Apple_Inc/",
    "fe24": "Organization/August_Home_Inc/",
    "fe21": "Organization/Bose_Corporation/",
    "fe1f": "Organization/Garmin_International/",
    "fe19": "Organization/Google/",
    "fe13": "Organization/Apple_Inc/",
    "fe08": "Organization/Microsoft/",
    "fdf0": "Organization/Google/",
    "fdee": "Organization/Huawei_Technologies_Co_Ltd/",
    "fde2": "Organization/Google/"
  };


  // Bluetooth Low Energy 128-bit UUIDs
  let ble_uuid128 = {
    "adab0bd16e7d4601bda2bffaa68956ba": "Product/Fitbit_Wearable/",
    "adab0cf56e7d4601bda2bffaa68956ba": "Product/Fitbit_Wearable/",
    "adab71766e7d4601bda2bffaa68956ba": "Product/Fitbit_Wearable/",
    "adabfb006e7d4601bda2bffaa68956ba": "Product/Fitbit_Wearable/",
    "52052c11e701478299f58ce88dbb1500": "Product/Allegion_ENGAGE/",
    "6e400001b5a3f393e0a9e50e24dcca9e": "Organization/Nordic_Semiconductor_ASA/",
    "7265656c794163746976652055554944": "Product/reelyActive_RA-R436/",
    "7265656c7941707020416e64726f6964": "Product/reelyActive_reelyApp-Android/",
    "7265656c7941707020666f7220694f53": "Product/reelyActive_reelyApp-iOS/",
    "cbbfe0e1f7f3420684e084cbb3d09dfc": "Product/ASUS_Nexus-Player/",
    "d2d3f8ef9c994d9ca2b391c85d44326c": "Product/Nest_Cam/",
    "d5060001a904deb947482c7f4a124842": "Product/Thalmic-Labs_Myo/",
    "f02adfc026e711e49edc0002a5d5c51b": "Product/Shortcut-Labs_FLIC/"
  };


  // Bluetooth Low Energy company identifiers
  // See:https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers
  let ble_companyIdentifiers = {
    "0003": "Organization/IBM_Corporation/",
    "0004": "Organization/Toshiba_Corporation/",
    "0006": "Organization/Microsoft/",
    "000a": "Organization/CSR/",
    "004c": "Organization/Apple_Inc/",
    "0059": "Organization/Nordic_Semiconductor_ASA/",
    "005f": "Organization/Wicentric_Inc/",
    "006b": "Organization/Polar_Electro_Oy/",
    "0075": "Organization/Samsung/",
    "0078": "Organization/Nike_Inc/",
    "0087": "Organization/Garmin_International/",
    "008a": "Organization/Jawbone/",
    "008c": "Organization/Gimbal_Inc/",
    "009e": "Organization/Bose_Corporation/",
    "00b5": "Organization/Swirl_Networks_Inc/",
    "00bd": "Organization/Aplix_Corporation/",
    "00c4": "Organization/LG_Electronics/",
    "00c7": "Organization/Quuppa_Oy/",
    "00cc": "Organization/Beats_Electronics/",
    "00cd": "Organization/Microchip_Technology_Inc/",
    "00d2": "Organization/Dialog_Semiconductor_BV/",
    "00df": "Organization/Misfit_Inc/",
    "00e0": "Organization/Google/",
    "00f0": "Organization/PayPal_Inc/",
    "0104": "Organization/PLUS_Location_Systems/",
    "012d": "Organization/Sony_Corporation/",
    "0131": "Organization/Cypress_Semiconductor_Corporation/",
    "0136": "Organization/Seed_Labs_Inc/",
    "013a": "Organization/Tencent_Holdings_Limited/",
    "0147": "Organization/Mighty_Cast_Inc/",
    "0154": "Organization/Pebble_Technology_Corporation/",
    "0157": "Organization/Xiaomi/",
    "015d": "Organization/Estimote_Inc/",
    "015e": "Organization/UniKey_Technologies_Inc/",
    "0180": "Organization/Gigaset_Communications_GmbH/",
    "0195": "Organization/Zuli_Inc/",
    "01ab": "Organization/Facebook_Inc/",
    "01b5": "Organization/Nest_Labs/",
    "01d1": "Organization/August_Home_Inc/",
    "01da": "Organization/Logitech_International_SA/",
    "0211": "Organization/Telink_Semiconductor_Co_Ltd/",
    "0225": "Organization/Nestle_Nespresso_SA/",
    "027d": "Organization/Huawei_Technologies_Co_Ltd/",
    "02b2": "Product/OURA_Ring/",
    "02d3": "Organization/Powercast_Corporation/",
    "02f2": "Organization/GoPro_Inc/",
    "0309": "https://www.dolby.com/",
    "03c2": "Organization/Snapchat_Inc/",
    "0399": "Organization/Nikon_Corporation/",
    "0499": "Organization/Ruuvi_Innovations_Ltd/",
    "0528": "Organization/Lunera_Inc/",
    "0583": "Organization/Code_Blue_Communications_Inc/",
    "0639": "Organization/Shenzhen_Minew_Technologies_Co_Ltd/"
  };


  // Bluetooth Low Energy iBeacons (128-bit UUIDs)
  let ble_iBeacons = {
    "07775dd0111b11e491910800200c9a66": "Product/XY-Findables_Beacon/",
    "0d60a2892039442198216b12c4274890": "Product/Bluetooth_World_2017_Beacon/",
    "2f234454cf6d4a0fadf2f4911ba9ffa6": "Product/Radius-Networks_Beacon/",
    "3d4f13b4d1fd404980e5d3edcc840b69": "Product/Orange_Beacon/",
    "61687109905f443691f8e602f514c96d": "Product/BlueCats_Beacon/",
    "7265656c794163746976652055554944": "Product/reelyActive_RA-R436/",
    "74278bdab64445208f0c720eaf059935": "Product/Minew_Beacon/",
    "8deefbb9f7384297804096668bb44281": "Product/Roximity_Beacon/",
    "b9407f30f5f8466eaff925556b57fe6d": "Product/Estimote_Beacon/",
    "d0d3fa86ca7645ec9bd96af4927d7be1": "Product/Estimote_Beacon/",
    "dab59c4fa4d6ee286bfe8e0000bbc2bb": "Product/Cocoanut-Manor_eNote/",
    "e2c56db5dffb48d2b060d0f5a71096e0": "Product/Bright_Beacon/",
    "f0018b9b75094c31a9051a27d39c003c": "Product/Locoslab_Beacon/",
    "f3077abe93ac465aacf167f080cb7aef": "Product/The-Bubbles-Company_Beacon/",
    "f7826da64fa24e988024bc5b71e0893e": "Product/Kontakt_Beacon/"
  };

  // Bluetooth Low Energy
  let ble = {
    uuid16: ble_uuid16,
    uuid128: ble_uuid128,
    companyIdentifiers: ble_companyIdentifiers,
    iBeacons: ble_iBeacons
  };


  // Expose the following functions and variables
  return {
    ble: ble
  }

}());
