Pareto Anywhere
===============

__Pareto Anywhere__ is the open source middleware that enables context-aware physical spaces—_anywhere._

![Overview of Pareto Anywhere](https://reelyactive.github.io/pareto-anywhere/images/overview.png)

__Pareto Anywhere__ provides a single standard stream of real-time data, in the form of developer-friendly JSON, regardless of the underlying radio-identifiable devices & technologies.

__pareto-anywhere__ is a lightweight [Node.js package](https://www.npmjs.com/package/pareto-anywhere) that can run on resource-constrained edge devices as well as on powerful cloud servers and anything in between (i.e. _Anywhere_).  The bundled web apps, APIs and integrations offer a friendly and comprehensive introduction to [context-aware physical spaces](https://www.reelyactive.com/context-aware-physical-spaces/).  And, thanks to a modular, open architecture, __pareto-anywhere__ can easily be customised for scale and/or functionality.

Learn more at [www.reelyactive.com/pareto/anywhere/](https://www.reelyactive.com/pareto/anywhere/)


Getting Started
---------------

Follow our step-by-step tutorials to get started with __Pareto Anywhere__ on your platform of choice:
- [Run Pareto Anywhere on a personal computer](https://reelyactive.github.io/diy/pareto-anywhere-pc/)
- [Run Pareto Anywhere on a Raspberry Pi](https://reelyactive.github.io/diy/pareto-anywhere-pi/)

Learn "owl" about the __raddec__, __dynamb__ and __spatem__ JSON data output:
- [reelyActive Developer's Cheatsheet](https://reelyactive.github.io/diy/cheatsheet/)


Quick start
-----------

Clone this repository and its submodules with the command `git clone --recurse-submodules https://github.com/reelyactive/pareto-anywhere.git`, install package dependencies with `npm install`, and then from the root folder run at any time:

    npm start

_Alternatively_, install the __pareto-anywhere__ package globally with `npm install -g pareto-anywhere`, and then run at any time:

    pareto-anywhere

Either way, browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running, and to explore the web apps and APIs.


What is pareto-anywhere?
------------------------

__pareto-anywhere__ is a convenient collection of various open source software modules by [reelyActive](https://www.reelyactive.com) which, together, enable context-aware physical spaces.

![pareto-anywhere components](https://reelyactive.github.io/pareto-anywhere/images/pareto-anywhere-components.png)

These open source software modules are hosted each in their own individual repository as follows:

| Software module                                           | Role |
|:----------------------------------------------------------|:-----|
| [barnowl](https://github.com/reelyactive/barnowl)         | Technology-agnostic middleware for RFID, RTLS and M2M |
| [barnacles](https://github.com/reelyactive/barnacles)     | Efficient data aggregator/distributor for RFID, RTLS and M2M |
| [barterer](https://github.com/reelyactive/barterer)       | Real-time location & sensor data API |
| [chickadee](https://github.com/reelyactive/chickadee)     | Contextual associations store and API |
| [chimps](https://github.com/reelyactive/chimps)           | Spatial dynamics processor |
| [advlib](https://github.com/reelyactive/advlib)           | Library for wireless advertising packet decoding |
| [sniffypedia](https://github.com/reelyactive/sniffypedia) | Index for implicit URI assocation |
| [json-silo](https://github.com/reelyactive/json-silo)     | Digital twins store |

__pareto-anywhere__ is designed to serve as a friendly launch point for developers and end-users alike.  The [lib/paretoanywhere.js](blob/master/lib/paretoanywhere.js) file can easily be edited to facilitate custom applications, by adding or removing modules as necessary.


Input: Ambient Data
-------------------

__pareto-anywhere__ listens for [ambient data](https://www.reelyactive.com/ambient-data/) from multiple sources, using the following open source software modules:

| Software module                                               | Listens for |
|:--------------------------------------------------------------|:------------|
| [barnowl](https://github.com/reelyactive/barnowl)             | UDP raddec packets on port 50001 |
| [barnowl-aruba](https://github.com/reelyactive/barnowl-aruba) | WebSocket on /aruba |
| [barnowl-minew](https://github.com/reelyactive/barnowl-minew) | HTTP POST on /minew |
| [barnowl-reel](https://github.com/reelyactive/barnowl-reel)   | UDP reel packets on port 50000 |
| [barnowl-huawei](https://github.com/reelyactive/barnowl-huawei) | UDP Huawei packets on port 50010 |
| [barnowl-impinj](https://github.com/reelyactive/barnowl-impinj) | HTTP POST on /impinj |
| [barnowl-rfcontrols](https://github.com/reelyactive/barnowl-rfcontrols) | STOMP over WebSocket |

Additional sources can often be added by running `npm run forwarder` of the corresponding barnowl-x module, such as [barnowl-hci](https://github.com/reelyactive/barnowl-hci/#pareto-anywhere-integration).


Output: Hyperlocal Context
--------------------------

__pareto-anywhere__ outputs [hyperlocal context](https://www.reelyactive.com/context/) which may be queried via the /context API, or streamed as __raddec__, __dynamb__ and __spatem__ JSON data.  These JSON data structures are explained in the [reelyActive Developers Cheatsheet](https://reelyactive.github.io/diy/cheatsheet/).

These APIs are served by the following open source software modules:

| Software module                                       | API      |
|:------------------------------------------------------|:---------|
| [barterer](https://github.com/reelyactive/barterer)   | /devices |
| [chickadee](https://github.com/reelyactive/chickadee) | /context & /associations & /features |
| [json-silo](https://github.com/reelyactive/json-silo) | /stories |


Collect and analyse the data with the Elastic Stack
---------------------------------------------------

This __pareto-anywhere__ package writes its real-time stream of data to an Elasticsearch database, if installed and running, so that it may in turn be analysed in Kibana.
- __pareto-anywhere__ v1.8 and above expect an Elasticsearch 8.x instance, offering nominal backwards-compatiblility with 7.x
- __pareto-anywhere__ v1.7 and below require an Elasticsearch 7.x instance

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


![Pareto Anywhere logo](https://reelyactive.github.io/pareto-anywhere/images/pareto-anywhere-logo.png)


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

Copyright (c) 2020-2023 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
