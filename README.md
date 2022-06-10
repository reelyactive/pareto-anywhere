Pareto Anywhere
===============

[Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) enables [context-aware physical spaces](https://www.reelyactive.com/context-aware-physical-spaces/).  __Pareto Anywhere__ is continuously-evolving open source middleware that transforms [ambient data](https://www.reelyactive.com/ambient-data/) into [hyperlocal context](https://www.reelyactive.com/context/): a real-time stream of _who/what_ is _where/how_.

Configured as a lightweight [Node.js package](https://www.npmjs.com/package/pareto-anywhere), this __pareto-anywhere__ package installs quickly, and easily runs edge, local or cloud, on anything from a Raspberry Pi to a personal computer or server.  The bundled web apps, APIs and Elastic Stack integration offer a friendly and comprehensive introduction to context-aware physical spaces.  And, thanks to a modular, open architecture, __Pareto Anywhere__ can easily be customised for scale and/or functionality.

![Pareto Anywhere logo](https://reelyactive.github.io/pareto-anywhere/images/pareto-anywhere-logo.png)


Installation guides
-------------------

Install __Pareto Anywhere__ by following a step-by-step tutorial on our [reelyActive Developers](https://reelyactive.github.io/) site:
- [Run Pareto Anywhere on a personal computer](https://reelyactive.github.io/diy/pareto-anywhere-pc/)
- [Run Pareto Anywhere on a Raspberry Pi](https://reelyactive.github.io/diy/pareto-anywhere-pi/)


Quick start
-----------

_Alternatively_, install the __pareto-anywhere__ package globally as follows:

    npm install -g pareto-anywhere

Then run from the command line as follows:

    pareto-anywhere

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running and browse the web apps and APIs.


Dev install
-----------

_Alternatively_, clone the repo and submodules as follows:

    git clone --recurse-submodules https://github.com/reelyactive/pareto-anywhere.git

Then, from the pareto-anywhere folder, install the dependencies and run:

    cd pareto-anywhere
    npm install
    npm start

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running and browse the web apps and APIs.


What is Pareto Anywhere?
------------------------

__Pareto Anywhere__ is middleware that makes _any_ physical space context-aware for _any_ application by processing the real-time wireless ambient data stream collected from _any_ infrastructure.  This __pareto-anywhere__ package is a convenient, lightweight and novice-friendly configuration of __Pareto Anywhere__ which itself is highly modular and scalable.

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
- UDP [Huawei](https://github.com/reelyactive/barnowl-huawei/) packets on port 50010
- HTTP POST to the /minew route (ex: [from a Minew G1](https://reelyactive.github.io/diy/minew-g1-config/)) _(G1 firmware v4.x required since Pareto Anywhere v1.7)_
- HTTP POST to the /impinj route
- WebSocket connection on the /aruba route (ex: [from an Aruba AP](https://github.com/reelyactive/barnowl-aruba))

If a local Bluetooth radio is available, [barnowl-hci](https://github.com/reelyactive/barnowl-hci/#pareto-anywhere-integration) can be installed and run with the command `npm run forwarder` to forward the data to Pareto Anywhere.

__Pareto Anywhere__ is [infrastructure-agnostic](https://www.reelyactive.com/pareto/anywhere/infrastructure/) and supports simultaneous data streams from a heterogeneous mix of sources.


Collect and analyse the data with the Elastic Stack
---------------------------------------------------

This __pareto-anywhere__ package writes its real-time stream of data to an Elasticsearch database, if installed and running, so that it may in turn be analysed in Kibana.

If an Elasticsearch database is running locally at [http://localhost:9200](http://localhost:9200/), data storage should be automatic, with the data available for analysis at [http://localhost:5601](http://localhost:5601/) if Kibana is also running locally.

To instead have __pareto-anywhere__ store data in a _remote_ Elasticsearch database, first set the environment variable ELASTICSEARCH_NODE to the corresponding URL, including the corresponding username and password, for example:

    https://username:password@server.com:9243

Elasticsearch and Kibana are _not_ required to enjoy the real-time functionality of Pareto Anywhere.  Instead, they add extensive, user-friendly data analysis functionality as described in our [Kibana tutorials](https://reelyactive.github.io/diy/kibana/).


Build and run with Docker
-------------------------

For users who prefer deployment using containers, first build the Docker image from the root folder of this repository:

    docker build -t pareto-anywhere:core .

Then start the container:


    docker run -d \
    -p 3001:3001/tcp \
    -p 50000:5000/udp \
    -p 50001:50001/udp \
    --restart unless-stopped \
    --name pareto-anywhere \
    pareto-anywhere:core

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running and browse the APIs.


Run Pareto Anywhere, Elastisearch and Kibana with Docker-Compose
----------------------------------------------------------------

For users who prefer deployment using containers, Deploy Elasticsearch, Kibana and Pareto Anywhere from the root folder of this repository:

    docker-compose up -d

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running and browse the APIs.
Browse to [localhost:5601](http://localhost:5601) to see __Kibana__ dashboard running.
Browse to [localhost:9200](http://localhost:9200) to see __Elasticsearch__ running and browse the APIs.


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

__pareto-anywhere__ v1.5.0 adopts [chickadee](https://github.com/reelyactive/chickadee) v1.4.0 which migrates to [ESMapDB](https://github.com/reelyactive/esmapdb) from [NeDB](https://github.com/louischatriot/nedb). If upgrading from a previous version, any stored associations will need to be recreated.


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

Copyright (c) 2020-2022 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
