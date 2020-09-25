/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

 /**
  * dependencies
  */

 import {precacheAndRoute} from 'workbox-precaching'
 import {registerRoute} from 'workbox-routing'
 import {StaleWhileRevalidate} from 'workbox-strategies'
 import {CacheFirst} from 'workbox-strategies'
 import {ExpirationPlugin} from 'workbox-expiration'
 import {CacheableResponsePlugin} from 'workbox-cacheable-response'
 import {NetworkFirst} from 'workbox-strategies';
 import {Queue} from 'workbox-background-sync';





 /**
  * config
  */
 precacheAndRoute(self.__WB_MANIFEST);

  let backgroundSyncSupported = 'sync' in self.registration;


  /**
   * qeue-create post
   */

   let createPostQueue = null;

  if (backgroundSyncSupported) {
    createPostQueue = new Queue('createPostQueue');
  }

console.log('BG MSG:', backgroundSyncSupported )
 /**
  * caching strategies
  */


 registerRoute(
  ({url}) => url.host.startsWith('fonts.g'),
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
    ],
  })
);

registerRoute(
  ({url}) => url.pathname.startsWith('/posts'),
  new NetworkFirst()
);

registerRoute(
  ({url}) => url.href.startsWith('http'),
  new StaleWhileRevalidate()
);



/**
 * events fetch
 */

if (backgroundSyncSupported) {
  self.addEventListener('fetch', (event) => {

   // console.log(event)
    if (event.request.url.endsWith('/createPost') ) {
      // Clone the request to ensure it's safe to read when
      // adding to the Queue.

      const promiseChain = fetch(event.request.clone()).catch((err) => {
        return createPostQueue.pushRequest({request: event.request});
      });

       console.log('EVENT DATA:', event.request)
      event.waitUntil(promiseChain);

    }
      return  createPostQueue.replayRequests({request: event.request});

});

}


