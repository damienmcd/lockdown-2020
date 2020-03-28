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
    name: 'map',
    props: [],
    components: {
      // VuetifyGoogleAutocomplete
    },

    data() {
      return {
        colours: {
          primary: '#ff0000'
        },
        mapName: 'google-map',
        googleMap: {},
        defaultMapOptions: {
          center: {
            lat: -10.3415505,
            lng: 53.3623867
          },
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
          radius: { radius: 2, measurement_unit: 'km' },
          pin: 'default',
          type: 'default'
        },
        radius: 2,
        googleMapIcons: {
          default:
            'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,' +
            this.colors.primary +
            ',ffffff&color=ff000000?scale=2'
        },
      }
    },

    async beforeMount() {
      await GoogleMapsLoader()
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
        this.googleMap = new google.maps.Map(element, options)
        this.loopLocations()
      },

      loopLocations() {
        let self = this
        let mapCentre = new google.maps.LatLng(this.defaultMapOptions.center.lat, this.defaultMapOptions.center.lng)
        let mapCircles = []
        let mapBounds = new google.maps.LatLngBounds()
        let mapIcon = self.googleMapIcons.default

        new google.maps.Marker({
          map: self.googleMap,
          position: { lat: location.coordinate.latitude, lng: location.coordinate.longitude },
          icon: mapIcon
        })

        let circleRadius = 0
        circleRadius = parseInt(location.radius.radius) * 1000

        let newMapCircle = new google.maps.Circle({
          strokeColor: self.colors.primary,
          strokeOpacity: 0.9,
          strokeWeight: 1,
          fillColor: self.colors.primary,
          fillOpacity: 0.2,
          map: self.googleMap,
          center: { lat: location.coordinate.latitude, lng: location.coordinate.longitude },
          position: { lat: location.coordinate.latitude, lng: location.coordinate.longitude },
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
  .map {

  }
</style>
