<template>
    <v-sheet elevation="12" rounded="lg" class="px-7 py-7 mt-5" fluid>

        <div class="d-flex">
            <v-avatar color="info" class="mr-5">
                <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
            <div class="text-h6 text-blue-accent-2">{{ plan.name }}</div>
        </div>

        <div class="d-flex">
            <div class="d-flex mt-5">
                <v-icon color="grey" icon="mdi-phone" class="mr-3 mt-1"></v-icon>
                <div class="text-h6">{{ plan.phone_no }}</div>
            </div>
            <div class="d-flex mt-5 ml-5">
                <v-icon color="grey" icon="mdi-email" class="mr-3 mt-1"></v-icon>
                <div class="text-h6">{{ plan.email }}</div>
            </div>

        </div>
        <hr class="mt-3">

        <div class="text-body-1">{{ plan.trip_details }}</div>
        <br>

        <div class="d-flex">
            <div class="d-flex">
                <v-icon class="bg-amber rounded pa-4 mr-4" icon="mdi-map-marker-outline"></v-icon>
                <span class="text-h6 text">Destination: {{ plan.destination }}</span>
            </div>
            <div class="d-flex ml-10">
                <v-icon class="bg-blue rounded pa-4 mr-4" icon="mdi-account-group-outline"></v-icon>
                <span class="text-h6 text">Travellers: {{ plan.traveller_count }}</span>
            </div>
            <div class="d-flex ml-10">
                <v-icon class="bg-grey rounded pa-4 mr-4 ml-7" icon="mdi-calendar-range"></v-icon>
                <span class="text-h6 text">Planned date: {{ plan.travel_date }}</span>
            </div>
        </div>
        <hr class="my-3">
        <div class="d-flex">
            <div class="d-flex">
                <span class="text-h6 text">Accomodation: <span class="font-weight-regular">{{ plan.accomodation_pref
                }}</span></span>
            </div>
            <div class="d-flex ml-10">
                <span class="text-h6 text">Room preferences: <span class="font-weight-regular">{{ plan.room_pref
                }}</span></span>
            </div>
            <div class="d-flex ml-10">
                <span class="text-h6 text">Adventure level: <span class="font-weight-regular">{{ adventure }}
                        Mid</span></span>
            </div>
            <div class="d-flex ml-10">
                <span class="text-h6 text">Comfort level: <span class="font-weight-regular">{{ comfort }}</span></span>
            </div>
        </div>
        <br>

        <div>
            <span class="text-h6">Interests and Activities</span>
            <div class="d-flex">
                <v-card width="20vw" elevation="4" class="mr-3">

                    <v-card-text class="text-h6">Sports</v-card-text>
                    <ul style="list-style: none;" class="px-5" v-for="(sport, index) in sports" :key="index">
                        <li class="bg-grey rounded my-3 pa-2 font-weight-bold">{{ sport }}</li>
                    </ul>
                </v-card>
                <v-card width="20vw" elevation="4" class="mr-3">

                    <v-card-text class="text-h6">Cultural Interests</v-card-text>
                    <ul style="list-style: none;" class="px-5" v-for="(culture, index) in cultures" :key="index">
                        <li class="bg-grey rounded my-3 pa-2 font-weight-bold">{{ culture }}</li>
                    </ul>
                </v-card>
                <v-card width="20vw" elevation="4" class="mr-3">

                    <v-card-text class="text-h6">Cuisine Choice</v-card-text>
                    <ul style="list-style: none;" class="px-5" v-for="(food, index) in foods" :key="index">
                        <li class="bg-grey rounded my-3 pa-2 font-weight-bold">{{ food }}</li>
                    </ul>
                </v-card>
            </div>

        </div>
        <br>
        <div>
            <span class="text-h6">Special Requests</span>
            <div class="d-flex">
                <v-card width="25vw" elevation="4" class="mr-3">

                    <v-card-text class="text-h6">Additional Requests</v-card-text>
                    <ul style="list-style: none;" class="px-5" v-for="(additional, index) in additional_reqs" :key="index">
                        <li class="bg-grey rounded my-3 pa-2 font-weight-bold">{{ additional }}</li>
                    </ul>
                </v-card>
                <div>
                    <v-card elevation="4" class="mr-3 d-flex">
                        <v-btn class="ma-2 small" color="blue-lighten-3" icon="mdi-fireplace"></v-btn>

                        <v-card-text class="text-h6">Occasional Requests : <span class="text-body-1 font-weight-regular">{{
                            occasional_reqs }}</span></v-card-text>
                    </v-card>
                    <v-card elevation="4" class="mr-3 mt-3 d-flex">
                        <v-btn class="ma-2 small" color="amber-lighten-3" icon="mdi-train-car"></v-btn>

                        <v-card-text class="text-h6">Transportation : <span class="text-body-1 font-weight-regular">{{
                            transportation
                        }}</span></v-card-text>
                    </v-card>
                </div>
            </div>

        </div>
        <div class="d-flex justify-end">
            <a :href="mailtoLink"><v-btn prepend-icon="mdi-reply-all" color="blue">Reply</v-btn></a>
        </div>
    </v-sheet>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios';
export default {
    props: ['id'],
    setup(props) {
        const plan = ref([]);
        const adventure = ref();
        const sports = ref();
        const cultures = ref();
        const foods = ref();
        const activities = ref();
        const additional_reqs = ref();
        const occasional_reqs = ref();
        const comfort = ref();
        const transportation = ref();
        const email = ref();
        onMounted(() => {
            axios.get(`http://tourism-app-backend.test/api/plan/${props.id}`)
                .then(function (response) {
                    plan.value = response.data
                    adventure.value = plan.value.adventure
                    sports.value = plan.value.interests.sports_interests
                    cultures.value = plan.value.interests.cultural_interests
                    foods.value = plan.value.special_requests.food
                    activities.value = plan.value.special_requests.activity
                    additional_reqs.value = plan.value.special_requests.additional
                    occasional_reqs.value = plan.value.special_requests.occasional
                    comfort.value = plan.value.expenses.comfort
                    transportation.value = plan.value.expenses.transportation
                    email.value = plan.value.email
                    console.log(foods.value);
                })
                .catch(error => console.log(error))
        })
        const subject = ref('Information for your travel plan');
        const mailtoLink= computed(()=>{
            return `mailto:${email.value}?subject='${subject.value}'`
        })
        return { plan, adventure, sports, cultures, foods, activities, additional_reqs, occasional_reqs, comfort, transportation, email, subject, mailtoLink }
    }
}
</script>

<style></style>