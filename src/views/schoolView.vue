<template>
    <div>
        <v-card :loading="dataLoading" class="mx-auto pa-6" max-width="800">
            <v-col class=" pa-0 ma-0">
                <v-col class="d-flex justify-end" style="gap: 15px">
                    <router-link to="/">
                        <v-btn dark color="primary" elevation="0" @click="router - link">Back
                        </v-btn>
                    </router-link>
                </v-col>
            </v-col>
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

            <v-col>
                <v-row justify="space-between">
                    <v-card-title style="color: green;">Contracts</v-card-title>
                    <v-btn color="primary" @click="contractDialog = !contractDialog" dark>Add new</v-btn>
                </v-row>
            </v-col>

            <v-card>
                <v-data-table :items="items" :headers="headers" hide-default-footer disable-pagination>
                    <template #item.start="{ item }">
                        {{ formatDate(item.start_date) }}
                    </template>
                    <template #item.end="{ item }">
                        {{ formatDate(item.end_date) }}
                    </template>
                </v-data-table>
            </v-card>
        </v-card>


        <v-dialog max-width="600" v-model="contractDialog" persistent>
            <v-card style="padding: 20px;">
                <v-form ref="contractForm">
                    <v-row class="flex-column span-2" style="margin-top: 20px;">
                        <v-col class="d-flex pa-0 ma-0">
                            <v-col>
                                <v-text-field :rules="[required()]" outlined label="Contract Start Date" type="date"
                                    v-model="contract.start_date">
                                </v-text-field>
                            </v-col>
                        </v-col>
                        <v-col class="pa-0 ma-0">
                            <v-col>
                                <v-text-field :rules="[required()]" outlined label="Contract Last Date" type="date"
                                    v-model="contract.end_date">
                                </v-text-field>
                            </v-col>
                        </v-col>
                        <v-col class=" pa-0 ma-0">
                            <v-col>
                                <v-text-field :rules="[required()]" type="number" label="Contract Amount"
                                    v-model="contract.contract_amount" required outlined>
                                </v-text-field>
                            </v-col>
                        </v-col>
                        <v-col class=" pa-0 ma-0">
                            <v-col class="d-flex justify-end" style="gap: 15px">
                                <v-btn outlined color="primary" elevation="0" @click="contractDialog = false">Cancel
                                </v-btn>
                                <v-btn dark color="primary" elevation="0" @click="addContract">Add
                                </v-btn>
                            </v-col>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-dialog>
        <LoadingDialog v-model="loading" message="Loading..." />
        <ErrorDialog v-model="error" :error="errorVal" />
    </div>
</template>

<script>
import { required, email } from '@/utils/validators';

import { db, schools, principles } from '../firebase'
import { getDoc, doc, query, where, getDocs, updateDoc } from "@firebase/firestore";

import dayjs from 'dayjs'
import LoadingDialog from '../components/LoadingDialog.vue';
import ErrorDialog from '../components/ErrorDialog.vue';


export default {
    data() {
        return {
            loading: false,
            error: false,
            errorVal: {},
            contractDialog: false,
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
            school: null,
            headers: [
                {
                    text: "Start Date",
                    value: "start"
                },
                { text: "End Date", value: "end" },
                { text: "Amount", value: "contract_amount" },
            ],
            contract: {
                start_date: null,
                end_date: null,
                contract_amount: null,
            },
            items: []
        };
    },
    methods: {
        required,
        email,
        formatDate(date) {
            return dayjs(date.seconds).format("DD/MM/YYYY");
        },
        async addContract() {
            if (this.$refs.contractForm.validate()) {
                try {
                    this.loading = true;
                    console.log(this.contract);
                    console.log(this.school);
                    this.contract.start_date = new Date(this.contract.start_date);
                    this.contract.end_date = new Date(this.contract.end_date);
                    this.school.contracts.push(this.contract);

                    let schoolsRef = doc(schools, this.school.id);
                    await updateDoc(schoolsRef, {
                        contracts: this.school.contracts,
                    });
                    this.loadData()
                    this.loading = false;
                    this.contractDialog = false
                } catch (e) {
                    this.loading = false
                    this.error = true
                    this.errorVal = {
                        title: 'Error adding new contract',
                        description: e?.error || e?.message || 'Some error occured. Try again later.'
                    }
                }
            }
        },
        async loadData() {
            try {
                this.loading = true
                const docRef = doc(db, "school", this.$route.query.id.toString());
                const school = await getDoc(docRef);
                if (school.exists()) {
                    // console.log(snapshot.data())
                    this.school = { id: school.id, ...school.data() };
                    this.schoolPhone = school.data().phone;
                    this.schoolEmail = school.data().email;
                    this.schoolCode = school.data().code;
                    this.country = school.data().country;
                    this.state = school.data().state;
                    this.city = school.data().city;
                    this.items = school.data().contracts;

                    let q;
                    if (this.tab == 0) {
                        q = query(principles, where("school_id", "==", this.$route.query.id.toString()));
                    }
                    else {
                        q = query(principles, where("school_id", "==", this.$route.query.id.toString()));
                    }
                    const pricilple = await getDocs(q);
                    // console.log(snapshot)
                    const data = [];
                    pricilple.docs.map((e) => {
                        data.push({ id: e.id, ...e.data() });
                    });
                    // console.log(data[0].phone)
                    this.principlePhone = data[0].phone;
                    this.principleName = data[0].name;
                    this.principleEmail = data[0].email;
                }
                this.loading = false
            } catch (e) {
                this.loading = false
                this.error = true
                this.errorVal = {
                    title: 'Error adding new contract',
                    description: e?.error || e?.message || 'Some error occured. Try again later.'
                }
            }
            this.dataLoading = false;
        }
    },
    mounted() {
        this.loadData();
    },
    components: { LoadingDialog, ErrorDialog }
}
</script>