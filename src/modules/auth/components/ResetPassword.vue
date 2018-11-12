<template lang="html">
  <div class="log_cont">

<!-- <div align="center" style="margin-bottom:0px;"><img src="https://app.sendyit.com/biz/image/logo.png" height="60px;"  style="margin-bottom:10px;" />  </div> -->
<div class="change_cont" id="change_con">

  <div class="log-item " id="forgot_pass" >

<p>&nbsp;</p>
  <p style="font-size:17px;"> Enter new password </p>
  <p style="color:#F90; height:20px;" id="pass_change_info"></p>
  <div style=" margin:0px auto; ">
  <form method="post" action="" class="form">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">

  <tr>
    <td align="center">
    <input class="form__input form__longyy"  placeholder="New Password" type="password" id="forgot_email" name="new_pass" /></td>
  </tr>
  <tr>
    <td align="center">
    <input class="form__input form__longyy"  placeholder="Confirm New Password" type="password" id="forgot_email" name="con_pass" />
    </td>
  </tr>

  <tr>
    <td align="center"><input type="submit" class="btn btn-primary" style="  font-size:14px;  width:310px; margin-top:10px;" value="Change Password"  /></td>
  </tr>
</table>

  </form>
  </div>
  <p>&nbsp;</p>
<p> </p>
<p>&nbsp;</p>
</div>

</div>

</div>

</template>

<script>
export default {
}
</script>

<style lang="css">
.log-item {
    text-align: center;
    border: 0px solid #CCC;
    margin: 5px;
}
.form__longyy {
    max-width: 300px !important;
    margin-top: 5px !important;
    margin-bottom: 15px !important;
    margin-left: 0px;
    margin-right: 0px;
    width: 300px;
    height: 30px;
    font-size: 13px;
}
.form__input {
    padding: 5px;
    display: block;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.btn {
    display: inline-block;
    padding: 10px 30px;
    margin-bottom: 0;
    font-weight: normal;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
}
.btn-primary {
    color: #fff;
    background-color: #1782C5;
    border-color: #357ebd;
}
</style>
