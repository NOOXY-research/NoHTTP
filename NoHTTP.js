// NoHTTP.js
// Description:
// "NoHTTP.js" is a extension module for NoHTTP.
// Copyright 2018 NOOXY. All Rights Reserved.

let Library;
let Model;
let Settings;
let FilesPath;
let Authe;

let Express = require('express');
let OauthServer = require('oauth2-server');
let Request = OauthServer.Request;
let Response = OauthServer.Response;

let http = Express();

'use strict';

function NoHTTP() {
  let _on_handler = {};
  let _oauth;
  let _http_server;

  // import model from API in entry.js
  this.importModel = (model)=> {
    Model = model;
  };

  // import library from API in entry.js
  this.importLibrary = (library)=> {
    Library = library;
  };

  // import settings from API in entry.js
  this.importSettings = (settings)=> {
    Settings = settings;
  };

  // import FilesPath from API in entry.js
  this.importFilesPath = (path)=> {
    FilesPath = path;
  };

  // define you own funciton to be called in entry.js
  this.launch = ()=> {
    let oauth_model = new (require('./oauth_model.js'))();
    oauth_model.importModel(Model);
    oauth_model.importAuthe();
    _oauth = new OauthServer({
      model: oauth_model
    });

    http.all(Settings.oauth_path+'/access_token', ()=> {
      
    });

    http.all(Settings.oauth_path+'/user_profile', ()=> {

    });

    _http_server = http.listen(Settings.port, ()=> {
      console.log('Example app listening on port ' + Settings.port + '!');
    });
  };

  // on event register
  this.on = (event, callback)=> {
    _on_handler[event] = callback;
  }

  this.close = ()=> {
    _http_server.close();
  };
}

module.exports = NoHTTP;
