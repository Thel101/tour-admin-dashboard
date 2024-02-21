<template>
  <div class="destinations">
    <h2 class="text-center mt-5">Destinations</h2>
    
    <v-btn color="blue-darken-2" @click="showModal = !showModal">Create New Destination</v-btn>
    <h3>Total Destinations : {{ totalDestinations }}</h3>
    <v-dialog v-model="showModal">
      <DestinationForm @close-form="closeModal">

      </DestinationForm>
    </v-dialog>
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
              {{ destination.country }} {{ destination.description }} <span class="mt-3 font-weight-bold">
              </span></v-card-title>
            <v-card-text class="text-subtitle-1">{{ destination.body }}</v-card-text>
            <div class="d-flex justify-end ma-3">
              <v-btn class="bg-primary mx-lg-2"><v-icon icon="mdi-file-edit" @click="editDestination(destination.id)"></v-icon></v-btn>
              <v-btn class="bg-red mx-lg-2" @click="deleteDestination(destination.id)"><v-icon
                  icon="mdi-delete-empty"></v-icon></v-btn>
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
  <v-dialog v-model="showToast">
    <Toast :destination_delete="'delete'" :destination_id="destination_id" @close="deleteDestination">

    </Toast>
  </v-dialog>
  <v-dialog v-model="showEditForm">
      <DestinationForm @close-form="closeModal" :editId="edit_id">

      </DestinationForm>
    </v-dialog>
</template>
<script>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import DestinationForm from '../components/DestinationForm.vue';
import Toast from '../components/Toast.vue';
export default {
  components: {
    Toast,
    DestinationForm
  },

  setup() {
    const showModal = ref(false);
    const destinations = ref([]);
    const currentPage = ref(1);
    const totalPages = ref();
    const totalDestinations = ref();
    const getDestinations = (currentPage) => {
      showModal.value = false;
      axios.get(`http://tourism-app-backend.test/api/destinations?page=${currentPage}`)
        .then(response => {
          // Assuming you want to update the destinations array with the response data
          const results = response.data.data;
          const updatedDestination = results.map(item => {
            return {
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
    const handlePageChange = (value) => {
      currentPage.value = value
    }

    const destination_id = ref();
    const showToast = ref(false);
    const deleteDestination = (id) => {
      showToast.value = !(showToast.value);
      destination_id.value = id;
      getDestinations(currentPage.value);
    }

    const edit_id = ref();
    const showEditForm = ref(false);
    const editDestination = (id)=>{
    showEditForm.value = !(showEditForm.value)
    edit_id.value = id;
    getDestinations(currentPage.value);
    }
    const closeModal= ()=>{
      showModal.value = false;
      showEditForm.value =false;
      getDestinations(currentPage.value);
    }

    onMounted(() => {
      getDestinations(currentPage.value);
    });
    watch(currentPage, (newValue, oldValue) => {
      getDestinations(newValue);
    })

    return { destinations, showModal, currentPage, totalPages, totalDestinations, handlePageChange, deleteDestination, showToast, destination_id, showEditForm, editDestination, edit_id, closeModal };
  }
};
</script>
