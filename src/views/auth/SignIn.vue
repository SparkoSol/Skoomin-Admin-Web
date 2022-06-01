<template>
  <div id="background">
    <v-card class="sign-in" elevation="10">
      <!-- <img src="../../assets/logo.png" alt="Logo" class="sign-in__logo"/> -->

      <h1 class="sign-in__title">Authenticate yourself</h1>
      <p class="sign-in__message">
        You need a Skoomin admin account to access the content ahead, if you do not
        have an account or have forgotten your password then you can contact the
        support regarding your issue
      </p>
      <v-form ref="form">
        <v-text-field v-model="username" label="Your Email" outlined :rules="[required(), email()]" />
        <v-text-field v-model="password" :rules="[required('Do not leave this field empty')]" @keypress.enter="signIn"
          label="Your Password" type="password" outlined />

        <v-btn @click="signIn" color="primary" dark elevation="0" width="100%" height="45px">
          Authenticate
          <v-icon small style="margin-left: 5px">mdi-arrow-right</v-icon>
        </v-btn>
      </v-form>
    </v-card>
    <loading-dialog v-model="loading" message="You are being authenticated, Please wait..." />
    <error-dialog v-model="error" :error="errorVal" />
  </div>
</template>

<script>
import { required, email } from '@/utils/validators';
import LoadingDialog from '../../components/LoadingDialog';
import ErrorDialog from '../../components/ErrorDialog';
import { db } from '../../firebase';

import { collection, getDocs, query, where } from "@firebase/firestore";

export default {
  name: 'SignIn',
  components: { ErrorDialog, LoadingDialog },

  data: () => ({
    error: false,
    errorVal: {},
    loading: false,
    username: '',
    password: '',
  }),

  methods: {
    email,
    required,

    async signIn() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          let q
          const ref = collection(db, 'admin_auth')
          q = query(ref, where("email", "==", this.username));
          console.log(q)
          const snapshot = await getDocs(q);
          if (snapshot.docs.length <= 0) {
            this.loading = false
            this.error = true
            this.errorVal = {
              title: 'Error while signing in.',
              description: 'User does not exists'
            }
            console.log('wrong email password')
            return
          }
          snapshot.docs.map((e) => {
            const data = {
              ...e.data()
            }
            if (data.password === this.password) {
              localStorage.setItem('user', JSON.stringify({
                id: e.id,
                ...e.data()
              }))
              this.$router.push('/')
              return
            }
          })

          this.loading = false
          this.error = true
          this.errorVal = {
            title: 'Error while signing in.',
            description: 'Email or password does not match any user.'
          }
        } catch (e) {
          this.loading = false
          this.error = true
          this.errorVal = {
            title: 'Error while signing in.',
            description: e.message || e.error || 'Some error occured. Try again later'
          }
        }
      }
    },
  }
};
</script>

<style lang="sass" scoped>
.sign-in
  width: 448px
  padding: 20px 40px 40px 40px
  background: white
  text-align: center
  border-radius: 8px

  &__header
    display: grid
    grid-column-gap: 20px
    grid-template-columns: calc(30% - 20px) 70%

  &__logo
    width: 40%
    margin-bottom: 20px

  &__title
    color: black
    font-size: 24px
    margin-bottom: 10px
    font-weight: normal
    font-family: google-sans, sans-serif

  &__message
    font-size: 13px
    margin-bottom: 40px


#background
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background: #f8f3ef

</style>

<style>
html {
  overflow-y: auto;
}
</style>
