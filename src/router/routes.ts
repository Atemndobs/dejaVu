import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageHome.vue') },
      { path: '/camera', component: () => import('pages/PageCamera.vue') },
      { path: '/location', component: () => import('pages/PageLocation.vue') },
      { path: '/battery', component: () => import('pages/PageBattery.vue') },
      { path: '/settings', component: () => import('pages/PageSettings.vue') },
      { path: '/privacy', component: () => import('pages/Privacy.vue') },

      { path: '/audio', component: () => import('pages/PageAudio.vue') },
      { path: '/price', component: () => import('pages/PageTracker.vue') },
      { path: '/video', component: () => import('pages/PageVideo.vue') },
      { path: '/weather/forecast', component: () => import('pages/Weather/PageForecast.vue') },
      { path: '/stream', component: () => import('pages/PageStream.vue') },
      { path: '/login', component: () => import('pages/auth/login.vue') },
      { path: '/logout', component: () => import('pages/auth/Logout.vue') },
      { path: '/register', component: () => import('pages/auth/register.vue') },
      { path: '/account/home', component: () => import('pages/auth/account/Home.vue') },
      { path: '/admin/home', component: () => import('pages/auth/admin/Home.vue') },
      { path: '/password/forgot', component: () => import('pages/auth/password/Forgot.vue') },
      { path: '/password/reset', component: () => import('pages/auth/password/Reset.vue') },
      {path: '/verification/verify/:id', component: () => import('pages/auth/verification/Verify.vue') },
      {path: '/verification/resend', component: () => import('pages/auth/verification/Resend.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
