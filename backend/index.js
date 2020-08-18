/*
dependecies
*/
const express = require('express')

/*
config-express
*/
const app = express()
const port = 5000

/*
endpoing - posts
*/
app.get('/posts', (request, response) => {
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
  response.send(posts)
})


/*
listen to port
*/
app.listen(process.env.PORT || 5000)
