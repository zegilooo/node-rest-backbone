node-rest-backbone
==================

Starter template for Node.js app, using Backbone.js and Bootstrap on the client, local and 3d party OAUTH authentication, RESTful services for integration with the Backbone.js client, and Socket.io for pushing updates to the client.

TODO:
-----

Basic signup/login with a local account and/or a variety of OAUTH providers works. Still much to do including:

* remember me
* profile view/edit
* show/hide alerts
* graphics for provider login/signup buttons (Github, Google, etc.)
* error handling
* test cases
* sample REST client
* sample Socket.io connection
* cleanup this README :-)

Deploying
---------

Get the code:

    $ git clone

Update the modules:

    $ npm install

Run the app:

    $ node app

Open in a browser:

    $ http://localhost:3000

Directory Structure
-------------------

### Client based on Backbone.js and Bootstrap

* /public/css: Stylesheets
* /public/img: Images
* /public/js: Client-side javascript
* /public/lib: Client-side 3rd party modules

### Server running on Node.js and mongodb

* /lib: Custom libraries
* /models: Mongoose schema
* /routes: Routes to site pages and REST services
* /vendor: Server-side 3rd party modules
* /views: Site page templates

### Unit tests

* /spec: Functional tests
* /test: Unit tests

How it Works
------------

Node runs app.js, which sets up the server with models, routes, sockets, and views. In addition to serving simple page templates and the single-page Backbone.js client, the server implements RESTful Web services and a listens for WebSocket connections from clients.

Configuration
-------------

Environment specific configuration parameters are stored in JSON files located in the config directory. Look at config/default.json.example.

Security
--------

The Backbone.js client will authenticate a user's credentials with the server and establish a session key to authorize subsequent REST requests and WebSocket connections.

OAuth2 (2-legged) for REST services.

Error Handling
--------------

A) detect errors by receiving them as parameters to your callback functions. For example:

doSomethingAndRunCallback(function(err) { 
 if(err) { … }
});

B) report errors in MIDDLEWARE by calling next(err). Example:

handleRequest(req, res, next) {
  // an error occurs…
  next(err);
}

C) report errors in ROUTES by calling next(err). Example:

app.get('/home', function(req, res, next){
    // an error occurs
    next(err);
});

D) Any middleware that has a length of 4 (4 arguments) is considered error middleware. When one calls next(err) connect goes and calls error based middleware.

app.use(function(err, req, res, next) {
  // only handle `next(err)` calls
});

License
-------
(The MIT License)

Copyright (c) 2012, The Hackerati, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.