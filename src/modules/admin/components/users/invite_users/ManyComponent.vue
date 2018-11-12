<template lang="html">
  <div class="inv-container">
    <div class="row">
      <form class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <textarea id="email_area" class="materialize-textarea" autofocus></textarea>
            <label for="textarea1">Enter multiple email addresses separated by a comma</label>
          </div>
        </div>
      </form>
      <div class="side-flex many-flex">
        <div class="column-flex space-right">
          <button v-on:click="get_inv" class="waves-effect waves-light btn cancel-btn" type="submit" name="action">Cancel</button>
        </div>
        <div class="column-flex">
          <button v-on:click="inv_many" class="btn waves-effect waves-light blue" type="submit" name="action">Add Invitees
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'many-component',
  components: {},
  methods: {
    get_inv: function (){
      this.$store.commit('updateViewState', 1)
    },
    inv_many: function() {
      var set = $("#email_area").val()
      var emails = set.split(",")

      let number = emails.length
      var data = new Array ( );
      for (var x = 0; x < number; x++) {
        // var name = (emails[x].split("@"))[0]
        // var name_try = name.charAt(0).toUpperCase() + name.slice(1);
        data[x]= new Array ( emails[x], '' , '' )
        // console.log(name_try)
      }
      this.$store.commit('newAdds', number)
      this.$store.commit('updateInvites', data)
      this.$store.commit('updateViewState', 1)
    }
  }
}
</script>

<style lang="css">
.many-flex
{
  width: 50%;
}
</style>
