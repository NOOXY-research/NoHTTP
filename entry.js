// NoService/services/NoHTTP/entry.js
// Description:
// "NoHTTP/entry.js" description.
// Copyright 2018-2019 NOOXY. All Rights Reserved.
'use strict';



function Service(Me, NoService) {
  // Initialize your service here synchronous. Do not use async here!
  let NoHTTP = new (require('./NoHTTP'))(Me, NoService)
  // Get the service socket of your service
  let ss = NoService.Service.ServiceSocket;
  // BEWARE! To prevent callback error crash the system.
  // If you call an callback function which is not NoService provided. Such as setTimeout(callback, timeout).
  // You need to wrap the callback funciton by NoService.SafeCallback.
  // E.g. setTimeout(NoService.SafeCallback(callback), timeout)
  let safec = NoService.SafeCallback;
  // Please save and manipulate your files in this directory
  let files_path = Me.FilesPath;
  // Your settings in manifest file.
  let settings = Me.Settings;
  // import NoService to NoHTTP module


  NoHTTP.on('fileuploaded', (err, uploadToken, fileid)=> {
    ss.emitToGroups([uploadToken], 'fileuploaded', {err: err, fileid: fileid});
  });

  ss.sdef('requestFileUpload', (json, entityID, returnJSON)=> {
    NoHTTP.requestFileUpload(json, (err, uploadToken, uploadURL, uploadFormKey)=> {
      NoService.Service.Entity.addEntityToGroups(entityID, [uploadToken], ()=> {
        console.log({uploadurl: uploadURL});
        returnJSON(false, {uploadurl: uploadURL, formkey: uploadFormKey});
      });
    });
  });

  // Here is where your service start
  this.start = ()=> {
    NoHTTP.launch(()=> {
      NoService.Service.ActivitySocket.createDefaultAdminDeamonSocket('NoHTTP', (err, activitysocket)=> {
        activitysocket.onEvent('fileuploaded', (err, json)=> {
          console.log(json);
        });
        activitysocket.call('requestFileUpload', {}, (err, json)=> {
            console.log('request', json);
        });
      });

    });
  }

  // If the daemon stop, your service recieve close signal here.
  this.close = ()=> {
    // Close your service here synchronous. Do not use async here!
    // Saving state of you service.
    // Please save and manipulate your files in this directory
  }
}

// Export your work for system here.
module.exports = Service;
