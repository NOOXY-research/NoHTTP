// NoHTTP.js
// Description:
// "NoHTTP.js" is a extension module for NoHTTP.
// Copyright 2018 NOOXY. All Rights Reserved.

let Library;
let Model;
let Settings;
let FilesPath;
let Authe;
let Utils;

const Express = require('express');
// oauth here is authorization provider!
const OauthServer = require('oauth2-server');
const Request = OauthServer.Request;
const Response = OauthServer.Response;
const Multer = require('multer');
const fs = require('fs');

let http = Express();

'use strict';

function NoHTTP() {
  let _on_handler = {};
  let _oauth;
  let _http_server;
  let _queue_file_upload_request = {};
  let _file_model;
  let _upload_tokens = ['test'];

  // import model from API in entry.js
  this.importModel = (model)=> {
    Model = model;
  };

  // import library from API in entry.js
  this.importLibrary = (library)=> {
    Library = library;
    Utils = library.Utilities;
  };

  // import settings from API in entry.js
  this.importSettings = (settings)=> {
    Settings = settings;
  };

  // import FilesPath from API in entry.js
  this.importFilesPath = (path)=> {
    FilesPath = path;
  };

  // import utils
  this.importUtils = (utils)=> {
    Utils = utils;
  };

  // import database from specified path
  this.importModel = (model, callback)=> {
    Model = model;
    Model.exist(Settings.file_modelname, (err, has_model)=> {
      if(err) {
        callback(err);
      }
      else if(!has_model) {
        Model.define(Settings.file_modelname, {
          model_type: "Object",
          do_timestamp: true,
          model_key: "fileid",
          structure: {
            fileid: "VARCHAR(255)",
            originalname: "VARCHAR(255)",
            mimetype: "VARCHAR(255)",
            destination: "VARCHAR(255)",
            path: "VARCHAR(255)",
            size: "INTEGER"
          }
        }, (err, model)=> {
          _file_model = model;
          callback(err);
        });
      }
      else {
        Model.get(Settings.file_modelname, (err, model)=> {
          _file_model = model;
          callback(false);
        });
      }
    });
  };

  // register Oauth Client
  this.registerOauth2Client = ()=> {

  };

  // request file upload and return fileId
  // urltype:
  // dynamic, static
  // filetype:
  // file, streaming file
  // uploadToken
  this.requestFileUploadURL = (urltype, filetype, callback)=> {

  };

  // get file url by fileId accessToken
  this.getFileURL = (fileId, callback)=> {

  }

  // get file url by fileId accessToken
  this.getFilePath = (fileId, callback)=> {

  }

  // remove file url by fileId, callback file ip
  this.removeFile = (fileId, callback)=> {

  };


  this.importFile = (filepath, callback)=> {

  };


  this.registerURL = (html_filepath, callback)=> {

  };

  this.registerAPI = ()=> {

  };

  // define you own funciton to be called in entry.js
  this.launch = ()=> {
    try {
      fs.mkdirSync(FilesPath+'/files/');
    }
    catch (err) {
    } // Skip
    let oauth_model = new (require('./oauth2_model.js'));
    upload = Multer({storage: Multer.diskStorage({
      destination: FilesPath+'/files', // this saves your file into a directory called "uploads"
      filename: (req, file, cb) =>{
        let fileid = Utils.generateGUID();
        _file_model.create({
          fileid: fileid,
          originalname: file.originalname,
          mimetype: file.mimetype,
          destination: FilesPath+'/files/',
          path: FilesPath+'/files/'+fileid,
          size: file.size
        }, ()=> {
          cb(null, fileid);
        });
      }
    })}).single('file');

    oauth_model.importModel(Model);
    oauth_model.importAuthe();
    _oauth = new OauthServer({
      model: oauth_model
    });

    http.all(Settings.upload_path+'/:uploadToken', (req, res, next)=> {
      console.log(req.params.uploadToken);
      let index = _upload_tokens.indexOf(req.params.uploadToken);
      if (index > -1) {
        _upload_tokens.splice(index, 1);
        next();
      }
      else {
        res.sendStatus(404);
      }
    });

    http.all(Settings.upload_path+'/:uploadToken', upload, (req, res)=> {
      console.log('uploaded');
      res.sendStatus(200);
    });

    http.all(Settings.oauth_path+Settings.oauth_route.AccessToken, ()=> {

    });

    http.all(Settings.oauth_path+Settings.oauth_route.UserProfile, ()=> {

    });

    _http_server = http.listen(Settings.port, (err)=> {
      console.log('NoHTTP listening on port ' + Settings.port + '!');
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
