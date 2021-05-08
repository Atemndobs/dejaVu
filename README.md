## About Deja-Vu

Deja-Vu is the frontend build in vue.js
Pixelate is the back-end build on Laravel


This is my attempt to build a microservice  application based on laravel and vue js.
To try out this application, check the link below.
- [Pixelate backend api](https://atemkeng.com/).
- [Pixelate frontend app: Deja-Vu](https://dejavu.atmkng.de/#/).
- [Pixelate github repo](https://github.com/Atemndobs/pixelate).

To install, clone this repository, cd into it and from root folder, run the following commands

### Edit Pusher Configurations for real time events (likes, follows, comments and reactions) :
    - edit the following in quasar.conf.js
     PUSHER_KEY = 'YOUR_PUSHER_KEY'

##### For using google maps, you need you google api_key. add this in quasar.conf.js
    - edit the following in quasar.conf.js
     GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'

### Installation Locally (When using Pusher for  websocket):
     $ make install-pusher

### Installation Locally (When using Laravel Echo for  websocket):
     $ make install-echo
     $ quasar dev

### Build:
    $ make build

