import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import CampingSpotDetails from "@/pages/CampingSpotDetails.vue";
import BookingPage from '@/pages/BookingPage.vue';
import CampingListPage from '@/pages/CampingListPage.vue';
import NewCampingSpotPage from '@/pages/NewCampingspotPage.vue';



Vue.use(VueRouter);

const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
    },
    {
      path: "/spot/:id",
      name: "CampingSpotDetails",
      component: CampingSpotDetails
    },
    {
      path: "/book/:id",
      name: "BookingPage",
      component: BookingPage
    },
    {
      path: '/campings', 
      name: 'CampingListPage',
      component: CampingListPage // The component to load for this route
    },
    {
      path: '/campings/new',
      name: 'NewCampingSpot',
      component: NewCampingSpotPage
    }
    
]

const router = new VueRouter ({
    mode: 'history',
    routes
});

export default router