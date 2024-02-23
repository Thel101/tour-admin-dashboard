import { createRouter, createWebHistory } from 'vue-router'
import Pages from '../views/Pages.vue'
import Destinations from '../views/Destinations.vue'
import Requests from '../views/Requests.vue'
import Plans from '../views/Plans.vue'
import PlanDetail from '../views/PlanDetail.vue'
const routes = [
  {
    path: '/pages',
    name: 'pages',
    component: Pages
  },
  {
    path: '/destinations',
    name: 'destinations',
    component: Destinations
  },
  {
    path: '/requests',
    name: 'requests',
    component: Requests
  },
  {
    path: '/plans',
    name: 'plans',
    component: Plans
  },
  {
    path: '/plan/:id',
    name : 'detailPlan',
    component : PlanDetail,
    props : true
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
