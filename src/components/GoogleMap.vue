<template>
  <v-flex xs12>
    <v-layout wrap>
      <v-flex xs12 align-center justify-center class="location-lookup pa-3">
        <div class="intro mb-4">
          <h1 class="text-center mb-4">Lockdown Map</h1>
          <p>Due to the increase in the number of infections of the COVID-19 Virus, also known as CoronaVirus, the Irish government has implemented new restrictions.</p>
          <p>Non-essential travel outside your home is restricted to a maximum of 2KM for exercise.</p>
          <p>Below you can enter an address to see the recommended limit on the map.</p>
          <p>You can read more about the COVID-19 restrictions on the <a href="https://www2.hse.ie/coronavirus/" target="_blank">HSE</a> website.</p>
        </div>

        <div class="lookup-input my-4">
          <vuetify-google-autocomplete
            name="Enter Address"
            class="mb-2"
            autofocus
            placeholder="Enter Address"
            prepend-icon="mdi-home"
            ref="enter_address"
            id="enter-address-input"
            classname="form-control mb-4"
            label="Enter Address"
            enable-geolocation
            types="geocode"
            @keypress="changeAddress"
            @placechanged="changeAddress"
            @no-results-found="changeAddressNotFound"
            data-vv-delay="100"
            :error="errors.has('Enter Address')"
            :error-messages="errors.collect('Enter Address')"
            data-vv-as="Enter Address"
          >
          </vuetify-google-autocomplete>
        </div>

        <div class="lookup-map my-4">
          <div class="google-map" :id="mapName"></div>
        </div>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script lang="js">
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

  export default  {
    name: 'google-map',
    props: [],
    components: {
      VueGoogleAutocomplete,
      VuetifyGoogleAutocomplete
    },

    data() {
      return {
        mapName: 'google-map',
        googleMap: {},
        markers: [],
        circles: [],
        defaultMapOptions: {
          center: {
            lat: 53.3549189,
            lng: -7.8582014
          },
          // center: {
          //   lat: 53.4467499,
          //   lng: -6.1963049
          // },
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
          radius: 2000,
          pin: 'default',
          type: 'default'
        },
        radius: 2000,
        googleMapIcons: {
          default: ''
        },
      }
    },

    mounted() {
      this.initMap()
    },

    methods: {
      initMap() {
        this.googleMapIcons = {
          default:
            'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,212121,ffffff&color=ff000000?scale=2'
        }
        let element = document.getElementById(this.mapName)
        let options = this.defaultMapOptions
        this.googleMap = new google.maps.Map(element, options)
      },

      changeAddress(addressData, placeResultData, id) {
        let self = this

        this.markers.forEach(marker => {
          marker.setMap(null)
          marker = null
        })

        this.circles.forEach(circle => {
          circle.setMap(null)
          circle = null
        })

        let mapBounds = new google.maps.LatLngBounds()
        let mapCentre = new google.maps.LatLng()

        if (!!addressData && !!placeResultData && !!id) {
          placeResultData.address_components.forEach(element => {
            if (element.types.indexOf('street_number') > -1) {
              self.userAddress.address.street_number = element.long_name
            }
            if (element.types.indexOf('route') > -1) {
              self.userAddress.address.street_name = element.long_name
            }
            if (element.types.indexOf('locality') > -1) {
              self.userAddress.address.locality = element.long_name
            }
            if (element.types.indexOf('administrative_area_level_1') > -1) {
              self.userAddress.address.region = element.long_name
            }
            if (element.types.indexOf('postal_code') > -1) {
              self.userAddress.address.postal_code = element.long_name
            }
            if (element.types.indexOf('country') > -1) {
              if (!self.userAddress.address.country) {
                self.userAddress.address.country = {}
              }
              self.userAddress.address.country.name = element.long_name
              self.userAddress.address.country.code = element.short_name
            }
          })

          if (!this.userAddress.coordinate) {
            this.userAddress.coordinate = {}
          }
          this.userAddress.address.formatted_address = addressData.formatted_address

          this.userAddress.coordinate.latitude = addressData.latitude
          this.userAddress.coordinate.longitude = addressData.longitude

          mapCentre = new google.maps.LatLng(
            self.userAddress.coordinate.latitude,
            self.userAddress.coordinate.longitude
          )

          if (Object.keys(this.googleMap).length === 0 && this.googleMap.constructor === Object) {
            this.initMap()
          }

          this.googleMap.panTo(mapCentre)
          this.markers.length = 0
          this.markers.push(
            new google.maps.Marker({
              map: self.googleMap,
              position: { lat: self.userAddress.coordinate.latitude, lng: self.userAddress.coordinate.longitude },
              icon: self.googleMapIcons.default
            })
          )

          this.circles.length = 0
          const newMapCircle = new google.maps.Circle({
            map: self.googleMap,
            center: { lat: self.userAddress.coordinate.latitude, lng: self.userAddress.coordinate.longitude },
            position: { lat: self.userAddress.coordinate.latitude, lng: self.userAddress.coordinate.longitude },
            radius: self.radius,
            strokeColor: self.$vuetify.theme.themes.light.primary,
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: self.$vuetify.theme.themes.light.primary,
            fillOpacity: 0.2,
          })
          this.circles.push(newMapCircle)

          if (this.circles.length > 0) {
            this.circles.forEach(function(circle) {
              mapBounds.union(circle.getBounds())
            })
            this.googleMap.fitBounds(mapBounds)
          } else {
            mapBounds.extend(mapCentre)
          }
        } else if (!addressData) {
          alert('Please enter a valid address')
        }
      },

      changeAddressNotFound(ref) {
        if (typeof ref === 'object' && 'name' in ref) {
          alert('Address not found')
        }
      }
    }
}


</script>

<style scoped lang="scss">
.location-lookup {
  max-width: 1024px !important;
  margin: 0 auto !important;
}

.lookup-input {
  width: 90%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.input-text {
  min-width: 300px;
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cccccc;
}

.google-map {
  min-height: 70vh;
}
</style>
