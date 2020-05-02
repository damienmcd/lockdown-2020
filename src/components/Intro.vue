<template>
  <v-container xs12>
    <v-row wrap>
      <v-flex xs12 align-center justify-center class="intro-wrapper px-3">
        <h1 class="text-center mb-4">Lockdown Map</h1>
        <v-card class="my-4 pa-4">
          <div class="intro mb-4">
            <p>As we battle against the CoronaVirus the Irish government has released a plan to ease the restrictions currently in place.</p>
            <p>Non-essential travel outside your home is restricted for exercise.</p>
            <p>Below you can enter an address to see the distance from your home on the map.</p>
            <p>The 2km limit is in place until Monday the 4th of May, increasing to 5km on Tuesday the 5th of May. The current plan is to increase this limit to 20km from Monday the 8th of June.</p>
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
