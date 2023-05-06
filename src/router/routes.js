const routes = [
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RadioPage.vue') },
      /* {
        path: '/:countryCode/:place/:radio',
        component: () => import('src/pages/RadioPage.vue'),
      }, */
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  /* {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }, */
]

export default routes
