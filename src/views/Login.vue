<template>
    <v-container fluid>
        <div class="text-center my-5">
            <h4 class="text-red">{{ message }}</h4>
        </div>
        <v-row justify="center">
            <v-col cols="12" md="6" sm="9">
                <v-card elevation="12" class="px-3">

                    <h2 class="text-center my-3 text-blue-accent-2">Login Your Account</h2>
                    <v-form class="py-5">

                        <v-text-field v-model="form.email" label="Email"></v-text-field>
                        <span class="text-red" v-if="this.authStore.errors.email">{{ this.authStore.errors.email[0]
                            }}</span>

                        <v-text-field v-model="form.password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'" label="Password"
                            @click:append="show1 = !show1"></v-text-field>
                        <span class="text-red" v-if="this.authStore.errors.password">{{
                this.authStore.errors.password[0]
            }}</span>
                        <v-btn block color="blue-accent-2" @click="authStore.logIn(form)">Login</v-btn>
                    </v-form>
                </v-card>
            </v-col>

        </v-row>


    </v-container>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRoute } from 'vue-router';
export default {
    setup() {
        const form = ref({
            email: "",
            password: "",
        })
        const authStore = useAuthStore();
        const show1 = ref(false);
        const alertColor = ref('');

        const router = useRoute();
        const message = router.query.redirectMessage;

        return { form, authStore, show1, alertColor, router, message }
    }
}
</script>

<style></style>