<template>
  <v-flex xs12>
    <v-layout wrap>
      <v-flex xs12 class="location-targeting">
        <h1>Enter Address</h1>

        <gmap-autocomplete
          @place_changed="changeAddress">
        </gmap-autocomplete>
        <!-- <v-btn @click="addMarker">Add</v-btn> -->

        <gmap-map
          :id="mapName"
          ref="mapRef"
          :center="defaultMapOptions.center"
          :zoom="7"
          style="width:100%;  height: 70vh;"
        >
          <gmap-marker
            :key="index"
            v-for="(marker, index) in markers"
            :position="marker.position"
            @click="center=marker.position"
          ></gmap-marker>
          <gmap-circle
            :key="index"
            v-for="(circle, index) in circles"
            :center="circle.center"
            :radius="circle.radius"
            stroke="#ff0000"
            fill="#ff0000"
            @click="center=circle.position"
          ></gmap-circle>
        </gmap-map>
        <!-- <div class="google-map" :id="mapName"></div> -->
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script lang="js">
import { gmapApi } from 'vue2-google-maps'

  export default  {
    name: 'google-map',
    props: [],
    components: {

    },

    data() {
      return {
        colors: {
          primary: '000000'
        },
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
          radius: 2000,
          zoom: 7,
          pin: 'default',
          type: 'default',
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

    methods: {
      initMap() {
        this.googleMapIcons = {
          default:
            'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,000000,ffffff&color=ff000000?scale=2'
        }
        let element = document.getElementById(this.mapName)
        let options = this.defaultMapOptions
        this.googleMap = new this.google.maps.Map(element, options)
        this.loopLocations()
      },

      loopLocations() {
        let self = this
        let mapIcon = self.googleMapIcons.default

        new this.google.maps.Marker({
          map: self.googleMap,
          position: { lat: this.defaultMapOptions.center.lat, lng: this.defaultMapOptions.center.lng },
          icon: mapIcon
        })
      },

      changeAddress(addressData) {
        console.log('addressData', addressData)
        let self = this
        let mapBounds = new this.google.maps.LatLngBounds()
        let mapCentre = new this.google.maps.LatLng()

        if (addressData) {
          addressData.address_components.forEach(element => {
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
          if (!self.userAddress.coordinate) {
            self.userAddress.coordinate = {}
          }
          self.userAddress.address.formatted_address = addressData.formatted_address

          self.userAddress.coordinate.latitude = addressData.geometry.location.lat()
          self.userAddress.coordinate.longitude = addressData.geometry.location.lng()

          mapCentre = new this.google.maps.LatLng(
            self.userAddress.coordinate.latitude,
            self.userAddress.coordinate.longitude
          )

          self.$refs.mapRef.$mapPromise.then((map) => {
            map.panTo(mapCentre)
          })

          this.markers.length = 0
          this.markers.push(
            new this.google.maps.Marker({
              map: self.$refs.mapRef,
              position: { lat: self.userAddress.coordinate.latitude, lng: self.userAddress.coordinate.longitude },
              icon: self.googleMapIcons.default
            })
          )

          this.circles.length = 0
          const newMapCircle = new this.google.maps.Circle({
            map: self.$refs.mapRef,
            center: { lat: self.userAddress.coordinate.latitude, lng: self.userAddress.coordinate.longitude },
            position: { lat: self.userAddress.coordinate.latitude, lng: self.userAddress.coordinate.longitude },
            radius: this.defaultMapOptions.radius
          })
          this.circles.push(newMapCircle)

          if (this.circles.length > 0) {
            this.circles.forEach(function(circle) {
              mapBounds.union(circle.getBounds())
            })
            this.$refs.mapRef.fitBounds(mapBounds)
          } else {
            mapBounds.extend(mapCentre)
          }
        } else if (!addressData) {
          alert('Please enter a valid address')
        }
      },

      changeAddressNotFound(ref) {
        if (typeof ref === 'object' && 'name' in ref) {
          let onError = function() {
            this.errors.add({
              field: 'User Address',
              msg: 'Address not found.'
            })
          }

          this.validateAddress(ref.name, false, onError)
        }
      }
    },

    computed: {
      google: gmapApi
    }
}


</script>

<style scoped lang="scss">
  .google-map {
    min-height: 70vh;
  }
</style>
