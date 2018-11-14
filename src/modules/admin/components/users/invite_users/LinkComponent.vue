<template lang="html">
  <div class="inv-container">
    <div class="up-flex">
      <div class="input-spaced" style="display: none;">
        <select>
          <option value="0" selected>Expires in 7 days</option>
          <option value="1">Expires in 24 hours</option>
          <option value="2">Expires in 30 days</option>
          <option value="3">Never Expires</option>
        </select>
      </div>
      <div class="input-spaced">
        <select class='inpDept' name="dept" id="dept">
        </select>
      </div>
      <div class="side-flex mid-btn">
        <button v-on:click="get_link" class="btn waves-effect waves-light blue" type="submit" name="action">Create Link</button>
        <button v-on:click="get_inv" class="waves-effect waves-light btn cancel-btn" type="submit" name="action">Cancel</button>
      </div>
    </div>
    <div class="side-flex side-desc">
      Anyone can use this link to join {{this.getBizName}} on Sendy
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import axios from 'axios'
import $ from 'jquery'

export default {
  name: 'link-component',
  components: {},
  mounted(){
    this.init_select()
  },
  computed: {
      ...mapGetters(
          {
              getState: '$_admin/getViewState',
              getDepartments: '$_admin/getDepartments',
              getBaseUrl: '$_admin/getBaseUrl',
              getBizName: '$_admin/getBizName'
          }
      )
  },
  methods: {
      ...mapMutations(
          {
              updateViewState: '$_admin/setViewState',
              updateInviteLink: '$_admin/updateInviteLink'
          }
      ),
    get_inv: function (){
        this.updateViewState(1);
      // this.$store.commit('updateViewState', 1)
    },
    init_select: function (){
      var depts = JSON.parse(this.getDepartments)

      // var optionsAsString = "<option value=\"\" disabled selected>Department (Optional)</option>";
      var optionsAsString = "";
      for(var i = 0; i < depts.length; i++) {
        optionsAsString += "<option value='" + depts[i]['department_id'] + "'>" + depts[i]['department_name'] + "</option>";
      }
      $("select[class='inpDept']").find('option').remove().end().append($(optionsAsString));
      $('select').formSelect();
    },
    get_link: function(){
      var url = this.getBaseUrl + 'coporate/inv_link'
      var dept_id = $("#dept").val()

      axios.post(url, {"dept_id":dept_id})
        .then(response => {
            this.updateInviteLink(response.data);
          // this.$store.commit('updateInviteLink', response.data)
        })
        .catch(e => {
          console.dir(e)
        })
        .then(() => {
            this.updateViewState(5);
          // this.$store.commit('updateViewState', 5)
        })
    }
  }
}
</script>

<style lang="css">
.end-btn
{
  justify-content: center;
  align-items: flex-end;
  padding-right: 0px !important;
  flex: .5 !important;
}

.cancel-btn
{
  min-width: 124px;
}

.mid-btn
{
  flex: .5 !important;
  justify-content: space-evenly;
  align-items: center;
}

.input-spaced
{
  margin: 30px 0px 30px 0px;
}

.up-flex
{
  margin: 0 auto;
  width: 70%;
}

.side-desc
{
  font-size: initial;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}
</style>
