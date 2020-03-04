<template lang="html">
  <form
    ref="form"
    class="form-inline"
    @submit.prevent="submitSurvey"
  >
    <div class="nps-footer">
      <div class="nps-header">
        <h3>{{ heading }}</h3>
      </div>
      <div
        v-if="!submitted"
        class="nps-info"
      >
        <div
          v-if="score === null"
          class="tgl-radio-tabs"
        >
          <span class="unlikely">0 Not Likely</span>
          <span
            v-for="(value, index) in scores"
            :key="index"
          >
            <input
              :id="`score_${index}`"
              type="radio"
              class="form-check-input tgl-radio-tab-child"
              name="score"
              @change="onChange($event, value)"
            ><label
              :for="`score_${index}`"
              class="btn btn-default radio-inline"
            >{{ value }}</label>
          </span>
          <span class="likely">10 Very Likely  </span>
          <span
            type="button"
            class="close"
            data-dismiss="modal"
            @click="dismiss()"
          >
            &times;
          </span>
        </div>
        <div v-if="score !== null">
          <div class="form-group">
            <textarea
              id="reason"
              v-model="reason"
              type="text"
              name="reason"
              placeholder="Write your feedback here"
              class="form-control reason-box"
            />
            <button class="btn btn-primary form-control action-button">
              Submit
            </button>
            <span class="clearfix">&nbsp;</span>
            <button class="btn btn-primary form-control action-button reason-dismiss">
              <span
                type="button"
                class="close"
                data-dismiss="modal"
                @click="dismiss()"
              >
                &times;
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import { mapMutations } from 'vuex';
import NpsMixin from '../../mixins/nps_mixin';

export default {
  name: 'NPSFooter',
  mixins: [NpsMixin],
  data() {
    return {
      scores: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      score: null,
      reason: '',
      heading: 'How likely are you to invite a friend or collegue to join Sendy?',
      submitted: false,
    };
  },

  methods: {
    ...mapMutations({
      setNPSStatus: 'setNPSStatus',
    }),
    onChange(event, score) {
      this.score = score;
      this.heading = 'What do you like most about Sendy? (Optional)';
    },
    submitSurvey() {
      console.log('hapa');
      let status = false;
      status = true;
      if (status) {
        this.submitted = true;

        this.heading = 'Thank you. We will use your feedback to improve our service';
        setTimeout(() => {
          this.setNPSStatus(true);
        }, 3000);
      }
    },

  },
};
</script>
<style scoped>
.nps-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
   left: 0;
    /* margin: 0 2%; */
    background-color: #fff;
    color: #555;
    font-size: 13px;
    min-height: 90px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02);
    border-radius: 3px;
  text-align: center;
}
.nps-header {
    width: 100%;
    margin-top: 25px;
}
.nps-info {
    width: 100%;
}
input.tgl-radio-tab-child {
  position: absolute;
  /* left: -99999em; */
  top: -99999em;
  opacity: 1;
  z-index: 1;
}

input.tgl-radio-tab-child+label {
    cursor: pointer;
    border: 1px solid #aaa;
    margin-right: 14px;
    padding: .3em .6em;
    position: relative;
    border-radius: 25px;
}

input.tgl-radio-tab-child+label:hover {
  background-color: #f57f20;
}

[type=radio]:checked+label {
  background-color: #f57f20;
  z-index: 1;
}
.unlikely {
    margin-right: 3em;
    margin-left: 4em;
}
.likely {
    margin-left: 2em;
    margin-right: 4em;
}
.nps-header h3 {
    color: #1782c5;
    font-weight: 500;
    /* margin-top: 30px; */
    /* line-height: 30px; */
}
.close {
    /* font-size: 24px; */
    font-size: 28px;
    border: none;
    cursor: pointer;
    float: none;
}
/* .radio-inline { */
    /* width: 34px;
    height: 34px;
    border-radius: 23px;
    font-size: 20px;
    /* font-weight: 500; */
    /* color: #606266;  */
/* } */
.tgl-radio-tabs {
   margin-bottom: 30px;
}
.reason-box {
    width: 34%;
    height: 52px;
}
.action-button {
    position: absolute;
    width: 5%;
    margin-top: 6px;
    background: #f57f20;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    /* margin-right: 13px; */
    /* padding: 0px; */
    line-height: 30px;
    height: 36px;
}
.clearfix {
     margin-right: 7em;
}
.reason-dismiss {
    background: #ffffff;
    color: #555;
    border: none;
}
.form-group {
    margin-bottom: .3em;
}
</style>
