<template>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="name" label="First name" required></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="selectedItems" :items="items" chips label="Chips" multiple></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="selectedActivities" :items="activities" chips label="Chips" multiple></v-select>
                </v-col>
            </v-row>
            <v-btn @click="submitForm">Submit Form</v-btn>
        </v-container>
    </v-form>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
export default {
    setup() {
        const name = ref('');
        const selectedItems = ref([]);
        const items = ref(['reading', 'playing', 'jogging'])
        const selectedActivities = ref([]);
        const activities = ref(['billiard', 'reading', 'dancing'])
        const submitForm = () => {
            axios.post('http://tourism-app-backend.test/api/forms/create', {
                "name": name.value,
                "interests": selectedItems.value,
                "activities": selectedActivities.value
            })
            .then(response=>console.log(response))
            .catch(error=>console.log(error));
        }
        return { name, items, selectedItems, activities, selectedActivities, submitForm }
    }
}
</script>

<style></style>