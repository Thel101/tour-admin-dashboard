<template>
  <v-data-table :headers="headers" :items="requests">
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.phone }}</td>
        <td>{{ item.reason }}</td>
        <td>{{ item.comments }}</td>
        <td>
          <div class="d-flex justify-end">
            <a :href="'mailto:' + item.email + '?subject=' + (item.subject ? encodeURIComponent(item.subject) : 'Information for your inquiry')"><v-btn prepend-icon="mdi-reply-all" color="blue">Reply</v-btn></a>
          </div>

        </td>
      </tr>

    </template></v-data-table>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const email = ref();
    const headers = [
      { title: 'Customer Name', value: 'name' },
      { title: 'Email', value: 'email' },
      { title: 'Phone', value: 'phone' },
      { title: 'Reason', value: 'reason' },
      { title: 'Comments', value: 'comments' },
      { title: '' },
    ];
    const requests = ref([]);
    const displayRequest = computed(() => {
      return requests.value.map(request => ({
        name: request.name,
        phone: request.email,
        email: request.phone,
        destination: request.reason,
        date: request.comments

      }));
    })
    const getRequests = () => {
      axios.get(`http://tourism-app-backend.test/api/contacts`)
        .then(function (response) {
          requests.value = response.data
          console.log(requests.value);
        })
        .catch(error => console.log(error))

    }

    const subject = ref('Information for your inqury');
    const mailtoLink = computed(() => {
      return `mailto:${email.value}?subject='${subject.value}'`
    })
    onMounted(() => {
      getRequests();
    })

    return { getRequests, requests, headers, displayRequest, mailtoLink, email }

  }
}
</script>

<style></style>