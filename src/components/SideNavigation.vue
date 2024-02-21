<template>
    <v-navigation-drawer class="bg-blue h-screen" width="400px">
        <v-list>
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Sandra Adams"
                subtitle="sandra_a88@gmailcom"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-folder"><router-link class="custom-link"
                    to="/pages">Pages</router-link></v-list-item>
            <v-list-item prepend-icon="mdi-account-multiple"><router-link class="custom-link"
                    to="/destinations">Desinations</router-link></v-list-item>
            <v-list-item prepend-icon="mdi-star"><router-link class="custom-link"
                    to="/requests">Requests</router-link></v-list-item>
            <v-list-item prepend-icon="mdi-star"><router-link class="custom-link"
                    to="/plans">Plans</router-link></v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-main style="height: 250px"></v-main>
</template>
<script>
export default {
    name: 'SideNavigation'
}
</script>
<style scoped>
.custom-nav {
    height: 100vh;
}

.custom-link {
    text-decoration: none;
    color: black
}
</style>