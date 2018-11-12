<template lang="html">
  <div class="">
    <div class="inv-container">
      <div class="inv-inputs">
        <div class="side-flex error">
          <span id="show_error"></span>
        </div>
        <div class="side-flex inp" id="set0">
          <div class="column-flex pad-flex">
            <input type="text" name="email" value="" placeholder="Email">
          </div>
          <div class="column-flex pad-flex">
            <input type="text" name="name" value="" placeholder="Full Name (Optional)">
          </div>
          <div class="column-flex pad-flex">
            <select class='inpDept' name="dept">
            </select>
          </div>
        </div>
        <div class="side-flex inp" id="set1">
          <div class="column-flex pad-flex">
            <input type="text" name="email" value="" placeholder="Email">
          </div>
          <div class="column-flex pad-flex">
            <input type="text" name="name" value="" placeholder="Full Name (Optional)">
          </div>
          <div class="column-flex pad-flex">
            <select class='inpDept' name="dept">
            </select>
          </div>
        </div>
        <div class="side-flex inp" id="set2">
          <div class="column-flex pad-flex">
            <input type="text" name="email" value="" placeholder="Email">
          </div>
          <div class="column-flex pad-flex">
            <input type="text" name="name" value="" placeholder="Full Name (Optional)">
          </div>
          <div class="column-flex pad-flex">
            <select class='inpDept' name="dept">
            </select>
          </div>
        </div>
      </div>
      <div class="side-flex submit">
        <div class="column-flex pad-flex alleft">
           <div><a v-on:click="add_another" class="add-anchor"><i class="material-icons plus-icon">add_circle_outline</i>Add another</a> <span> or </span> <a v-on:click="invite_many" class="add-anchor" href="#">add many at once</a> </div>
        </div>
        <div class="column-flex pad-flex alright">
          <button v-on:click="postInvites" class="btn waves-effect waves-light blue" type="submit" name="action">Send Invites
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>

      <div class="side-flex">
        <div class="column-flex pad-flex inv-link">
          <div class="flex"><a v-on:click="get_link" class="add-anchor"><i class="material-icons plus-icon">link</i><span>Get an invite link to share</span></a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'invite-component',
  components: {},
  mounted(){
    this.init_select()
    $('.error').hide();

      let number = this.getAdds
      if (number > 3) {
        for (var i = 3; i < number; i++) {
          $( ".inp:eq(1)" ).clone().attr("id","set"+i).appendTo( ".inv-inputs" )
        }
        this.populate()
      }
      else if (number == 3 && this.getInvites!= null) {
        this.populate()
      }
  },
  computed: {
    ...mapGetters(
      [
        'getBizName',
        'getViewState',
        'getDepartments',
        'getAdds',
        'getInvites'
      ]
    )
  },
  methods: {
    populate: function (){
      var set = this.getInvites

      for (var i = 0; i < set.length; i++) {
        $("#set"+i).find("input[name='email']").val(set[i][0])
        $("#set"+i).find("input[name='name']").val(set[i][1])
      }
    },
    get_link: function (){
      this.$store.commit('updateViewState', 2)
    },
    invite_many: function (){
      this.$store.commit('updateViewState', 3)
    },
    init_select: function (){
      var depts = []
      if (this.getDepartments != null) {
        depts = this.getDepartments
        var optionsAsString = "";
        for(var i = 0; i < depts.length; i++) {
          optionsAsString += "<option value='" + depts[i]['department_id'] + "'>" + depts[i]['department_name'] + "</option>";
        }
        $("select[class='inpDept']").find('option').remove().end().append($(optionsAsString));
        $('select').formSelect();
      }
      else {
        var optionsAsString = "<option value=0 disabled>Default Department</option>";
        $("select[class='inpDept']").find('option').remove().end().append($(optionsAsString));
        $('select').formSelect();
      }
    },
    add_another: function () {
    $( ".inp:eq(1)" ).clone().attr("id","set"+(this.getAdds)).appendTo( ".inv-inputs" )
    this.$store.commit('updateAdds', 1)
    // console.log($("#set1").find("input[name='email']").val())
    },
    postInvites: function(){
      let number = this.getAdds
      var data = new Array ( );
      for (var x = 0; x < number; x++) {
        console.log()
        if(this.checkEmpty($("#set"+x).find("input[name='email']").val()))
        {
          this.$store.commit('updateAdds', 2)
        }
        else {
          data[x]= new Array ( $("#set"+x).find("input[name='email']").val(), $("#set"+x).find("input[name='name']").val(), $("#set"+x).find("select[name='dept']").val() )
        }
      }

      if (this.getAdds < 1) {
        this.valid('Please enter at least one valid email address')
        this.$store.commit('newAdds', 3)
      }
      else {
        this.$store.commit('updateInvites', data)
        this.$store.dispatch('postInvites').then(function(){
          this.$store.commit('updateViewState', 4)
        }.bind(this))

      }
    },
    checkEmpty: function(val) {
      if (val == "")
      {
        return true;
      }
      else {
        return false;
      }
    },
    valid: function(string) {
      $('#show_error').text(string)
      $('.error').show("fast")
      setTimeout(function(){
        $('.error').hide("slow")
      }, 5000);

    }
  }
}
</script>

<style lang="css">
.submit
{
  margin-top: 40px;
}
.error
{
  justify-content: center;
}

.inp>.column-flex
{
  align-items: flex-start;
  margin-right: 5px auto;
}

.alright
{
  align-items: flex-end;
}

.or-div
{
  align-items: center;
  justify-content: center;
  font-size: xx-large;
}

.alleft
{
  justify-content: flex-end;
  align-items: flex-start;
}

.inv-link
{
  padding-top: 5%;
}

.flex
{
  display: flex;
}

.alleft>div
{
  display: flex;
  align-items: center;
}

.alleft span
{
  padding-left: 5px;
  padding-right: 5px;
}

.add-anchor
{
  display: flex;
  align-items: center;
}

.add-anchor:hover
{
  text-decoration: none !important;
  border-bottom: 1.5px solid !important;
  margin-bottom: -2px !important;
}

.plus-icon
{
  font-size: 20px !important;
  padding-right: 3px;
}

.select-wrapper
{
  width: 100%;
}

.inv-inputs
{
  margin-top: 30px;
}
</style>
