<template>
  <h2 class="text-center mt-5">Home Page Contents</h2>
  <v-btn color="blue-darken-2" @click="showModal = !showModal">
    Add New Content
  </v-btn>
  <!-- Create New Content--->
  <Modal v-if="showModal">
    <v-dialog v-model="showModal" persistent>
      <v-row justify="center">
        <v-card class="bg-white" width="700">
          <v-card-title>Create New Content</v-card-title>
          <v-form class="pa-5">
            <v-text-field v-model="page_name" label="Enter content title" readonly  ></v-text-field>

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
  <!-- Display Contents list-->
  <div>
    Total Content: {{ totalItems }}
  </div>
  <v-data-iterator :items="items" class="mt-10 mx-5">

    <template v-for="item in items" :key="item.id">
      <v-card variant="outlined">
        <v-row>
          <v-col cols="md-4">
            <v-img height="200px" :src="item.background" alt="background" />
          </v-col>
          <v-col>
            <div class="d-flex justify-space-between">
              <v-card-title>Title: {{ item.title }} <span class="mt-3 font-weight-bold">Page: {{ item.page_name }}
                </span></v-card-title>

              <span class="ma-3 font-weight-bold">Created At: {{ formatDate(item.created_at) }}</span>

            </div>

            <div class="ma-3 font-weight-bold">Status: {{ item.status }}</div>
            <div class="ma-3 font-weight-bold">Content Slot: {{ item.content_slots }}</div>


            <v-card-text>Description: {{ item.description }}</v-card-text>
            <div class="d-flex justify-end ma-3">
              <v-btn title="edit" class="bg-primary mx-lg-2" @click="getContent(item.id)"><v-icon
                  icon="mdi-file-edit"></v-icon></v-btn>
              <v-btn title="delete" class="bg-red mx-lg-2" @click="toggleToast(item.id)"><v-icon
                  icon="mdi-delete-empty"></v-icon></v-btn>
              <v-btn title="deactivate" v-if="item.status === 'active'" class="bg-grey mx-lg-2"
                @click="toggleActiveForm(item.id)"><v-icon icon="mdi-cancel"></v-icon></v-btn>
              <v-btn title="reactivate" v-if="item.status === 'inactive'" class="bg-blue mx-lg-2"
                @click="toggleActiveForm(item.id)"><v-icon icon="mdi-account-reactivate"></v-icon></v-btn>
            </div>

          </v-col>
        </v-row>
      </v-card>

      <br>
    </template>

  </v-data-iterator>
  <v-pagination v-model="currentPage" :length="totalPages" @input="handlePageChange"></v-pagination>
  <!-- Conform box-->

  <v-dialog v-model="showToast">
    <Toast :delete="'delete'" :id="id" @close="toggleToast" @closeModal="closeModal">

    </Toast>
  </v-dialog>
  <v-dialog v-model="showActiveForm">
    <Toast :status="'update status for'" :slot_id="slot_id" @changeStatus="toggleActiveForm" @closeModal="closeModal">

    </Toast>
  </v-dialog>

  <!-- Conform box-->
  <!-- Content Edit Form-->
  <Modal v-if="showEditForm">
    <v-dialog v-model="showEditForm" persistent scrollable>
      <v-row justify="center">
        <v-card class="bg-white" width="700">
          <v-card-title>Create New Content</v-card-title>
          <v-form class="pa-5">
            <v-text-field type="hidden" v-model="content_id"></v-text-field>
            <v-select v-model="page_name" :hint="`${page_name}`" :items="pages" label="Select Page" persistent-hint
              single-line></v-select>

            <v-select v-model="content_slots" :items="slots" label="Select Content Slot" persistent-hint></v-select>

            <v-text-field v-model="title" label="Enter content title"></v-text-field>
            <v-textarea v-model="description" label="Enter content body"></v-textarea>
            <div class="d-flex justify-space-around">

              <v-img :src="oldImage" max-height="200px"></v-img>

              <v-file-input v-model="background" variant="outlined" label="Choose content image"></v-file-input>

            </div>


            <div class="d-flex justify-end">
              <v-btn class="ma-3 bg-grey" @click="showEditForm = !showEditForm, clearContacts()">Close</v-btn>
              <v-btn class="ma-3 bg-blue" @click="editContent">Save</v-btn>

            </div>
          </v-form>

        </v-card>

      </v-row>
    </v-dialog>
  </Modal>
</template>

<script>
import axios from 'axios'; // Importing axios without curly braces

import { onMounted, ref, watch } from 'vue';
import Toast from '../components/Toast.vue';
export default {
  components: {
    Toast
  },
  setup() {

    const page = ref(1);
    const items = ref([]);
    const currentPage = ref(1);
    const totalPages = ref();
    const totalItems = ref();

    const formatDate = (dateString) => {
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
          console.log(items.value);
        })
        .catch(error => {
          console.error(error);
        });
    }
    const handlePageChange = (value) => {
      currentPage.value = value;
    }
    const id = ref();
    const showToast = ref(false);
    const toggleToast = (item_id) => {
      showToast.value = !(showToast.value);
      id.value = item_id;
      getContents(currentPage.value)
    }
    const slot_id = ref();
    const showActiveForm = ref(false);
    const toggleActiveForm = (item_id) => {
      showActiveForm.value = !(showActiveForm.value);
      slot_id.value = item_id;
      getContents(currentPage.value)
    }

    const closeModal = () =>{
      showToast.value = false;
      showActiveForm.value = false
    }
    const showModal = ref(false);
    const content_id = ref();
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
    const showEditForm = ref(false);
    const oldImage = ref();
    const getContent = (id) => {
      showEditForm.value = true;
      axios.get(`http://tourism-app-backend.test/api/content/${id}`)
        .then(response => {
          content_id.value = response.data.id
          page_name.value = response.data.page_name;
          content_slots.value = response.data.content_slots;
          status.value = response.data.status;
          oldImage.value = `http://tourism-app-backend.test/api/contents/image/${response.data.background}`;
          title.value = response.data.title;
          description.value = response.data.description;
        })
        .catch(error => console.log(error))
    }

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
        .then(function(response){
          console.log(response.data)
          clearContacts()
        }
        )
        .catch(function (error) {
          console.log(error)
        })

    }

    const editContent = () => {
      axios.post('http://tourism-app-backend.test/api/content/update', {
        'id': content_id.value,
        'page_name': page_name.value,
        'content_slots': content_slots.value,
        'status': status.value,
        'background': oldImage.value ? oldImage.value[0] : background.value,///to get image from frontend
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
          getContents(currentPage.value);
          showEditForm.value = false;
        })
        .catch(function (error) {
          console.log(error)
        })

    }

    const clearContacts = () => {
      title.value = '';
      description.value = '';
      background.value = ''
      getContents();
      showModal.value = false;
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
      description, submitForm, currentPage, totalPages, handlePageChange, totalItems, formatDate, getContent, showEditForm, oldImage, content_id, editContent,
      showToast, toggleToast, id, showActiveForm, toggleActiveForm, slot_id, clearContacts, closeModal
    };

  }
}
</script>

 


