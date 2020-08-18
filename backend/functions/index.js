const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.posts = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});

   let posts = [
    {
      caption: 'Amercan boy',
      location: 'Lagos'
    },
    {
      caption: 'Capacitor',
      location: 'Dusseldorf'
    },
  ]

   response.send(posts);
 });

