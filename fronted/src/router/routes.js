const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue') // Ruta directa para probar el login sin layouts
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
      { path: 'perfil', component: () => import('pages/PerfilPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes