Pareto Anywhere
===============

[Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) transforms ambient data into a real-time stream of _who/what_ is _where/how_.  Configured as a lightweight [Node.js package](https://www.npmjs.com/package/pareto-anywhere), this __pareto-anywhere__ package installs and runs quickly and easily on anything from a Raspberry Pi to a personal computer or server.  The bundled web apps and APIs offer a friendly introduction to the potential of [ambient data](https://www.reelyactive.com/ambient-data/) for real-time location and contextual applications.  Finally, the underlying code provides an intuitive launch point for developers.

![Pareto Anywhere logo](https://reelyactive.github.io/pareto-anywhere/images/pareto-anywhere-logo.png)


Quick start
-----------

Install the __pareto-anywhere__ package globally as follows:

    npm install -g pareto-anywhere

Then run from the command line as follows:

    pareto-anywhere

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running and browse the web apps and APIs.

Install with Docker
-----------

Build the docker image from the __pareto-anywhere__ folder:

    docker build -t pareto-anywhere:core .

Start the container of __pareto-anywhere__:

    docker run -d \
    -p 3001:3001/tcp \
    -p 50000:5000/udp \
    -p 50001:50001/udp \
    --restart unless-stopped \
    --name pareto-anywhere \
    pareto-anywhere:core

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running and browse the APIs.

What is Pareto Anywhere?
------------------------

__Pareto Anywhere__ is middleware that makes _any_ physical space location-aware for _any_ application by contextualising the real-time wireless ambient data stream collected from _any_ infrastructure.  This __pareto-anywhere__ package is a convenient, lightweight and novice-friendly configuration of __Pareto Anywhere__ which itself is highly modular and scalable.

![pareto-anywhere components](https://reelyactive.github.io/pareto-anywhere/images/pareto-anywhere-components.png)

__Pareto Anywhere__ is the collection of various open source software modules by [reelyActive](https://www.reelyactive.com) which are hosted in their own individual repositories, specifically:

| Software module                                           | Role |
|:----------------------------------------------------------|:-----|
| [barnowl](https://github.com/reelyactive/barnowl)         | Technology-agnostic middleware for RFID, RTLS and M2M |
| [barnacles](https://github.com/reelyactive/barnacles)     | Efficient data aggregator/distributor for RFID, RTLS and M2M |
| [barterer](https://github.com/reelyactive/barterer)       | Real-time location & sensor data API |
| [chickadee](https://github.com/reelyactive/chickadee)     | Contextual associations store and API |
| [advlib](https://github.com/reelyactive/advlib)           | Library for wireless advertising packet decoding |
| [sniffypedia](https://github.com/reelyactive/sniffypedia) | Index for implicit URI assocation |

The _experimental_ web app version of Pareto Anywhere which runs entirely in-browser is maintained in the gh-pages branch of this repository (see below).


Where's the ambient data?
-------------------------

This __pareto-anywhere__ package listens for data streams from the following sources:

- UDP [raddec](https://github.com/reelyactive/raddec) packets on port 50001 (ex: [from an Owl-in-One](https://reelyactive.github.io/diy/oio-config/))
- UDP [reel](https://www.reelyactive.com/technology/reel/) packets on port 50000
- HTTP POST to the /minew route (ex: [from a Minew G1](https://reelyactive.github.io/diy/minew-g1-config/))
- WebSocket connection on the /aruba route (ex: [from an Aruba AP](https://github.com/reelyactive/barnowl-aruba))

__Pareto Anywhere__ is [infrastructure-agnostic](https://www.reelyactive.com/pareto/anywhere/infrastructure/) and supports simultaneous data streams from a heterogeneous mix of sources.


Developer Notes
---------------

The pareto-anywhere codebase includes [Pareto Apps](https://github.com/reelyactive/pareto-anywhere-apps) as a git submodule (in the web/apps folder).  To update to the latest Pareto Apps run:

    git submodule update --remote

If developing Pareto Apps from within this repository, changes can be pushed to the Pareto Apps origin (pareto-anywhere-develop branch) by the usual means, from the web/apps folder:

    cd web/apps
    git checkout pareto-anywhere-develop
    ...update files...
    git add [...]
    git commit -m "Description of update"
    git push origin pareto-anywhere-develop


Pareto Anywhere Web App
-----------------------

The _experimental_ Web Bluetooth Scanning feature, introduced to the Chrome browser in late 2019, enables an _experimental_ web app version of Pareto Anywhere hosted [here](https://reelyactive.github.io/pareto-anywhere/), with code in the [gh-pages branch](https://github.com/reelyactive/pareto-anywhere/tree/gh-pages).


Project History
---------------

__Pareto Anywhere__ is in active development, evolving the [hlc-server](https://github.com/reelyactive/hlc-server/) code base (first created in 2014) which it is intended to supersede.  It is therefore normal for documentation to refer to hlc-server as a pseudonym of Pareto Anywhere.


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

[![Known Vulnerabilities](https://snyk.io/test/github/reelyactive/pareto-anywhere/badge.svg)](https://snyk.io/test/github/reelyactive/pareto-anywhere)


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
