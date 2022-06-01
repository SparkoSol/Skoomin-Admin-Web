<template>
  <div>
    <v-app-bar app dark color="primary" elevation="0">
      <!-- <v-app-bar-nav-icon @click="drawer = !drawer" /> -->

      <v-card-title>Skoomin Admin</v-card-title>
      <v-spacer />

      <profile-popup />
    </v-app-bar>
    <v-main class="main-bg">
      <v-container>
        <router-view />
      </v-container>
    </v-main>

  </div>
</template>

<script>
import ProfilePopup from "./ProfilePopup";
import { getUser } from "@/utils/local";
import { required } from "@/utils/validators";

export default {
  name: 'Dashboard',
  components: { ProfilePopup },
  data: () => ({
    drawer: true,
    user: {},
    message: null,
    loading: true,
  }),
  methods: {
    getUser,
    required,
  },

};
</script>

<style lang="sass" scoped>
.logo
  display: block
  margin: 5px auto
  border-radius: 10px

.route
  margin: 5px
  text-align: left
  overflow: hidden
  border-radius: 4px
  font-size: 20px !important
  font-family: "Roboto", sans-serif

  i
    font-size: 20px

  &--active i
    color: inherit

  &--active
    color: #99265f

.main-bg
  background: linear-gradient(to bottom, #77A500 300px, white 300px)

</style>
