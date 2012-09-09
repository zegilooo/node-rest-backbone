node-rest-backbone
==================

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

* /client/css: Stylesheets
* /client/img: Images
* /client/js: Client-side javascript
* /client/lib: Client-side 3rd party modules

### Server running on Node.js and mongodb

* /server/lib: Custom libraries
* /server/models: Mongoose schema
* /server/routes: Routes to site pages and REST services
* /server/sockets: Sockets for publishing updates
* /server/vendor: Server-side 3rd party modules
* /server/views: Site page templates

### Unit tests

* /spec: Functional tests
* /test: Unit tests

How it Works
------------

Node runs app.js, which sets up the server with models, routes, sockets, and views. In addition to serving simple page templates and the single-page Backbone.js client, the server implements RESTful Web services and a listens for WebSocket connections from clients.

Configuration
-------------

Environment specific configuration parameters are stored in config.js

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
