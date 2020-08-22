/*
dependecies
*/
const express = require('express')
const admin = require('firebase-admin');
let inspect = require('util').inspect;
let Busboy = require('busboy');
let path = require('path');
let os = require('os');
let fs = require('fs');
let UUID = require('uuid-v4')

/*
config-express
*/
const app = express()
// const port = 6000

/**
 * Cofig Firebase
 */
  const serviceAccount = require('./serviceAccountKey.json');
  const { firestore } = require('firebase-admin');
const { parse } = require('path');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "deja-vue-e67a1.appspot.com"
  });

  const db = admin.firestore();
  let bucket = admin.storage().bucket();

/*
endpoints - posts
*/
 app.get('/posts', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  let posts = []

      db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
        snapshot.forEach((doc) => {
          posts.push(doc.data())
        });
      response.send(posts)
      })
})

/* *
 * endpoint createPost
 */
app.post('/createPost', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
   // response.send('Creating a post')

    let busboy = new Busboy({ headers: request.headers });

    let fields = {};
    fileData =  {};
    let uuid = UUID();


    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename);

      let filePath = path.join(os.tmpdir(), filename);
      file.pipe(fs.createWriteStream(filePath ))
      fileData = {filePath, mimetype}
/*      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });*/

    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    //  console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    fields[fieldname] = val
    });

    busboy.on('finish', function() {
      bucket.upload(
        fileData.filePath, {
          uploadTypes: 'media',
          metadata: {
            metadata: {
              contentType: fileData.mimetype,
              firebaseStorageDownloadTokens: uuid
            }
          }

        },

        (err, uploadedFile) => {
          if (!err) {
            createDocument(uploadedFile);
          }
        }
      )

      function createDocument(uploadedFile) {
        db.collection('posts').doc(fields.id).set({
          id: fields.id,
          caption: fields.caption,
          location: fields.location,
          date: parseInt(fields.date),
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
        }).then(() => {
          response.send('post added:' + fields.id)
        })
      }
    });
    request.pipe(busboy);
  })


/*
listen to port
*/
app.listen(process.env.PORT || 3000)
