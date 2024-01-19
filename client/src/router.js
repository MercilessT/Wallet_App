import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import SignupPage from './pages/SignupPage.vue'
import PersonalPage from './pages/PersonalPage.vue'
import { authMiddleware } from './middlewares/authMiddleware.js'


export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: HomePage,
    },
    {
      name: 'Login',
      path: '/login',
      component: LoginPage,
    },
    {
      name: 'Signup',
      path: '/signup',
      component: SignupPage,
    },
    {
      name: 'Personal',
      path: '/my',
      component: PersonalPage,
      beforeEnter: authMiddleware,
    },
  ],
})