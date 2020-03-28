<template lang="html">

  <section class="map">
    <h1>Map Component</h1>
    <div class="google-map" :id="mapName"></div>
  </section>

</template>

<script lang="js">
import GoogleMapsLoader from '../plugins/googleMaps'
// import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

  export default  {
    name: 'google-map',
    props: [],
    components: {
      // VuetifyGoogleAutocomplete
    },

    data() {
      return {
        colors: {
          primary: 'ff0000'
        },
        mapName: 'google-map',
        google: {},
        googleMap: {},
        defaultMapOptions: {
          // center: {
          //   lat: 53.3549189,
          //   lng: -7.8582014
          // },
          center: {
            lat: 53.4467499,
            lng: -6.1963049
          },
          radius: 2,
          zoom: 7,
          disableDefaultUI: true,
          zoomControl: true
        },
        userAddress: {
          address: {
            street_number: '',
            street_name: '',
            locality: '',
            region: '',
            postal_code: '',
            country: null,
            formatted_address: ''
          },
          coordinate: { latitude: 0, longitude: 0 },
          zoom: 7,
          radius: 2,
          pin: 'default',
          type: 'default'
        },
        radius: 2,
        googleMapIcons: {
          default: ''
        },
      }
    },

    async mounted() {
      this.google = await GoogleMapsLoader()
        .then(response => {
          this.google = response
          this.initMap()
          this.loopLocations()
        })
    },

    methods: {
      initMap() {
        this.googleMapIcons = {
          default:
            'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,' +
            this.colors.primary +
            ',ffffff&color=ff000000?scale=2'
        }
        let element = document.getElementById(this.mapName)
        let options = this.defaultMapOptions
        this.googleMap = new this.google.maps.Map(element, options)
        this.loopLocations()
      },

      loopLocations() {
        let self = this
        let mapCentre = new this.google.maps.LatLng(this.defaultMapOptions.center.lat, this.defaultMapOptions.center.lng)
        let mapCircles = []
        let mapBounds = new this.google.maps.LatLngBounds()
        let mapIcon = self.googleMapIcons.default

        new this.google.maps.Marker({
          map: self.googleMap,
          position: { lat: this.defaultMapOptions.center.lat, lng: this.defaultMapOptions.center.lng },
          icon: mapIcon
        })

        let circleRadius = 0
        circleRadius = parseInt(this.defaultMapOptions.radius) * 1000

        console.log('this.colors.primary', this.colors.primary)

        let newMapCircle = new this.google.maps.Circle({
          strokeColor: '#'+this.colors.primary,
          strokeOpacity: 0.9,
          strokeWeight: 1,
          fillColor: '#'+this.colors.primary,
          fillOpacity: 0.1,
          map: this.googleMap,
          center: { lat: this.defaultMapOptions.center.lat, lng: this.defaultMapOptions.center.lng },
          position: { lat: this.defaultMapOptions.center.lat, lng: this.defaultMapOptions.center.lng },
          radius: circleRadius
        })
        mapCircles.push(newMapCircle)

        if (mapCircles.length > 0) {
          mapCircles.forEach(function(circle) {
            mapBounds.union(circle.getBounds())
          })
          self.googleMap.fitBounds(mapBounds)
        } else {
          mapBounds.extend(mapCentre)
        }
      }
    },

    computed: {}
}


</script>

<style scoped lang="scss">
  .google-map {
    min-height: 70vh;
  }
</style>
