<template lang="html">
  <div class="">
    <div class="free-delivery-container">
      <div class="section">
        <router-link
          class="section__link"
          to="/user/free-deliveries"
        >
         {{ $t('general.free_delivery') }}
        </router-link>
      </div>
      <div class="free-deliveries--background">
        <div class="free-delivery--intro">
          <div class="free-delivery--title1">
            {{ $t('general.get_free_deliveries') }}
          </div>
          <div class="free-delivery--text">
            <p>
              {{ $t('general.send_a_friend_free_delivery') }}
              <a href="">
               {{ $t('general.more_details') }}
              </a>
            </p>
            <p class="free-text--hidden">
             {{ $t('general.invite_a_friend') }}
            </p>
            <p>{{ $t('general.share_link_below') }}</p>
          </div>
        </div>
        <div class="free-deliveries--inner">
          <div class="show-txt">
            <input
              readonly
              :value="getInviteLink"
              type="text"
              class="my_field_section delivery-link"
            >
            <div class="deliver--copy-link">
              <div class="share_img1">
                <font-awesome-icon icon="star" />
              </div>
              <div class="custom_copy">
                {{ $t('general.copy') }}
              </div>
            </div>
          </div>
          <div
            style="display: table"
            class="free-delivery--social"
          >
            <div class="free-display">
              <div
                style="display: inline-block"
                class="custom_mail"
              >
                {{ $t('general.mail') }}
              </div>
              <div class="share_img" />
            </div>
            <div class="free-display">
              <div
                style="display: inline-block"
                class="custom_fb"
              >
                {{ $t('general.share') }}
              </div>
              <div class="share_img3" />
            </div>
            <div class="free-display">
              <div class="custom_tw">
                {{ $t('general.tweet') }}
              </div>
              <div class="share_img2" />
            </div>
          </div>
        </div>
        <div class="separing-line">
          <hr>
        </div>
        <div class="free-delivery--stats">
          <div class="free-delivery--text">
            {{ $t('general.refferal_stats') }}
          </div>
          <div class="stats">
            <span>
              6600 <br>
              {{ $t('general.credit_earned') }}
            </span>
            <span>
              1 <br>
              {{ $t('general.friend_referred') }}
            </span>
            <span>
              1 <br>
               {{ $t('general.friends_joined') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FreeDeliveries',
  data() {
    return {
      show_more: false,
    };
  },
  methods: {
    myFilter() {
      this.isActive = !this.isActive;
      // some code to filter users
    },
  },
};
</script>

<style lang="css">
.free-delivery-container {
    margin: 0 100px 8px 100px !important;
    padding-top: 60px;
}
.free-text--hidden{
    display: none;
}
.free-display{
    display: table-cell
}
.free-deliveries--background {
    width: 100%;
    height: 270px;
    background-color: #fff;
}

.free-deliveries--inner {
    width: 1000px;
    margin-top: 20px;
    height: 230px;
    background-color: transparent;
    margin-left: 18%;
    position: absolute;
}

.separing-line {
    color: #dcdfe6;
    margin-top: 180px;
}

.show-txt {
    width: 100%;
    margin: 0px auto;
    height: 65px;
    display: table;
    box-sizing: border-box;
    text-align: center;
    color: #595d62 !important;
}

.btn-submit {
    padding: 11px !important;
    width: 200px !important;
}

.free-delivery--button {
    display: inline-block;
    margin: 10px;
    margin-left: -37px;
}

.free-delivery--title1 {
    color: #333;
    font-size: 15px;
    padding-top: 15px;
}

.share_img {
    float: left;
    background-color: #CCC;
    background-image: url(https://images.sendyit.com/web_platform/social/white_social/email_50.png);
    width: 20px;
    height: 20px;
    padding: 12px;
    display: inline-block;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background-position: center;
    background-size: 30px;
    background-repeat: no-repeat;
}

.share_img1 {
    float: left;
    background-color: #CCC;
    background-image: url(https://images.sendyit.com/web_platform/social/white_social/link_50.png);
    width: 20px;
    height: 20px;
    padding: 12px;
    display: inline-block;
    background-position: center;
    background-size: 30px;
    background-repeat: no-repeat;
}

.custom_mail {
    color: #FFF;
    background-color: #666;
    padding: 12px;
    margin-right: 30px;
    text-align: center;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    width: 149px;
    height: 20px;
    display: inline-block;
    margin-left: 0;
}

.share_img2 {
    float: left;
    background-color: rgba(0, 172, 237, 0.77);
    background-image: url(https://images.sendyit.com/web_platform/social/white_social/twitter_50.png);
    width: 20px;
    height: 20px;
    padding: 12px;
    display: inline-block;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background-position: center;
    background-size: 30px;
    background-repeat: no-repeat;
}

.custom_fb {
    color: #FFF;
    background-color: #3B5998;
    padding: 12px;
    text-align: center;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    width: 149px;
    height: 20px;
    margin-right: 30px;
    display: inline-block;
    margin-left: 0;
}

.share_img3 {
    float: left;
    background-color: rgba(59, 89, 152, 0.77);
    background-image: url(https://images.sendyit.com/web_platform/social/white_social/facebook_50.png);
    width: 20px;
    height: 20px;
    padding: 12px;
    display: inline-block;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background-position: center;
    background-size: 30px;
    background-repeat: no-repeat;
}

.custom_tw {
    color: #FFF;
    background-color: #00aced;
    padding: 12px;
    text-align: center;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    width: 149px;
    height: 20px;
    margin-right: 0px;
    display: inline-block;
    margin-left: 0;
}

.custom_copy {
    display: inline-block;
    width: 149px;
    color: #FFF;
    background-color: #666;
    padding: 12px;
    text-align: center;
    height: 20px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    float: left;
}

.delivery-link {
    display: table-cell;
}

.free-delivery--text {
    font-size: 14px;
    padding-top: 15px;
    line-height: 1.6;
    text-align: center;
    font-family: 'Nunito', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #555;
}

.my_field_section {
    width: 470px;
    float: left;
    padding: 11px;
    height: 20px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    border: 1px solid #CCC;
}

.free-delivery--social {
    height: 80px;
    margin-bottom: 10px;
    margin-top: 20px
}

.free-delivery--stats {
    margin: 34px;
    height: 80px;
    margin-top: 0px;
    text-align: center;
    width: 50%;
    background-color: white;
    margin-left: 18%;
    position: absolute;
}

.free-delivery--intro {
    height: 120px;
    text-align: center;
    width: 58%;
    margin-left: 21%;
}

.deliver--copy-link {
    display: table-cell;
    float: left;
}

.tweet-button {
    /*margin-right: 0px !important;*/
}

div.stats {
    padding-top: 25px;
    display: table;
    width: 100%;
}

div.stats span {
    display: table-cell;
    text-align: center;
}
</style>
