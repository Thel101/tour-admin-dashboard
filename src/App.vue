<template>
  <v-app>
    <v-main>
      <v-row v-if="!(authStore.user)">
        <Login></Login>
      </v-row>
      <v-row v-else>
        <v-col cols="3" style="max-width :20%">
          <SideNavigation></SideNavigation>
        </v-col>
        <v-col cols="9">
          <router-view/>
        </v-col>
      </v-row>
     
    </v-main>
  </v-app>
</template>

<script>
import SideNavigation from './components/SideNavigation.vue';
import Login from '../src/views/Login.vue';
import { useAuthStore } from './stores/auth';
import LoginVue from './views/Login.vue';
export default {
  name: 'App',
  components:{
    SideNavigation,
    Login
  },
  setup(){
    const authStore = useAuthStore();
    return { authStore }
  }
}
</script>
