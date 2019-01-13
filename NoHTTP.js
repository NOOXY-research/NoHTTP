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
let NoServiceAPI;

const HTTP = require('http');
const Express = require('express');
// oauth here is authorization provider!
const OauthServer = require('oauth2-server');
const Request = OauthServer.Request;
const Response = OauthServer.Response;
const Multer = require('multer');
const fs = require('fs');

let app = Express();

'use strict';

function NoHTTP(Me, NoService) {
  Library = NoService.Library;
  Utils = NoService.Library.Utilities;
  Model = NoService.Database.Model;
  Settings = Me.Settings;
  FilesPath = Me.FilesPath;

  let _on_handler = {
    "fileuploaded": null
  };
  let _oauth;
  let _http_server;
  let _queue_file_upload_request = {};
  let _file_model;
  let _upload_tokens = {
    "test": {
      onUploaded: null,
      fileId: null
    }
  };

  // import database from specified path
  let _loadModel = (callback)=> {
    Model.exist(Settings.file_modelname, (err, has_model)=> {
      if(err) {
        callback(err);
      }
      else if(!has_model) {
        Model.define(Settings.file_modelname, {
          model_type: "Pair",
          do_timestamp: true,
          model_key: ["fileid", "urlpath"],
          structure: {
            fileid: "VARCHAR(255)",
            urlpath: "TEXT",
            originalname: "VARCHAR(255)",
            mimetype: "VARCHAR(255)",
            destination: "VARCHAR(255)",
            filepath: "VARCHAR(255)",
            size: "INTEGER",
            urls: "TEXT"
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

  // upload base url will be like www.baseurl.com/upload/
  // upload url will be like www.baseurl.com/upload/token
  this.getUploadURLPrefix = ()=> {

  };

  this.getBaseURL = ()=> {

  };

  // request file upload and return fileId
  this.requestFileUpload = (meta, callback)=> {
    let uploadtoken = Utils.generateGUID();
    _upload_tokens[uploadtoken]= {mimetypes:meta.mimetypes, onetimeurl:meta.onetimeurl};
    callback(false, uploadtoken, Settings.domaian_name+':'+Settings.listen+Settings.upload_path+'/'+uploadtoken, Settings.upload_form_key);
  };

  // get file url by fileId accessToken
  // urltype:
  // dynamic, static, streaming
  this.createFileURL = (fileId, urltype, callback)=> {

  };

  this.removeAllFileURLs = (fileId, callback)=> {

  };

  this.getFileURLsbyFileId = (fileId, callback)=> {

  };

  // get file url by fileId accessToken
  this.getFilePathbyFileId = (fileId, callback)=> {

  };

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
  this.launch = (callback)=> {
    _loadModel(()=> {
      try {
        fs.mkdirSync('files/');
      }
      catch (err) {
      } // Skip
      let oauth_model = new (require('./oauth2_model.js'));
      upload = Multer({
      fileFilter:(req, file, cb) => {
        if(_upload_tokens[req.params.uploadToken]) {
          delete _upload_tokens[req.params.uploadToken];
          return cb(null, true);
        }
        else {
          req.ValidationError = true;
          return cb(null, false);
        }
      },
      storage: Multer.diskStorage({
        destination: FilesPath+'/files', // this saves your file into a directory called "uploads"
        filename: (req, file, cb) =>{
          console.log(req.params.uploadToken);
          let fileid = Utils.generateGUID();
          _file_model.create({
            fileid: fileid,
            originalname: file.originalname,
            mimetype: file.mimetype,
            destination: FilesPath+'/files/',
            filepath: FilesPath+'/files/'+fileid,
            size: file.size
          }, ()=> {
            _on_handler['fileuploaded'](false, req.params.uploadToken, fileid);
            cb(null, fileid);
          });
        }
      })}).single(Settings.upload_form_key);

      oauth_model.importModel(Model);
      oauth_model.importAuthe();
      _oauth = new OauthServer({
        model: oauth_model
      });

      app.all(Settings.upload_path+'/:uploadToken', upload, (req, res)=> {
          if(req.ValidationError) {
            res.sendStatus(404);
          }
          else {
            console.log(req.params.uploadToken);
            console.log('uploaded');
            res.sendStatus(200);
          }
      });

      app.get(Settings.content_path+'/:accessToken', (req, res)=> {

      });

      app.all(Settings.oauth_path+Settings.oauth_route.AccessToken, ()=> {

      });

      app.all(Settings.oauth_path+Settings.oauth_route.UserProfile, ()=> {

      });

      _http_server = HTTP.createServer(app);
      _http_server.listen(Settings.listen, (err)=> {
        console.log('NoHTTP listening on port ' + Settings.listen + '!');
        if(err) {
          console.log('NoHTTP occured error during launching.');
          console.log(err);
        }
        callback(err);
      });

      _http_server.on('err', console.log);

    });
  };

  // on event register
  this.on = (event, callback)=> {
    _on_handler[event] = callback;
  };

  this.close = ()=> {
    _http_server.close();
  };
}

module.exports = NoHTTP;
