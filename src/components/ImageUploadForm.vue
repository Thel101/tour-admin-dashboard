<template>
    <v-row justify="center">
        <v-card class="bg-white" width="700">
            <v-card-title>Destination Images</v-card-title>
            <v-form class="pa-5">

                <v-text-field v-model="this.country" readonly></v-text-field>


                <v-file-input multiple variant="outlined" label="Choose country image"
                    @change="handleFileChange"></v-file-input>
                <div class="d-flex justify-end">
                    <v-btn class="ma-3 bg-grey" @click="$emit('close-form')">Close</v-btn>
                    <v-btn class="ma-3 bg-blue" @click="uploadImage">Save</v-btn>
                </div>
            </v-form>

        </v-card>

    </v-row>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
export default {
    props: ['destination_id'],
    data() {
        return {
            country: '',
            country_images: [],
            form : new FormData
        }
    },
    methods: {
        getDestination (id) {
            axios.get(`http://tourism-app-backend.test/api/destination/${id}`)
                .then(response => {
                    this.country = response.data.country;

                })
                .catch(error => console.log(error))
        },
        handleFileChange (e)  {
            let files = e.target.files;
            if(!files.length){
                return false
            }
            for (let i=0; i<files.length; i++){
                this.country_images.push(files[i]);
            }

        }, 
        uploadImage() {

            const config = {headers: {'Content-Type' : 'multipart/form-data'}}
            for(let i=0; i<this.country_images.length; i++){
                this.form.append('destination_image[]', this.country_images[i]);
            }
           
            this.form.append('destination_id', this.destination_id);
            axios.post('http://tourism-app-backend.test/api/destination/upload/image', this.form ,config)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });

        }
    },
    mounted() {
        this.getDestination(this.destination_id);

    }

}
</script>

<style></style>