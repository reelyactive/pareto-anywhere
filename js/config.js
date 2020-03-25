// This config.js file allows a user to easily modify implicit URL lookups
//   for digital twins.  Note that the use of such a config.js file is
//   experimental and may change in future for a more elegant solution
//   better aligned with Sniffypedia and/or a more DNS-like approach.


// Each namespace is a 10-byte Eddystone-UID namespace as a hex string
//   and is associated with a base URL to which will be added the 6-byte
//   Eddystone-UID instance as a hex string
const knownNamespaces = {
    "7265656c652055554944": "https://www.reelyactive.com/stories/"
};