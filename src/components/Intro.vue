<template>
  <v-container xs12>
    <v-row wrap>
      <v-flex xs12 align-center justify-center class="intro-wrapper">
        <h1 class="text-center mb-4">Lockdown Map</h1>
        <v-card class="my-4 pa-4">
          <div class="intro mb-4">
            <p>Due to the increase in the number of infections of the COVID-19 Virus, also known as CoronaVirus, the Irish government has implemented new restrictions.</p>
            <p>Non-essential travel outside your home is restricted to a maximum of 2KM for exercise.</p>
            <p>Below you can enter an address to see the recommended limit on the map.</p>
            <p>You can read more about the COVID-19 restrictions on the <a href="https://www2.hse.ie/coronavirus/" target="_blank">HSE</a> website.</p>
          </div>
        </v-card>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script lang="js">
  export default  {
    name: 'intro',

    data() {
      return {}
    }
}


</script>

<style scoped lang="scss">
.intro-wrapper {
  max-width: 1024px !important;
  margin: 0 auto !important;
}
</style>
