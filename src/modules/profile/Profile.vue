<template lang="html">
  <div class="" id="auth_container">
      <main-header></main-header>
      <div class="my-profile">
        <div class="my-profile__menu">
          Profile
          <div class="my-profile__menu__balance">
            Balance KES
          </div>
        </div>
        <div class="my-profile__inner__menu">
         <router-link to="" class="my-profile__inner__menu__link my-profile__inner__menu__selected"> My Account</router-link>
        </div>

 <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="40%"><div class="my-profile__main__header__2">Personal Information</div></td>
    <td width="10%">&nbsp;</td>
    <td width="40%"><div class="my-profile__main__header__2">Account Information</div></td>
  </tr>
   <tr>
    <td valign="top">

    <p>
      <label class="input-descript">
        <span>Name</span>
      </label>
      <input type="text" name="name" id="name" value="" class="form-control dimen" />
    </p>
    <p>
      <label class="input-descript">
        <span>Email</span>
      </label>
      <input type="text" name="email" id="email" value="" class="form-control dimen" />
    </p>
    <p>
      <label class="input-descript">
        <span>Phone</span>
      </label>
      <input type="text" name="phone" id="phone" value="" class="form-control dimen" />
    </p>
    <p>
      <br />
      <input type="submit" class="btn-submit" id="save_personal" value="Save Personal Info" />
    </p>


    </td>
    <td>&nbsp;</td>
    <td valign="top" class="pass_change_col">

     <form action="" method="post">
    <p>
      <label class="input-descript">
        <span>Old Password</span>
      </label>
      <input name="old_pass" type="password" placeholder="Enter Old Password" class="form-control dimen" />
    </p>

     <p>
       <label class="input-descript">
         <span>New Password</span>
       </label>
    <input type="password" name="new_pass" placeholder="Enter New Password"   class="form-control dimen" />
    </p>
     <p>
       <label class="input-descript">
         <span>Confirm Password</span>
       </label>
          <input type="password" name="con_pass"  placeholder="Confirm new password" class="form-control dimen" />
    </p>
     <p><br /> <input type="submit" class="my-profile__btn" value="Save New Password"  /></p>
     </form>
     </td>
  </tr>
</table>

   <div class="">
      <router-view></router-view>
  </div>
 </div>
  </div>
</template>

<script>
import profile_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'

export default {
  name:'Profile',
  mixins: [ RegisterStoreModule ],
  components : {MainHeader},
  created() {
    const STORE_KEY = '$_profile';
    this.register_store_module(STORE_KEY, profile_store);
  },
}
</script>

<style lang="css">
.my-profile{
  padding-top: 45px;
  width: 90%;
  margin: 0px auto;
}
.my-profile__menu{
  font-size: 22px;
  padding-bottom: 0px;
  border-bottom: 1px solid #ccc;
  color: #999;
  padding-top: 15px;
  margin-bottom: 30px;
}
.my-profile__menu__balance{
  float: right;
  font-size: 14px;
  color: #1782C5;
}
.my-profile__inner__menu{
  margin-bottom: 50px;
  border-bottom: 1px solid #1782c5;
  padding-bottom: 2px;
}
.my-profile__inner__menu__link{
  color: #1782c5;
  text-transform: uppercase;
  text-align: center;
  padding: 2px 25px;
  font-size: 15px;
}
.my-profile__inner__menu__selected{
  font-weight: 500;
  border-bottom: 3px solid #1782c5;
  text-decoration: none;
}
.my-profile__main__header__2{
  font-size: 16px;
  padding-bottom: 3px;
  border-bottom: 1px solid #ccc;
  text-transform: uppercase;
  color: #999;
}
.my-profile__input{
  background-color: transparent;
  border: 0px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  width: 300px;
  margin-top: 9px;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: #575757;
}
.my-profile__phone_input{
  height: 50px;
  display: flex;
  margin: 0 0 10px;
}
.my-profile__btn{
  font-size:14px;
  width:320px;
  -webkit-appearance: button;
  cursor: pointer;
  padding: 10px 16px;
  line-height: 1.33;
  border-radius: 3px;
  color: #fff;
  background-color: #1782C5;
  border-color: #357ebd;
  display: inline-block;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  text-transform: uppercase;
}
.input-descript{
  margin: 0 0 .25rem;
 display: block;
 font-size: 1rem;
 line-height: 1.5rem;
 font-weight: 400!important;
 margin-bottom: .5rem!important;
}
.dimen{
  width: 65% !important;
}
.input-descript{
  margin: 0 0 .25rem;
 display: block;
 font-size: 1rem;
 line-height: 1.5rem;
 font-weight: 400!important;
 margin-bottom: .5rem!important;
}


</style>
