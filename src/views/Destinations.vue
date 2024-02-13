<template>
  <div class="destinations">
    <h2 class="text-center mt-5">Destinations</h2>
    <v-btn color="blue-darken-2" @click="showModal = !showModal">Create New Destination</v-btn>
    <Modal v-if="showModal">
      <v-dialog v-model="showModal" persistent>
        <v-row justify="center">
          <v-card class="bg-white" width="700">
            <v-card-title>Create New Destination</v-card-title>
            <v-form class="pa-5">
              <v-select v-model="country" :items="countries" label="Select Country" persistent-hint
                single-line></v-select>

              <v-text-field v-model="description" label="Enter description for country"></v-text-field>
              <v-textarea v-model="body" label="Enter destination content body"></v-textarea>
              <v-file-input v-model="country_image" variant="outlined" label="Choose country image"></v-file-input>

              <div class="d-flex justify-end">
                <v-btn class="ma-3 bg-grey" @click="showModal = !showModal">Close</v-btn>
                <v-btn class="ma-3 bg-blue" @click="submitForm">Save</v-btn>

              </div>
            </v-form>

          </v-card>

        </v-row>
      </v-dialog>

    </Modal>

    <v-data-iterator :items="destinations" class="mt-10 mx-5">

      <template v-slot:default="{ destinations }">

        <template v-for="destination in destinations" :key="destination.id">
          <v-card variant="outlined" v-bind="destination">


            <div class="d-flex justify-space-between">
              <v-card-title>Title: {{ destination.country }} <span class="mt-3 font-weight-bold">
             </span></v-card-title>

            </div>


          </v-card>

          <br>
        </template>
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const destinations = ref([]);
    const getDestinations = () => {
      axios.get('http://tourism-app-backend.test/api/destinations')
        .then(response => {
          // Assuming you want to update the destinations array with the response data
          destinations.value = response.data;
          console.log(destinations.value)
        })
        .catch(error => {
          console.error(error);
        });
    };

    const showModal = ref(false);
    const country = ref(null);
    const description = ref('');
    const body = ref('');
    const country_image = ref('')

    const countries = ref([
      'Thailand', 'Laos', 'Vietnam', 'Singapore', 'Myanmar', 'Phillipines'
    ]);
    const submitForm = () => {

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
          getDestinations();
          showModal.value = false;
        })
        .catch(function (error) {
          console.log(error)
        })

    }

    onMounted(() => {
      getDestinations();
    });

    return { destinations, countries, showModal, country, description, body, country_image, submitForm };
  }
};
</script>
