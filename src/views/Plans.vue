<template>
    <v-data-table :headers="headers" :items = "plans">
    <template v-slot:item=" {item}">
        <tr> <td>{{ item.name }}</td>
        <td>{{ item.phone_no }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.destination }}</td>
        <td>{{ item.travel_date }}</td>
        <td>
            <router-link :to="{name: 'detailPlan', params:{ id: item.id}}">
                <v-btn class="bg-primary" size="small">see Details</v-btn>
            </router-link>
            
        </td></tr>
        
    </template></v-data-table>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import PlanDetail from './PlanDetail.vue';
export default {
    setup() {

        const headers = [
            { title: 'Customer Name', value: 'name' },
            { title: 'Phone No', value: 'phone_no' },
            { title: 'Email Address', value: 'email' },
            { title: 'Destination', value: 'destination' },
            { title: 'Travel Date', value: 'travel_date' },
            { title: '' },
        ];
        const plans = ref([]);
        const displayPlan = computed(()=>{
            return plans.value.map(plan=>({
                name : plan.name,
                phone: plan.phone_no,
                email : plan.email,
                destination : plan.destination,
                date : plan.travel_date

            }));
        })
        const getPlans = () => {
            axios.get(`http://tourism-app-backend.test/api/plans`)
                .then(function (response) {
                    plans.value = response.data
                    console.log(plans.value)
                })
                .catch(error => console.log(error))

        }  
        onMounted(() => {
            getPlans(); 
        })

        return { getPlans, plans, headers, displayPlan }

    }
}
</script>

<style></style>