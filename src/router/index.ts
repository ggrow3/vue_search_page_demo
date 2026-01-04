import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProjectSearch from '@/pages/ProjectSearch.vue'
import ProjectProfile from '@/pages/ProjectProfile.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'search',
    component: ProjectSearch
  },
  {
    path: '/project/:id',
    name: 'project-profile',
    component: ProjectProfile,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
