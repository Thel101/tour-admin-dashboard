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

        <template v-for="destination in destinations" :key="destination.id">
      
            <v-row class="d-flex justify-space-between my-5">
              <v-col cols="md-4">
                <v-card elevation="2" class="border">
                  <v-img cover height="200px" :src="destination.country_image" alt="background" />
                </v-card>
                
              </v-col>
              <v-col>
                <v-card-title class="text-h5">
                {{ destination.country }} <span class="mt-3 font-weight-bold">
             </span></v-card-title>
             <v-card-text class="text-subtitle-1">{{ destination.body }}</v-card-text>
             <div class="d-flex justify-end ma-3">
            <v-btn class="bg-primary mx-lg-2"><v-icon icon="mdi-file-edit"></v-icon></v-btn>
            <v-btn class="bg-red mx-lg-2"><v-icon icon="mdi-delete-empty"></v-icon></v-btn>
            <v-btn class="bg-grey mx-lg-2"><v-icon icon="mdi-cancel"></v-icon></v-btn>
          </div>
              </v-col>
              
            </v-row>
          <br>
          <hr>
        </template>

    </v-data-iterator>
  </div>
  <v-pagination v-model="currentPage" :length="totalPages" @input="handlePageChange"></v-pagination>
</template>
<script>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const destinations = ref([]);
    const currentPage = ref(1);
    const totalPages = ref();
    const totalDestinations = ref();
    const getDestinations = (currentPage) => {
      axios.get(`http://tourism-app-backend.test/api/destinations?page=${currentPage}`)
        .then(response => {
          // Assuming you want to update the destinations array with the response data
         const results = response.data.data;
        const updatedDestination= results.map(item=>{
          return{
            ...item,
            country_image: `http://tourism-app-backend.test/api/destinations/image/${item.country_image}`
          }
        })
        destinations.value = updatedDestination;
        totalPages.value = response.data.last_page;
        totalDestinations.value = response.data.total
        console.log(destinations.value)
        })
        .catch(error => {
          console.error(error);
        });
    };
    const handlePageChange=(value) =>{
      currentPage.value = value
    }
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
      getDestinations(currentPage.value);
    });
    watch(currentPage, (newValue, oldValue)=>{
      getDestinations(newValue);
    })

    return { destinations, countries, showModal, country, description, body, country_image, submitForm, currentPage, totalPages, totalDestinations, handlePageChange };
  }
};
</script>
