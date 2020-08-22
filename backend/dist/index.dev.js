"use strict";

/*
dependecies
*/
var express = require('express');

var admin = require('firebase-admin');

var inspect = require('util').inspect;

var Busboy = require('busboy');

var path = require('path');

var os = require('os');

var fs = require('fs');

var UUID = require('uuid-v4');
/*
config-express
*/


var app = express(); // const port = 6000

/**
 * Cofig Firebase
 */

var serviceAccount = require('./serviceAccountKey.json');

var _require = require('firebase-admin'),
    firestore = _require.firestore;

var _require2 = require('path'),
    parse = _require2.parse;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "deja-vue-e67a1.appspot.com"
});
var db = admin.firestore();
var bucket = admin.storage().bucket();
/*
endpoints - posts
*/

app.get('/posts', function (request, response) {
  response.set('Access-Control-Allow-Origin', '*');
  var posts = [];
  db.collection('posts').orderBy('date', 'desc').get().then(function (snapshot) {
    snapshot.forEach(function (doc) {
      posts.push(doc.data());
    });
    response.send(posts);
  });
});
/* *
 * endpoint createPost
 */

app.post('/createPost', function (request, response) {
  response.set('Access-Control-Allow-Origin', '*'); // response.send('Creating a post')

  var busboy = new Busboy({
    headers: request.headers
  });
  var fields = {};
  fileData = {};
  var uuid = UUID();
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename);
    var filePath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filePath));
    fileData = {
      filePath: filePath,
      mimetype: mimetype
    };
    /*      file.on('data', function(data) {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
          });
          file.on('end', function() {
            console.log('File [' + fieldname + '] Finished');
          });*/
  });
  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
    //  console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    fields[fieldname] = val;
  });
  busboy.on('finish', function () {
    bucket.upload(fileData.filePath, {
      uploadTypes: 'media',
      metadata: {
        metadata: {
          contentType: fileData.mimetype,
          firebaseStorageDownloadTokens: uuid
        }
      }
    }, function (err, uploadedFile) {
      if (!err) {
        createDocument(uploadedFile);
      }
    });

    function createDocument(uploadedFile) {
      db.collection('posts').doc(fields.id).set({
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/".concat(bucket.name, "/o/").concat(uploadedFile.name, "?alt=media&token=").concat(uuid)
      }).then(function () {
        response.send('post added:' + fields.id);
      });
    }
  });
  request.pipe(busboy);
});
/*
listen to port
*/

app.listen(process.env.PORT || 3000);