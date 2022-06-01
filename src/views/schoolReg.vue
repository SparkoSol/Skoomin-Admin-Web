<template>
    <div>
        <v-dialog v-model="loading" max-width="600" width="200" persistent>
            <v-card style="padding: 20px; text-align: left; display: flex; align-items: center">
                <v-progress-circular indeterminate color="primary" />
                <p style="margin-left: 20px; margin-bottom: 0;">Please wait</p>
            </v-card>
        </v-dialog>
        <!-- SCHOOL DETAILS -->
        <v-card class="mx-auto pa-6" max-width="800">
            <v-card-title class="justify-center" style="font-size: 28px;">School Detail</v-card-title>
            <v-form @submit.prevent="register" lazy-validation ref="form">
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
                        <v-text-field :rules="[required()]" type="number" v-model="school.secret_code" label="Secret Code"
                            required outlined>
                        </v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-autocomplete :rules="[required()]" v-model="school.country" aria-autocomplete="false"
                            label="Country" :loading="countriesLoading" :items="countries" item-text="name" outlined
                            @change="getStates" return-object></v-autocomplete>
                    </v-col>
                </v-col>

                <v-col class="d-flex pa-0 ma-0">
                    <v-col cols="6">
                        <v-autocomplete :rules="[required()]" aria-autocomplete="false" v-model="school.state"
                            :loading="statesLoading" label="State" :items="states" item-text="name" outlined
                            @change="getCities">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-autocomplete :rules="[required()]" aria-autocomplete="false" v-model="school.city"
                            :loading="citiesLoading" label="City" :items="cities" item-text="name" outlined>
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
                    <v-col>
                        <v-text-field :rules="[required()]" type="email" v-model="principle.email"
                            label="Principle Email" required outlined>
                        </v-text-field>
                    </v-col>

                    <v-col>
                        <v-text-field :rules="[required()]" v-model="principle.username" label="Principle Username "
                            required outlined>
                        </v-text-field>
                    </v-col>
                </v-col>

                <v-col class="d-flex pa-0 ma-0">
                    <v-col cols="6">
                        <v-text-field :rules="[required()]" v-model="principle.password" label="Principle's Password"
                            required outlined>
                        </v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field :rules="[required()]" v-model="principle.notification_password" label="Notification Password"
                            required outlined>
                        </v-text-field>
                    </v-col>
                </v-col>


                <!-- FIRST CONTRACT -->
                <v-card-title class="justify-center" style="font-size: 28px;">First Contract</v-card-title>
                <v-col class="d-flex pa-0 ma-0">
                    <v-col>
                        <v-text-field :rules="[required()]" outlined label="Contract Start Date" type="date"
                            v-model="contract.start_date">
                        </v-text-field>
                    </v-col>

                    <v-col>
                        <v-text-field :rules="[required()]" outlined label="Contract Last Date" type="date"
                            v-model="contract.end_date">
                        </v-text-field>
                    </v-col>

                </v-col>
                <v-col class="d-flex pa-0 ma-0">
                    <v-col cols="6">
                        <v-text-field :rules="[required()]" type="number" label="Contract Amount"
                            v-model="contract.contract_amount" required outlined>
                        </v-text-field>
                    </v-col>
                </v-col>
                <v-col>
                    <v-btn v-if="required" :disabled="countriesLoading || statesLoading || citiesLoading" type="submit"
                        color="#12AD2B">
                        Register
                    </v-btn>
                </v-col>
            </v-form>
        </v-card>
        <ErrorDialog v-model="error" :error="errorVal" />
    </div>
</template>

<script>
import { required, email } from '@/utils/validators';

import { schools, db } from '../firebase';
import { addDoc, setDoc, doc } from '@firebase/firestore';
import axios from 'axios';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();

import ErrorDialog from '../components/ErrorDialog.vue';

export default {
    data() {
        return {
            auth_uid: null,
            valid: true,
            loading: false,
            menu: false,
            emenu: false,
            error: false,
            errorVal: {},
            school: {
                isActive: true,
                name: null,
                email: null,
                phone: null,
                code: null,
                secret_code: null,
                contracts: [],
                country: null,
                state: null,
                city: null
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
            citiesLoading: false
        };
    },
    mounted() {
        this.getCountries();
    },
    methods: {
        email,
        required,
        async getCountries() {
            try {
                this.countriesLoading = true;
                const countries = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
                this.countries = countries.data.data;
                this.countriesLoading = false;
            }
            catch (e) {
                console.log(e);
            }
            this.countriesLoading = false;
        },
        getStates() {
            console.log("get state");
            console.log(this.school);
            this.statesLoading = true;
            if (this.school && this.school.country)
                this.states = this.school.country.states;
            this.statesLoading = false;
        },
        async getCities() {
            try {
                this.citiesLoading = true;
                const data = {
                    "country": this.school.country.name,
                    "state": this.school.state
                };
                const cities = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", data);
                this.cities = cities.data.data;
                this.citiesLoading = false;
            }
            catch (e) {
                console.log(e);
                this.citiesLoading = false;
            }
        },
        async register() {
            if (this.$refs.form.validate()) {
                try {
                    this.loading = true
                    const user = await this.authRegister();
                    if (user && user.uid) {
                        console.log('add contract')
                        this.school.contracts.push(this.contract);
                        console.log('add country')
                        this.school.country = this.school.country.name;
                        console.log('add school')
                        const addedDoc = await addDoc(schools, this.school);
                        console.log(addedDoc);
                        console.log('set school id')
                        this.principle.school_id = addedDoc.id;
                        console.log('add principle')
                        const principleRef = doc(db, "principle", user.uid);
                        console.log(principleRef);
                        const addedDoc2 = await setDoc(principleRef, this.principle);
                        console.log("created");
                        console.log(addedDoc);
                        console.log(addedDoc2);
                        this.loading = false
                        this.$router.push('/')
                    } else {
                        this.loading = false
                        this.error = true
                        this.errorVal = {
                            title: 'Error while creating school',
                            description: 'Email is already in use'
                        }
                    }
                }
                catch (e) {
                    this.loading = false
                    this.error = true
                    this.errorVal = {
                        title: 'Error while creating school',
                        description: e || e?.message || 'Some error occured'
                    }
                    console.log(e);
                }
            }
        },
        async authRegister() {
            try {
                console.log('adding user')
                const userCredential = await createUserWithEmailAndPassword(auth, this.principle.email, this.principle.password)
                console.log(userCredential)
                const user = userCredential.user;
                console.log(user);
                console.log(user.uid);
                this.auth_uid = user.uid;
                return user;
            } catch (error) {
                console.log(error);
                console.log("error auth");
                const errorMessage = error.message;
                console.log(errorMessage);
                return error

            }
        }
    },
    components: { ErrorDialog }
}
</script>
