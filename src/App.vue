<template>
  <v-app>
    <v-main>
      <v-row>
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
export default {
  name: 'App',
  components:{
    SideNavigation
  },
  data: () => ({
    //
  }),
}
</script>
