<template>
    <v-row justify="center">
        <v-card class="bg-white" width="700">
            <v-card-title>Destination Information</v-card-title>
            <v-form class="pa-5">
                <v-select v-model="country" :items="countries" label="Select Country" persistent-hint
                    single-line></v-select>

                <v-text-field v-model="description" label="Enter description for country"></v-text-field>
                <v-textarea v-model="body" label="Enter destination content body"></v-textarea>
                <div class="d-flex mb-2">
                    <div>Existing Image</div>
                    <v-img :src="old_image" max-height="200px"></v-img>
                </div>

                <v-file-input v-model="country_image" variant="outlined" label="Choose country image"></v-file-input>
                <div class="d-flex justify-end">
                    <v-btn class="ma-3 bg-grey" @click="$emit('close-form')">Close</v-btn>
                    <v-btn class="ma-3 bg-blue" @click="submitForm">Save</v-btn>
                </div>
            </v-form>

        </v-card>

    </v-row>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
export default {
    emits: ['close-form'],
    props: ['editId'],
    setup(props, { emit }) {
        const countries = ref([
            'Thailand', 'Laos', 'Vietnam', 'Singapore', 'Myanmar', 'Phillipines'
        ]);
        const country = ref('');
        const description = ref('');
        const body = ref('');
        const country_image = ref('');
        const old_image = ref('')

        const closeModal = () => {
            emit('close-form');
        }
        const getDestination = (id) => {
            axios.get(`http://tourism-app-backend.test/api/destination/${id}`)
                .then(response => {
                    country.value = response.data.country;
                    description.value = response.data.description;
                    body.value = response.data.body;
                    old_image.value = `http://tourism-app-backend.test/api/destinations/image/${response.data.country_image}`;
                })
                .catch(error => console.log(error))
        }

        const submitForm = () => {
            if (props.editId) {
                axios.post('http://tourism-app-backend.test/api/destination/update', {
                    'id' : props.editId,
                    'country': country.value,
                    'description': description.value,
                    'body': body.value,
                    'country_image': old_image.value ? old_image.value[0] : country_image,///to get image from frontend
                },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        console.log(response);
                        closeModal();
                    })
            }
            else {
                axios.post('http://tourism-app-backend.test/api/destinations/create', {
                    'country': country.value,
                    'description': description.value,
                    'body': body.value,
                    'country_image': country_image.value ? country_image.value[0] : null,///to get image from frontend

                },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {
                        console.log(response)
                        closeModal();
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }



        }

        onMounted(() => {
            getDestination(props.editId);
        })

        return { countries, country, description, body, country_image, submitForm, closeModal, getDestination, old_image }
    },


}
</script>

<style></style>