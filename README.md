Pareto Anywhere (Web App Version)
=================================

This is the __experimental__ web app version of [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) which runs in a browser that supports the __experimental__ [Web Bluetooth Scanning](https://webbluetoothcg.github.io/web-bluetooth/scanning.html) feature.  [This video](https://youtu.be/EZ82ZPCiLNI) demonstrates the functionality of the initial version launched in March 2020.


Try it!
-------

If your browser and device support Web Bluetooth Scanning, you can get up and running in two steps:
- [Enable Web Bluetooth Scanning](https://reelyactive.github.io/pareto-anywhere/enable-web-bluetooth-scanning/)
- Browse to the [Pareto Anywhere Web App](https://reelyactive.github.io/pareto-anywhere/)


What's under the hood?
----------------------

The Pareto Anywhere web app is written in HTML, CSS and Vanilla JS as per the [reelyActive Web Style Guide](https://github.com/reelyactive/web-style-guide).  The open source BeaCorCut stack of client-side JS serves to handle the decodings and fetch and render the digital twins.  Key files include:

| File               | Description                                             |
|:-------------------|:--------------------------------------------------------|
| pareto-anywhere.js | Includes the Web Bluetooth Scanning code as well as all application code |
| beaver.js          | Handles the real-time _stream_ of radio decodings       |
| cormorant.js       | Fetches structured data of digital twins via URLs       |
| cuttlefish.js      | Renders the digital twins and associated real-time data |


Purpose of this project?
------------------------

Web Bluetooth Scanning is an __experimental__ feature unlikely to become widely accessible in the near future.  The purpose of this project is therefore not to create a proverbial "killer app", but rather to advance the following objectives in the spirit of open source software development:
- provide a quick-and-dirty tool for debugging and testing BLE deployments and experiments
- explore, validate and improve the interaction design (IxD) for real-time proximity interactions
- provide an accessible means for community users to contribute to the open source [advlib](https://github.com/reelyactive/advlib/) library (the goal is for v1.0 to support both server-side and client-side)
- serve as a springboard for rapidly prototyping location-and-context-driven applications with a low technical barrier to entry


Keen to contribute?
-------------------

Fork the project and share with the world!  We'll do our best to incorporate any improvements in line with the purpose of this project, as described above.


License
-------

MIT License

Copyright (c) 2020-2021 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
