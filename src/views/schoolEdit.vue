<template>
    <div>
        <v-dialog v-model="loading" max-width="600" width="200" persistent>
            <v-card style="padding: 20px; text-align: left; display: flex; align-items: center">
                <v-progress-circular indeterminate color="primary" />
                <p style="margin-left: 20px; margin-bottom: 0;"> Please wait</p>
            </v-card>
        </v-dialog>
        <!-- SCHOOL DETAILS -->
        <v-card class="mx-auto pa-6" max-width="800">
            <v-col class=" pa-0 ma-0">
                <v-col class="d-flex justify-end" style="gap: 15px">
                    <router-link to="/">
                        <v-btn dark color="primary" elevation="0" @click="router - link">Back
                        </v-btn>
                    </router-link>
                </v-col>
            </v-col>
            <v-card-title class="justify-center" style="font-size: 28px;">School Detail</v-card-title>
            <v-form @submit.prevent="update" ref="form" lazy-validation>
                <v-col class="d-flex pa-0 ma-0">
                    <v-col>
                        <v-text-field :rules="[required()]" v-model="school.name" label="School Name" required outlined>
                        </v-text-field>
                    </v-col>

                    <v-col>
                        <v-text-field :rules="[required()]" type="number" v-model="school.phone" label="School Phone #"
                            required outlined>
                        </v-text-field>
                    </v-col>
                </v-col>

                <v-col class="d-flex pa-0 ma-0">
                    <v-col>
                        <v-text-field :rules="[required(), email()]" type="email" v-model="school.email"
                            label="School Email" required outlined>
                        </v-text-field>
                    </v-col>

                    <v-col>
                        <v-text-field :rules="[required()]" type="number" v-model="school.code" label="School Code "
                            required outlined>
                        </v-text-field>
                    </v-col>
                </v-col>

                <v-col class="d-flex pa-0 ma-0">
                    <v-col cols="6">
                        <v-text-field :rules="[required()]" type="number" v-model="school.secret_code"
                            label="Secret Code" required outlined>
                        </v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-autocomplete :rules="[required()]" v-model="school.country" aria-autocomplete="false"
                            label="Country" :loading="countriesLoading" :items="countries" item-text="name" outlined
                            @change="getStates" return-object :valueComparator="(a, b) => a === b"></v-autocomplete>
                    </v-col>
                </v-col>

                <v-col class="d-flex pa-0 ma-0">
                    <v-col cols="6">
                        <v-autocomplete :rules="[required()]" aria-autocomplete="false" v-model="school.state"
                            :loading="statesLoading" label="State" :items="states" item-text="name" outlined
                            @change="getCities" :valueComparator="(a, b) => a === b">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-autocomplete :rules="[required()]" aria-autocomplete="false" v-model="school.city"
                            :loading="citiesLoading" label="City" :items="cities" item-text="name" outlined
                            :valueComparator="(a, b) => a === b">
                        </v-autocomplete>
                    </v-col>
                </v-col>


                <!-- PRINCIPLE DETAILS -->
                <v-card-title class="justify-center" style="font-size: 28px;">Principle Detail</v-card-title>
                <v-col class="d-flex pa-0 ma-0">
                    <v-col>
                        <v-text-field :rules="[required()]" v-model="principle.name" label="Principle Name" required
                            outlined></v-text-field>
                    </v-col>

                    <v-col>
                        <v-text-field :rules="[required()]" type="number" v-model="principle.phone"
                            label="Principle Phone #" required outlined>
                        </v-text-field>
                    </v-col>
                </v-col>

                <v-col class="d-flex pa-0 ma-0">
                    <v-col cols="6">
                        <v-text-field :rules="[required()]" v-model="principle.notification_password"
                            label="Notification Password" required outlined>
                        </v-text-field>
                    </v-col>
                </v-col>
                
                <v-col>
                    <v-btn class="mt-10" :disabled="countriesLoading || statesLoading || citiesLoading" type="submit"
                        color="#12AD2B">
                        Update
                    </v-btn>
                </v-col>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import { required, email } from '@/utils/validators';

import { db } from "../firebase";
import { getDoc, doc, query, where, getDocs, updateDoc } from "@firebase/firestore";
import { principles, schools } from '../firebase';
import axios from "axios";
import dayjs from 'dayjs'

export default {
    data() {
        return {
            valid: true,
            loading: false,
            principle_id: null,
            school: {
                isActive: true,
                name: null,
                email: null,
                phone: null,
                code: null,
                secret_code: null,
                contracts: []
            },
            contract: {
                start_date: null,
                end_date: null,
                contract_amount: null,
            },
            principle: {
                school_id: null,
                name: null,
                phone: null,
                email: null,
                username: null,
                password: null,
                notification_password: null,
            },
            countries: [],
            states: [],
            cities: [],
            countriesLoading: false,
            statesLoading: false,
            citiesLoading: false,
            headers: [
                {
                    text: 'Start Date', value: "start"
                },
                { text: 'End Date', value: 'end' },
                { text: 'Amount', value: 'contract_amount' },
            ],
            items: []
        }
    },

    methods: {
        required, email,
        formatDate(date) {
            return dayjs(date.seconds).format('DD/MM/YYYY')
        },
        async getCountries() {
            try {
                this.countriesLoading = true
                const countries = await axios.get('https://countriesnow.space/api/v0.1/countries/states')
                this.countries = countries.data.data
                this.countriesLoading = false
            } catch (e) {
                console.log(e)
            }
            this.countriesLoading = false
        },
        getStates() {
            console.log('get state')
            console.log(this.school)
            this.statesLoading = true
            if (this.school && this.school.country && typeof (this.school.country) === 'object') {
                this.states = this.school.country.states
            } else if (typeof (this.school.country) !== 'object') {
                this.states = this.countries.find((o) => o.name === this.school.country).states
            }
            this.statesLoading = false
        },
        async getCities() {
            try {
                this.citiesLoading = true
                const data = {
                    "country": typeof (this.school.country) === 'object' ? this.school.country.name : this.school.country,
                    "state": this.school.state
                }
                const cities = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', data)
                this.cities = cities.data.data
                this.citiesLoading = false
            } catch (e) {
                console.log(e)
                this.citiesLoading = false
            }
        },
        async loadData() {
            try {
                const id = this.$route.query.id
                const docRef = doc(db, 'school', id.toString())
                const snapshot = await getDoc(docRef)
                if (snapshot.exists()) {
                    // console.log(snapshot.data())
                    this.school.phone = snapshot.data().phone
                    this.school.name = snapshot.data().name
                    this.school.email = snapshot.data().email
                    this.school.code = snapshot.data().code
                    this.school.secret_code = snapshot.data().secret_code
                    console.log(snapshot.data().contracts)
                    this.items = snapshot.data().contracts

                    this.school.country = snapshot.data().country
                    this.school.state = snapshot.data().state
                    this.school.city = snapshot.data().city
                } else {
                    console.log('no doc')
                }
            } catch (e) {
                console.log(e)
            }

            try {
                const id = this.$route.query.id
                let q
                if (this.tabb == 0) {
                    q = query(principles, where("school_id", "==", id));
                } else {
                    q = query(principles, where("school_id", "==", id));
                }
                const snapshot = await getDocs(q);
                // console.log(snapshot)
                const data = []
                snapshot.docs.map((e) => {
                    data.push({ id: e.id, ...e.data() })
                })
                // console.log(data[0])
                this.principle_id = data[0].id
                this.principle.name = data[0].name
                // this.principle.email = data[0].email
                this.principle.phone = data[0].phone
                // this.principle.username = data[0].username
                this.principle.notification_password = data[0].notification_password
                // this.principle.password = data[0].password
            } catch (e) {
                console.log(e)
            }
        },

        async update() {
            if (this.$refs.form.validate()) {
                try {
                    this.loading = true
                    const id = this.$route.query.id
                    let schoolsRef = doc(schools, id)
                    await updateDoc(schoolsRef, {
                        name: this.school.name,
                        phone: this.school.phone,
                        email: this.school.email,
                        code: this.school.code,
                        secret_code: this.school.secret_code,
                        country: typeof (this.school.country) === 'object' ? this.school.country.name : this.school.country,
                        state: this.school.state,
                        city: this.school.city,
                    })
                    this.loading = false

                } catch (e) {
                    console.log(e)
                }

                let principlesRef = doc(principles, this.principle_id)
                await updateDoc(principlesRef, {
                    name: this.principle.name,
                    phone: this.principle.phone,
                    // email: this.principle.email,
                    // password: this.principle.password,
                    notification_password: this.principle.notification_password,
                })

                this.$router.push('/')
            }
        },
    },
    mounted() {
        this.loadData().then(() => {
            this.getCountries().then(() => {
                this.getStates()
                this.getCities()
            })
        })
    }
}
</script>
