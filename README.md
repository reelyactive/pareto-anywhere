Pareto Anywhere
===============

__Pareto Anywhere__ is the open source IoT middleware that makes the data from just about anything readily usable an application/technology/vendor-agnostic way.

![Overview of Pareto Anywhere](https://reelyactive.github.io/pareto-anywhere/images/overview.png)

__Pareto Anywhere__ provides a single standard stream of real-time data, in the form of developer-friendly JSON, regardless of the underlying radio-identifiable devices & technologies.

__pareto-anywhere__ is a lightweight [Node.js package](https://www.npmjs.com/package/pareto-anywhere) that can run on resource-constrained edge devices as well as on powerful cloud servers and anything in between (i.e. _Anywhere_).  The bundled web apps, APIs and integrations offer a friendly and comprehensive introduction to [context-aware physical spaces](https://www.reelyactive.com/context-aware-physical-spaces/).  And, thanks to a modular, open architecture, __pareto-anywhere__ can easily be customised for scale and/or functionality.

Learn more at [www.reelyactive.com/pareto/anywhere/](https://www.reelyactive.com/pareto/anywhere/)


Getting Started
---------------

Follow our step-by-step tutorials to get started with __Pareto Anywhere__ on your platform of choice:
- [Run Pareto Anywhere on a PC (or server)](https://reelyactive.github.io/diy/pareto-anywhere-pc/)
- [Run Pareto Anywhere on a Raspberry Pi](https://reelyactive.github.io/diy/pareto-anywhere-pi/)

Learn "owl" about the __raddec__, __dynamb__ and __spatem__ JSON data output:
- [reelyActive Developer's Cheatsheet](https://reelyactive.github.io/diy/cheatsheet/)

Build out an open source IoT stack using a PostgreSQL database and Grafana dashboards:
- [Grafana with PostgreSQL](https://reelyactive.github.io/diy/grafana-postgresql-prep/)


Quick(est) start
----------------

Install (or update) the __pareto-anywhere__ package globally with the command:

    npm install -g pareto-anywhere

Run at any time with the command:

    pareto-anywhere

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running, and to explore the web apps and APIs.

This installation affords _limited_ configuration through environment variables.  For _full_ configuration capability, instead follow the (Recommended) Quick start below.


(Recommended) Quick start
-------------------------

Clone this repository and its submodules, and install dependencies with the following commands:

    git clone --recurse-submodules https://github.com/reelyactive/pareto-anywhere.git
    cd pareto-anywhere
    npm install

Then from the __pareto-anywhere__ folder, run at any time with the command:

    npm start

Browse to [localhost:3001](http://localhost:3001) to see __Pareto Anywhere__ running, and to explore the web apps and APIs.

This installation affords _full_ configuration through custom startup scripts and environment variables.  Consult our [Create a Pareto Anywhere startup script](https://reelyactive.github.io/diy/pareto-anywhere-startup-script/) tutorial to learn more, and our [Run Pareto Anywhere as a Windows service](https://reelyactive.github.io/diy/pareto-anywhere-windows-service/) tutorial for running in production on Windows machines.


Updating
--------

An existing installation can be updated by running the following commands from the root of the cloned repository:

    git fetch
    git pull origin master --recurse-submodules
    npm install


What is pareto-anywhere?
------------------------

__pareto-anywhere__ is a convenient collection of complementary open source software modules by [reelyActive](https://www.reelyactive.com) which, together, collect ambient IoT data from common sources and process it into a standard JSON format that you can readily put to good use via APIs, web apps and familiar integrations.

![pareto-anywhere components](https://reelyactive.github.io/pareto-anywhere/images/pareto-anywhere-components.png)

These open source software modules are hosted each in their own individual repository as follows:

| Software module                                           | Role |
|:----------------------------------------------------------|:-----|
| [barnowl](https://github.com/reelyactive/barnowl)         | Interface for gateways, APs and readers |
| [barnacles](https://github.com/reelyactive/barnacles)     | Efficient data aggregator/distributor |
| [barterer](https://github.com/reelyactive/barterer)       | Real-time location & sensor data API |
| [chickadee](https://github.com/reelyactive/chickadee)     | Contextual associations store and API |
| [chimps](https://github.com/reelyactive/chimps)           | Spatial dynamics processor |
| [advlib](https://github.com/reelyactive/advlib)           | Library for wireless advertising packet decoding |
| [sniffypedia](https://github.com/reelyactive/sniffypedia) | Index for implicit URI assocation |
| [json-silo](https://github.com/reelyactive/json-silo)     | Digital twins store |
| [record-silo](https://github.com/reelyactive/record-silo) | Digital records store |

__pareto-anywhere__ is designed to serve as a friendly launch point for developers and end-users alike.  [Create a Pareto Anywhere startup script](https://reelyactive.github.io/diy/pareto-anywhere-startup-script/) to add and customise modules, or, if necessary, edit the [lib/paretoanywhere.js](blob/master/lib/paretoanywhere.js) file directly, to remove and customise modules.


Input: Ambient Data
-------------------

__pareto-anywhere__ listens for [ambient data](https://www.reelyactive.com/ambient-data/) from multiple sources, using the following open source software modules:

| Software module                                               | Listens for |
|:--------------------------------------------------------------|:------------|
| [barnowl](https://github.com/reelyactive/barnowl)             | UDP raddec packets on port 50001 |
| [barnowl-aruba](https://github.com/reelyactive/barnowl-aruba) | WebSocket on __/aruba__ |
| [barnowl-minew](https://github.com/reelyactive/barnowl-minew) | HTTP POST on __/minew__ |
| [barnowl-reel](https://github.com/reelyactive/barnowl-reel)   | UDP reel packets on port 50000 |
| [barnowl-huawei](https://github.com/reelyactive/barnowl-huawei) | UDP Huawei packets on port 50010 |
| [barnowl-impinj](https://github.com/reelyactive/barnowl-impinj) | HTTP POST on __/impinj__ |
| [barnowl-rfcontrols](https://github.com/reelyactive/barnowl-rfcontrols) | STOMP over WebSocket |
| [barnowl-csl](https://github.com/reelyactive/barnowl-csl)     | HTTP POST on __/csl__ |
| [barnowl-zebra](https://github.com/reelyactive/barnowl-zebra) | MQTT on localhost |
| [barnowl-axis](https://github.com/reelyactive/barnowl-axis)   | MQTT on localhost |

[Create a Pareto Anywhere startup script](https://reelyactive.github.io/diy/pareto-anywhere-startup-script/) to add and customise input modules, or forward __raddec__ data as UDP packets simply by running the `npm run forwarder` script of the corresponding barnowl-x module, such as [barnowl-hci](https://github.com/reelyactive/barnowl-hci/#pareto-anywhere-integration).  


Output: Hyperlocal Context
--------------------------

__pareto-anywhere__ outputs [hyperlocal context](https://www.reelyactive.com/context/) which may be queried via the __/context__ API, or streamed as __raddec__, __dynamb__ and __spatem__ JSON data by subscribing via MQTT and/or Socket.IO.  These JSON data structures are explained in the [reelyActive Developers Cheatsheet](https://reelyactive.github.io/diy/cheatsheet/).

The __pareto-anywhere__ APIs are served by the following open source software modules:

| Software module                                           | API          |
|:----------------------------------------------------------|:-------------|
| [barterer](https://github.com/reelyactive/barterer)       | __/devices__ |
| [chickadee](https://github.com/reelyactive/chickadee)     | __/context__ & __/associations__ & __/features__ |
| [json-silo](https://github.com/reelyactive/json-silo)     | __/stories__ |
| [record-silo](https://github.com/reelyactive/record-silo) | __/records__ |

Data is published, by default, to a MQTT broker on localhost by the [barnacles-mqtt](https://github.com/reelyactive/barnacles-mqtt) module which observes the following topic structure:

- `paretoanywhere/devices/[deviceId]/[deviceIdType]/raddec`
- `paretoanywhere/devices/[deviceId]/[deviceIdType]/dynamb`
- `paretoanywhere/devices/[deviceId]/[deviceIdType]/spatem`

The MQTT single-level wildcard (+) can be used to subscribe to all event types for a given device, and the multi-level wildcard (#) can be used to subscribe to all events for all devices, for example: `paretoanywhere/#`


### Output logfiles

To capture __raddec__ and __dynamb__ data into .csv files, from the root folder of this repository, start Pareto Anywhere with the command:

    npm run logfile

Files named raddec-yymmdd-hhmmss.csv and dynamb-yymmdd-hhmmss.csv will appear in the root folder when data is processed, rotating periodically, and which can be opened in a spreadsheet for analysis. 


Config Files
------------

The __/config__ folder, or a distinct folder specified by the PARETO_ANYWHERE_CONFIG_PATH environment variable, accepts the following run-time configuration files:

### certificate.pem & key.pem

On startup, __pareto-anywhere__ attempts to initiate a HTTPS server using these files, if present.  If not, a HTTP server is instantiated instead.

Note that ambient data sources which relay data to __pareto-anywhere__ should observe the corresponding protocol (http:// vs. https:// and ws:// vs. wss://) in their target configuration.

### enocean.json

EnOcean Alliance devices require a mapping between their device identifier and their EnOcean Equipment Profile (EEP) in order for their payload to be decoded by [advlib-esp](https://github.com/reelyactive/advlib-esp) and its sub-libraries.  The __/config/enocean.json__ file has the following format:

    {
      "05174fc4/7": { "eepType": "A5-04-03" },
      "0591ee96/7": { "eepType": "D5-00-01" },
      "04141559/7": { "eepType": "D2-14-41" },
      "002eea1f/7": { "eepType": "F6-02-02" }
    }

Note that the 32-bit device identifier is specified in _lowercase_ hexadecimal and suffixed with "/7" which represents the [EURID-32 idType](https://reelyactive.github.io/diy/cheatsheet/#idtype), while the eepType is specified in _UPPERCASE_ hexadecimal.


Native integrations
-------------------

__Pareto Anywhere__ integrates with just about any data store, stream processor or application either via existing APIs or the addition of a connector module.  Additionally, the following integrations are _natively_ supported by  __pareto-anywhere__.

### PostgreSQL

From the root folder of this repository, start Pareto Anywhere with the command:

    npm run postgres

If prompted, install [barnacles-postgres](https://github.com/reelyactive/barnacles-postgres/) with the command `npm install barnacles-postgres`.  __pareto-anywhere__ will automatically write __raddec__, __dynamb__ and __spatem__ data to a local PostgreSQL database, if installed and running.

The local PostgreSQL instance is expected at [http://localhost:5432](http://localhost:5432/) with user "reelyactive" and database "pareto_anywhere".  See [barnacles-postgres](https://github.com/reelyactive/barnacles-postgres/) for options and environment variables supporting alternative configurations.

Consult our [Install PostgreSQL and PostGIS](https://reelyactive.github.io/diy/postgresql-postgis-prep/) tutorial for step by step instructions.

### InfluxDB v2

From the root folder of this repository, start Pareto Anywhere with the command:

    npm run influxdb2

If prompted, install [barnacles-influxdb2](https://github.com/reelyactive/barnacles-influxdb2/) with the command `npm install barnacles-influxdb2`.  __pareto-anywhere__ will automatically write __dynamb__ data to a local InfluxDB v2 database, if installed and running.

The local InfluxDB v2 instance is expected at [http://localhost:8086](http://localhost:8086/) with org "reelyActive" and bucket "pareto-anywhere".  Set INFLUXDB_TOKEN as an environment variable.

### Elastic Stack

From the root folder of this repository, start Pareto Anywhere with the command:

    npm run elasticsearch

If prompted, install [barnacles-elasticsearch](https://github.com/reelyactive/barnacles-elasticsearch/) with the command `npm install barnacles-elasticsearch`.  __pareto-anywhere__ will automatically write to a local Elasticsearch database, if installed and running, so that the __raddec__ and __dynamb__ data may in turn be [analysed in Kibana](https://reelyactive.github.io/diy/kibana/).
- __pareto-anywhere__ v1.8 and above expect an Elasticsearch 8.x instance, offering nominal backwards-compatiblility with 7.x
- __pareto-anywhere__ v1.7 and below require an Elasticsearch 7.x instance

The local Elasticsearch instance is expected at [http://localhost:9200](http://localhost:9200/) and, if a Kibana instance is also running, the data will be available for analysis at [http://localhost:5601](http://localhost:5601/).

To instead have __pareto-anywhere__ store data in a _remote_ Elasticsearch database, first set the environment variable ELASTICSEARCH_NODE to the corresponding URL, including the corresponding username and password, for example:

    https://username:password@server.com:9243

### Node-RED

The [@reelyactive/node-red-pareto-anywhere](https://flows.nodered.org/node/@reelyactive/node-red-pareto-anywhere) Flow includes a __pareto-anywhere-socketio__ Node that will automatically connect to __pareto-anywhere__'s Socket.IO API running at [localhost:3001](http://localhost:3001), and will stream the __raddec__, __dynamb__ and __spatem__ JSON data to application logic in real-time.

### Eclipse Sparkplug

From the root folder of this repository, start Pareto Anywhere with the command:

    npm run sparkplug

If prompted, install [barnacles-sparkplug](https://github.com/reelyactive/barnacles-sparkplug/) with the command `npm install barnacles-sparkplug`.  __pareto-anywhere__ will attempt to connect to a MQTT broker running on localhost:1883 using the ClientId "ParetoAnywhereEdgeNode" and, if successful, will publish Sparkplug B messages.


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


![Pareto Anywhere logo](https://reelyactive.github.io/pareto-anywhere/images/pareto-anywhere-logo.png)


Pareto Anywhere variants
------------------------

[Pareto Anywhere for Azure](https://github.com/reelyactive/pareto-anywhere-azure) is adapted to run efficiently in the cloud as a stateless Azure Function.  Learn more [here](https://www.reelyactive.com/pareto/anywhere/integrations/azure/).

[Pareto Anywhere for the Web](https://github.com/reelyactive/pareto-anywhere/tree/gh-pages) is adapted to run in-browser, leveraging the _experimental_ Web Bluetooth Scanning feature, introduced to the Chrome browser in late 2019.  Try it [here](https://reelyactive.github.io/pareto-anywhere/).


Project History
---------------

In 2019, __Pareto Anywhere__ was created to supersede [hlc-server](https://github.com/reelyactive/hlc-server/), our open source _Hyperlocal Context Server_, which was itself created in 2014.

__pareto-anywhere__ v1.5.0 adopts [chickadee](https://github.com/reelyactive/chickadee) v1.4.0 which migrates to [ESMapDB](https://github.com/reelyactive/esmapdb) from [NeDB](https://github.com/louischatriot/nedb). If upgrading from a previous version, any stored associations will need to be recreated.

__pareto-anywhere__ v1.13.0 removes explicit database dependencies (i.e. Elasticsearch), instead allowing the database to be specified at runtime (ex: `npm run elasticsearch` or `npm run influxdb2`).

Learn more about the __Pareto by reelyActive__ collection at [www.reelyactive.com/pareto](https://www.reelyactive.com/pareto/)


Discussions
-----------

Browse to :speech_balloon:[/discussions](https://github.com/reelyactive/pareto-anywhere/discussions/) to: 
- __follow announcements__ about new versions, updates and tutorials
- __provide feedback__ to guide the continuous evolution of Pareto Anywhere
- __share clever ideas__ with the open source community about how you're using Pareto Anywhere


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2020-2025 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
