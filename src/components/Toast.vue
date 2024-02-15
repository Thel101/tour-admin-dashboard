<template>
    <v-row justify="center">
        <v-card>
            <v-card-title class="text-h5">
                Confirmation box
            </v-card-title>
            <v-card-text>Are you sure you want to {{ actionMessage }} this?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green-darken-1" variant="text" @click="dialog = false">
                    Disagree
                </v-btn>
                <v-btn color="green-darken-1" variant="text" @click="invokeMethod">
                    Proceed
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-row>
</template>
<script>
import axios from 'axios';
export default {
    name: 'Toast',
    props: ['delete', 'id', 'status', 'slot_id'],
    data() {
        return {
            dialog: true
        }
    },
    methods: {
        deleteContent(delete_id) {
            axios.delete(`http://tourism-app-backend.test/api/content/delete/${delete_id}`)
                .then(response => {
                    console.log(response.data)
                    this.$emit('close');
                })
                .catch(error => console.log(error));
        },
        slotStatus(status_id) {
            axios.post(`http://tourism-app-backend.test/api/content/slot/status/${status_id}`)
                .then(response => {
                    console.log(response.data) 
                    this.$emit('changeStatus')
                })
                .catch(error => console.log(error))
        },
        invokeMethod() {
            if (this.delete) {
                this.deleteContent(this.id)
            }
            else if (this.status) {
                this.slotStatus(this.slot_id);
            }
        }
    },
    computed: {
        actionMessage() {
            if (this.delete) {
                return this.delete;
            }
            else if (this.status) {
                return this.status
            }
            else {
                return 'perform action'
            }
        }
    }
}
</script>