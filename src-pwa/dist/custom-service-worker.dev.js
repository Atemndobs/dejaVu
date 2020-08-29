"use strict";

var _workboxPrecaching = require("workbox-precaching");

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/**
 * dependencies
 */

/**
 * config
 */
(0, _workboxPrecaching.precacheAndRoute)(self.__WB_MANIFEST);