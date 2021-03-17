Pareto Anywhere
===============

[Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) is the collection of various open source software modules by [reelyActive](https://www.reelyactive.com) which are hosted in their own individual repositories ([learn more](https://reelyactive.github.io/diy/oss-packages/)).  The _experimental_ web app version of Pareto Anywhere is maintained in the gh-pages branch of this repository.

Note that Pareto Anywhere is in active development, evolving the [hlc-server](https://github.com/reelyactive/hlc-server/) code base which it is intended to supersede.  It is therefore normal for documentation to refer to hlc-server as a pseudonym of Pareto Anywhere.


Quick start
-----------

Install Pareto Anywhere globally as follows:

    npm install -g pareto-anywhere

Then run from the command line as follows:

    pareto-anywhere

Browse to [localhost:3001](http://localhost:3001) to see Pareto Anywhere running.


Learn more
----------

Visit [reelyactive.com/pareto/anywhere](https://www.reelyactive.com/pareto/anywhere/) for an introduction and [Hello Pareto Anywhere!](https://reelyactive.github.io/diy/hello-pareto-anywhere/) to get started.


Developer Notes
---------------

Pareto Anywhere includes [Pareto Apps](https://github.com/reelyactive/pareto-anywhere-apps) as a git submodule (in the web/apps folder).  To update to the latest Pareto Apps run:

    git submodule update --remote

If developing Pareto Apps from within this repository, changes can be pushed to the Pareto Apps origin by the usual means, from the web/apps folder:

    cd web/apps
    git add [...]
    git commit -m "Description of update"
    git push origin master


Pareto Anywhere Web App
-----------------------

The _experimental_ Web Bluetooth Scanning feature, introduced to the Chrome browser in late 2019, enables an _experimental_ web app version of Pareto Anywhere hosted [here](https://reelyactive.github.io/pareto-anywhere/), with code in the [gh-pages branch](https://github.com/reelyactive/pareto-anywhere/tree/gh-pages).


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
