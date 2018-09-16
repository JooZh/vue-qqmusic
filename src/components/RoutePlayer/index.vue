<template>
  <div>
    <div class="playrouter"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'router-player',
  computed: {
    ...mapGetters([
      'playerState',
      'backType'
    ])
  },
  methods: {
    ...mapActions([
      'togglePlayer',
      'playBackType'
    ])
  },
  beforeRouteLeave (to, from, next) {
    if (this.backType === 'ios') {
      this.togglePlayer()
    }
    this.playBackType('ios')

    next()
  }
}
</script>

<style scoped>
  .playrouter{
    position: absolute;
    top: 0;
    left:0;
    right: 0;
    bottom: 0;
    /* background: #ccc; */
  }
</style>
