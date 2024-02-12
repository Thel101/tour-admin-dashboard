<template>
  <h2 class="text-center mt-5">Contents</h2>
  <v-btn color="blue-darken-2" @click="showModal = !showModal">
    Add New Content
  </v-btn>
  <Modal v-if="showModal">
    <v-dialog v-model="showModal" persistent>
      <v-row justify="center">
        <v-card class="bg-white" width="700">
          <v-card-title>Create New Content</v-card-title>
          <v-form class="pa-5">
            <v-select v-model="page_name" :hint="`${page_name}`" :items="pages" label="Select Page" persistent-hint
              single-line></v-select>

            <v-select v-model="content_slots" :items="slots" label="Select Content Slot" persistent-hint></v-select>

            <v-text-field v-model="title" label="Enter content title"></v-text-field>
            <v-textarea v-model="description" label="Enter content body"></v-textarea>
            <v-file-input v-model="background" variant="outlined" label="Choose content image"></v-file-input>

            <div class="d-flex justify-end">
              <v-btn class="ma-3 bg-grey" @click="showModal = !showModal">Close</v-btn>
              <v-btn class="ma-3 bg-blue" @click="submitForm">Save</v-btn>

            </div>
          </v-form>

        </v-card>

      </v-row>
    </v-dialog>

  </Modal>
  <div>
    Total Content: {{ totalItems }}
  </div>
  <v-data-iterator :items="items" class="mt-10 mx-5">

    <template v-slot:default="{ items }">
      
      <template v-for="item in items" :key="item.id">
        <v-card variant="outlined" v-bind="item" borde="1">
          <div class="d-flex mt-3 justify-start ">
            <v-img height="200px" :src="item.raw.background" alt="background" />
          </div>

          <div class="d-flex justify-space-between">
            <v-card-title>Title: {{ item.raw.title }} <span class="mt-3 font-weight-bold">( Page: {{ item.raw.page_name }}) </span></v-card-title>
            
            <span class="ma-3 font-weight-bold">Created At: {{ formatDate(item.raw.created_at) }}</span>

          </div>

          <v-card-text>Description: {{ item.raw.description }}</v-card-text>
          <div class="d-flex justify-end ma-3">
            <v-btn class="bg-primary mx-lg-2"><v-icon icon="mdi-file-edit"></v-icon></v-btn>
            <v-btn class="bg-red mx-lg-2"><v-icon icon="mdi-delete-empty"></v-icon></v-btn>
            <v-btn class="bg-grey mx-lg-2"><v-icon icon="mdi-cancel"></v-icon></v-btn>
          </div>
        </v-card>

        <br>
      </template>
    </template>
  </v-data-iterator>
  <v-pagination v-model="currentPage" :length="totalPages" @input="handlePageChange"></v-pagination>
</template>

<script>
import axios from 'axios'; // Importing axios without curly braces

import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
const Modal = defineAsyncComponent(() => import('../components/Modal.vue'))
export default {
  setup() {

    const page = ref(1);
    const items = ref([]);
    const currentPage = ref(1);
    const totalPages = ref();
    const totalItems = ref();

    const formatDate= (dateString) =>{
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }

    const getContents = (page) => {

      axios.get(`http://tourism-app-backend.test/api/contents?page=${page}`)
        .then(response => {
          const results = response.data.data;
          const updatedItems = results.map(item => {
            return {
              ...item,
              background: `http://tourism-app-backend.test/api/contents/image/${item.background}`
            }
          });
          items.value = updatedItems
          totalPages.value = response.data.last_page
          totalItems.value = response.data.total
        })
        .catch(error => {
          console.error(error);
        });
    }
    const handlePageChange = (value) => {
      currentPage.value = value;
    }

    const showModal = ref(false);
    const page_name = ref('Home');
    const content_slots = ref(1);
    const status = ref('active');
    const background = ref(null);
    const title = ref('');
    const description = ref('')
    const pages = ref([
      'Home',
      'Contact',
      'About Us',
      'Plans'
    ]);
    const slots = ref([1, 2, 3, 4, 5])
    const submitForm = () => {

      axios.post('http://tourism-app-backend.test/api/contents/create', {
        'page_name': page_name.value,
        'content_slots': content_slots.value,
        'status': status.value,
        'background': background.value ? background.value[0] : null,///to get image from frontend
        'title': title.value,
        'description': description.value
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function (response) {
          console.log(response)
          getContents();
          showModal.value = false;
        })
        .catch(function (error) {
          console.log(error)
        })

    }

    onMounted(() => {
      getContents(currentPage.value);
    })
    watch(currentPage, (newValue, oldValue) => {
      getContents(newValue);
    });

    return {
      page, items, getContents, showModal, page_name, pages, slots, content_slots, status,
      background,
      title,
      description, submitForm, currentPage, totalPages, handlePageChange, totalItems, formatDate
    };

  },
  components: {
    Modal
  }
}
</script>

 


