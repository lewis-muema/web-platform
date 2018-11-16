<template lang="html">
  <div class="content">
    <no-ssr placeholder="">
      <GmapMap :center="{lat:-1.3084143, lng:36.7658132}" :zoom="13" map-type-id="roadmap" class="content" :options="mapOptions">
        <gmap-marker v-for="m in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position"></gmap-marker>
      </GmapMap>
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters } from 'vuex';

export default {
  name: 'map-component',
  components: {
    'no-ssr': NoSSR
  },
  data: function () {
    return {
      mapOptions: {
        disableDefaultUI : true,
      },
    }
  },
  computed: {
    ...mapGetters({
      markers: '$_orders/get_markers'
    }),
  },
  mounted() {
    var clientId = 'mqttjs_wp_' + Math.random().toString(16).substr(2, 8) + '_' +Math.random() +'_'+ new Date().getTime()
    var host = 'wss://chat.sendyit.com:443'
    var options = {
      keepalive: 10,
      clientId: clientId,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
      username: 'sendy',
      password: '93a3a43dbac9ddd362702fb525b42a2d',
      rejectUnauthorized: false
    }
    var client = this.mqtt.connect(host, options)

    client.on('error', function (err) {
      console.log(err)
      client.end()
    })

    client.on('connect', function () {
      console.log('client connected:' + clientId)
    })

    client.subscribe('partner_app_positions/#', { qos: 0 })

    // client.publish('topic', 'wss secure connection demo...!', { qos: 0, retain: false })

    client.on('message', function (topic, message, packet) {
      // console.log(message.toString() + '\nOn topic:= ' + topic)
      console.dir(JSON.parse(message.toString()));
      datae['time']=new Date();
      if(wildest_markers.check_if_busy(datae)){
          delete_em(datae);
      }
      else{
          try{
              update_riders_location(reformat_data(datae));
          }
          catch(er){
              console.log('dependencies not yet loaded');
          }
      }
    })
  }
}
</script>

<style lang="css">
</style>
