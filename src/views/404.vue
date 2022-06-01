<template>
  <v-app dark>
    <div class="error-main">
      <div class="error-bg"></div>
      <v-card class="pa-8 error-card">
        <div>
          <h1>Oh snap!</h1>
          <h2 class="mb-3 primary--text">Looks like you got lost.</h2>
          <p>We can't seem to find the page you are looking for.</p>
        </div>
        <v-btn elevation="0" color="primary" to="/">
          Return to home
        </v-btn>
      </v-card>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>

.error-main {
  position: relative;
  width: 100%;
  height: 100vh;
}

.error-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.error-bg {
  background-color: #e5e5f7;
  opacity: 0.5;
  background-image:  repeating-linear-gradient(45deg, #99265f 25%, transparent 25%, transparent 75%, #99265f 75%, #99265f), repeating-linear-gradient(45deg, #99265f 25%, #e5e5f7 25%, #e5e5f7 75%, #99265f 75%, #99265f);
  background-position: 0 0, 40px 40px;
  background-size: 80px 80px;
  background-repeat: repeat;
}

.error-bg > * {
  opacity: 1 !important;
}

.error-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 90%;
  max-width: 700px;
}

@media screen and (min-width: 550px) {
  .error-card {
    width: 50%;
    height: 250px;
  }
}
</style>
