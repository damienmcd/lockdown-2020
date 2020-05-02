<template>
  <v-container xs12>
    <v-row wrap>
      <v-flex xs12 align-center justify-center class="location-lookup px-3">
        <v-card class="my-4 pt-2">
          <div class="content-center my-4">
            <h3 mb-4>Enter Address</h3>
            <vuetify-google-autocomplete
              name="Enter Address"
              class="mt-2 mb-4"
              autofocus
              clearable
              :disabled="userAddresses.length >= 5"
              placeholder="Enter Address"
              hint="Start entering your address and then select the correct address from the list."
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
            />

            <h3>Select Distance</h3>
            <v-radio-group class="mt-1" v-model="radius">
              <v-radio
                v-for="mapDistance in mapDistances"
                :key="mapDistance.distance"
                :label="`${mapDistance.label}`"
                :value="mapDistance.distance"
                @change="updateRadius(mapDistance.distance)"
              ></v-radio>
            </v-radio-group>

            <div v-show="userAddresses.length" class="mt-0 mb-4 address-list">
              <h3>Addresses</h3>
              <v-card
                xs12
                class="d-flex address-list-item my-2 pa-2 align-center justify-space-between"
                v-for="(userAddressItem, index) in userAddresses"
                :key="userAddressItem.id"
                :id="`user-address-${userAddressItem.id}`"
              >
                {{ userAddressItem.address.formatted_address }}
                <v-spacer></v-spacer>
                <v-btn
                  class="ml-4"
                  icon
                  color="deep-orange"
                  @click="removeAddress(index)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card>
            </div>
          </div>

          <div class="lookup-map my-4">
            <div class="google-map" :id="mapName"></div>
          </div>
        </v-card>
      </v-flex>
    </v-row>
  </v-container>
</template>

<script lang="js">
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

  export default  {
    name: 'google-map',
    props: [],
    components: {
      VuetifyGoogleAutocomplete
    },

    data() {
      return {
        radioGroup: 1,
        mapName: 'google-map',
        googleMap: {},
        mapCentre: {},
        mapBounds: {},
        mapDistances: [{ label: '2km', distance: 2000 }, { label: '5km', distance: 5000 }, { label: '20km', distance: 20000 }],
        markers: [],
        circles: [],
        defaultMapOptions: {
          center: {
            lat: 53.3549189,
            lng: -7.8582014
          },
          zoom: 7,
          disableDefaultUI: true,
          zoomControl: true
        },
        userAddresses: [],
        userAddressTemplate: {
          id: null,
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
        googleMapIcons: [
          'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,212121,ffffff&color=ff000000?scale=2',
          'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,FF9800,ffffff&color=ff000000?scale=2',
          'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,4CAF50,ffffff&color=ff000000?scale=2',
          'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,2196F3,ffffff&color=ff000000?scale=2',
          'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_outline-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/home_pinlet-1-small.png&highlight=ffffff,FF5252,ffffff&color=ff000000?scale=2'
        ],
        googleMapIconColours: [
          '#212121',
          '#FF9800',
          '#4CAF50',
          '#2196F3',
          '#FF5252',
          '#FEE64F'
        ]
      }
    },

    mounted() {
      this.initMap()
    },

    methods: {
      initMap() {
        const self = this
        let element = document.getElementById(this.mapName)
        let options = this.defaultMapOptions
        let infoWindow = null
        this.googleMap = new google.maps.Map(element, options)
        this.mapBounds = new google.maps.LatLngBounds()
        this.mapCentre = new google.maps.LatLng()

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            var currentMapCenter = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }

            this.markers.push(
              new google.maps.Marker({
                map: self.googleMap,
                position: { lat: position.coords.latitude, lng: position.coords.longitude },
                icon: self.googleMapIcons[0]
              })
            )

            this.googleMap.setCenter(currentMapCenter)
            this.googleMap.setZoom(10)

            this.userAddresses.push(
              { "id": "1", "address": { "formatted_address": "Current Location" }, "coordinate": { "latitude": position.coords.latitude, "longitude": position.coords.longitude }, "radius": self.radius, "pin": "default", "type": "default" }
            )

            this.circles.push(
              new google.maps.Circle({
                map: self.googleMap,
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                position: { lat: position.coords.latitude, lng: position.coords.longitude },
                radius: self.radius,
                strokeColor: self.googleMapIconColours[0],
                strokeOpacity: 0.9,
                strokeWeight: 2,
                fillColor: self.googleMapIconColours[5],
                fillOpacity: 0.2,
              })
            )

            if (this.circles.length > 0) {
              this.circles.forEach(function(circle) {
                self.mapBounds.union(circle.getBounds())
              })
              this.googleMap.fitBounds(this.mapBounds)
            } else {
              this.mapBounds.extend(this.mapCentre)
            }
          },
          error => {
            if (error.message === 'User denied Geolocation') {
              this.googleMap.setCenter(this.defaultMapOptions.center)
            }
          })
        }
      },

      handleLocationError(browserHasGeolocation, infoWindow, position) {
        infoWindow.setPosition(position)
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.')
        infoWindow.open(this.googleMap)
      },

      changeAddress(addressData, placeResultData, id) {
        let self = this

        if (!!addressData && !!placeResultData && !!id) {
          let addressIndex = this.userAddresses.findIndex(address => address.id === placeResultData.id)

          if (addressIndex === -1) {
            let newUserAddress = JSON.parse(JSON.stringify(this.userAddressTemplate))

            newUserAddress.id = placeResultData.id
            placeResultData.address_components.forEach(element => {
              if (element.types.indexOf('street_number') > -1) {
                newUserAddress.address.street_number = element.long_name
              }
              if (element.types.indexOf('route') > -1) {
                newUserAddress.address.street_name = element.long_name
              }
              if (element.types.indexOf('locality') > -1) {
                newUserAddress.address.locality = element.long_name
              }
              if (element.types.indexOf('administrative_area_level_1') > -1) {
                newUserAddress.address.region = element.long_name
              }
              if (element.types.indexOf('postal_code') > -1) {
                newUserAddress.address.postal_code = element.long_name
              }
              if (element.types.indexOf('country') > -1) {
                if (!newUserAddress.address.country) {
                  newUserAddress.address.country = {}
                }
                newUserAddress.address.country.name = element.long_name
                newUserAddress.address.country.code = element.short_name
              }
            })

            if (!newUserAddress.coordinate) {
              newUserAddress.coordinate = {}
            }
            newUserAddress.address.formatted_address = placeResultData.formatted_address

            newUserAddress.coordinate.latitude = addressData.latitude
            newUserAddress.coordinate.longitude = addressData.longitude

            this.mapCentre = new google.maps.LatLng(
              newUserAddress.coordinate.latitude,
              newUserAddress.coordinate.longitude
            )

            this.userAddresses.push(newUserAddress)

            if (Object.keys(this.googleMap).length === 0 && this.googleMap.constructor === Object) {
              this.initMap()
            }

            this.googleMap.panTo(this.mapCentre)

            this.markers.push(
              new google.maps.Marker({
                map: self.googleMap,
                position: { lat: newUserAddress.coordinate.latitude, lng: newUserAddress.coordinate.longitude },
                icon: self.googleMapIcons[0]
              })
            )

            this.circles.push(
              new google.maps.Circle({
                map: self.googleMap,
                center: { lat: newUserAddress.coordinate.latitude, lng: newUserAddress.coordinate.longitude },
                position: { lat: newUserAddress.coordinate.latitude, lng: newUserAddress.coordinate.longitude },
                radius: self.radius,
                strokeColor: self.googleMapIconColours[0],
                strokeOpacity: 0.9,
                strokeWeight: 2,
                fillColor: self.googleMapIconColours[0],
                fillOpacity: 0.2,
              })
            )

            if (this.circles.length > 0) {
              this.circles.forEach(function(circle) {
                self.mapBounds.union(circle.getBounds())
              })
              this.googleMap.fitBounds(this.mapBounds)
            } else {
              this.mapBounds.extend(this.mapCentre)
            }

            this.$nextTick(() => {
              this.$refs.enter_address.clear()
            })
          } else {
            alert('Address already selected')
          }
        } else if (!addressData) {
          alert('Please enter a valid address')
        }
      },

      changeAddressNotFound(ref) {
        if (typeof ref === 'object' && 'name' in ref) {
          alert('Address not found')
        }
      },

      removeAddress(index) {
        const self = this

        this.markers[index].setMap(null)
        this.markers[index] = null
        this.markers.splice(index, 1)

        this.circles[index].setMap(null)
        this.circles[index] = null
        this.circles.splice(index, 1)

        this.userAddresses.splice(index, 1)

        this.mapBounds = new google.maps.LatLngBounds()
        if (this.circles.length > 0) {
          this.circles.forEach(function(circle) {
            self.mapBounds.union(circle.getBounds())
          })
          this.googleMap.fitBounds(this.mapBounds)
        } else {
          this.mapBounds.extend(this.mapCentre)
        }

        this.$refs.enter_address.clear()
      },

      updateRadius(newRadius) {
        this.radius = newRadius
        this.updateCircles()
      },

      updateCircles() {
        const self = this
        let newCircles = []

        this.circles.forEach((circle, index) => {
          circle.radius = self.radius

          let newCircle = {
            center: {
              lat: self.userAddresses[index].coordinate.latitude,
              lng: self.userAddresses[index].coordinate.longitude
            }
          }

          newCircles.push(
            new google.maps.Circle({
              map: self.googleMap,
              center: newCircle.center,
              position: newCircle.center,
              radius: self.radius,
              strokeColor: self.googleMapIconColours[0],
              strokeOpacity: 0.9,
              strokeWeight: 2,
              fillColor: self.googleMapIconColours[0],
              fillOpacity: 0.2,
            })
          )

          this.circles[index].setMap(null)
          this.circles[index] = null
        })
        this.circles.length = 0
        this.circles = [...newCircles]

        this.mapBounds = new google.maps.LatLngBounds()
        if (this.circles.length > 0) {
          this.circles.forEach(function(circle) {
            self.mapBounds.union(circle.getBounds())
          })
          this.googleMap.fitBounds(this.mapBounds)
        } else {
          this.mapBounds.extend(this.mapCentre)
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

.content-center {
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
