<template>
    <div>
        <v-card :loading="dataLoading" class="mx-auto pa-6" max-width="800">
            <v-card-title style="color: green;">School Details</v-card-title>
            <v-col class="d-flex">
                <v-card-text>Phone #</v-card-text>
                <v-card-text>{{ schoolPhone }}</v-card-text>
            </v-col>
            <v-col class="d-flex">
                <v-card-text>Email</v-card-text>
                <v-card-text>{{ schoolEmail }}</v-card-text>
            </v-col>
            <v-col class="d-flex">
                <v-card-text>School Code</v-card-text>
                <v-card-text>{{ schoolCode }}</v-card-text>
            </v-col>
            <v-col class="d-flex">
                <v-card-text>Address</v-card-text>
                <v-card-text style="text-transform: uppercase;">{{ city }}, {{ state }}, {{ country }}</v-card-text>
            </v-col>

            <v-card-title style="color: green;">Principle Details</v-card-title>
            <v-col class="d-flex">
                <v-card-text>Name</v-card-text>
                <v-card-text>{{ principleName }}</v-card-text>
            </v-col>
            <v-col class="d-flex">
                <v-card-text>Email</v-card-text>
                <v-card-text>{{ principleEmail }}</v-card-text>
            </v-col>
            <v-col class="d-flex">
                <v-card-text>Phone</v-card-text>
                <v-card-text>{{ principlePhone }}</v-card-text>
            </v-col>

            <v-card-title style="color: green;">Contracts</v-card-title>
            <v-card>
                <v-data-table :headers="headers" :items="desserts"></v-data-table>
            </v-card>
        </v-card>
    </div>
</template>

<script>
import { principles } from '../firebase'
import { db } from "../firebase";
import { getDoc, doc, where, query, getDocs } from "@firebase/firestore";

export default {
    data() {
        return {
            dataLoading: true,
            tab: 0,
            school__id: this.$route.query.id,
            schoolPhone: null,
            schoolEmail: null,
            schoolCode: null,
            country: null,
            state: null,
            city: null,
            principleName: null,
            principleEmail: null,
            principlePhone: null,
            headers: [
                {
                    text: 'Start Date',
                    value: 'startDate',
                },
                { text: 'End Date', value: 'endDate' },
                { text: 'Amount', value: 'amount' },
            ],
            desserts: [
                {
                    startDate: "10/1/20",
                    endDate: "11/1/22",
                    amount: "120"
                }
            ]
        }
    },
    methods: {
        async loadData() {
            try {
                this.dataLoading = true
                const id = this.$route.query.id
                const docRef = doc(db, 'school', id.toString())
                const snapshot = await getDoc(docRef)
                if (snapshot.exists()) {
                    console.log(snapshot.data())
                    this.schoolPhone = snapshot.data().phone
                    this.schoolEmail = snapshot.data().email
                    this.schoolCode = snapshot.data().code
                    this.country = snapshot.data().country
                    this.state = snapshot.data().state
                    this.city = snapshot.data().city
                    this.dataLoading = false
                } else {
                    console.log('no doc')
                }
            } catch (e) {
                console.log(e)
            }
            this.dataLoading = false

            try {
                this.dataLoading = true
                const id = this.$route.query.id
                let q
                if (this.tab == 0) {
                    q = query(principles, where("school_id", "==", id));
                } else {
                    q = query(principles, where("school_id", "==", id));
                }
                const snapshot = await getDocs(q);
                console.log(snapshot)
                const data = []
                snapshot.docs.map((e) => {
                    data.push({ id: e.id, ...e.data() })
                })
                console.log(data[0].phone)
                this.principlePhone = data[0].phone
                this.principleName = data[0].name
                this.principleEmail = data[0].email
                // return data
                this.dataLoading = false
            } catch (e) {
                console.log(e)
            }
            this.dataLoading = false

        }
    },
    mounted() {
        this.loadData()
    }
}
</script>