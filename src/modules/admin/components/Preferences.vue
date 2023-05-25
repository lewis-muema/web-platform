<template lang="html">
  <div class="preferences">
    <div class="preferences__item">
      <div class="card">
        <div class="card__image">
          <span class="card__image--title">{{ $t('preferences.branch') }}</span>
        </div>
        <div class="card__content">
          <p class="card__paragraph">
            {{$t('preferences.group_staff')}}
          </p>
        </div>
        <div class="card__action">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
    <div class="preferences__item">
      <div class="card">
        <div class="card__image">
          <span class="card__image--title card__image--bg">{{ $t('preferences.ecommerce') }}</span>
        </div>
        <div class="card__content">
          <p class="card__paragraph">
            {{ $t('preferences.make_bulk_order') }}
          </p>
        </div>
        <div class="card__action">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
    <div class="preferences__item">
      <div class="card">
        <div class="card__image">
          <span class="card__image--title card__image--bg">{{$t('preferences.order_history')}}</span>
        </div>
        <div class="card__content">
          <p class="card__paragraph">
            {{ $t('preferences.view_extra_detail') }}
          </p>
        </div>
        <div class="card__action">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
    <div class="preferences__item">
      <div class="card">
        <div class="card__image">
          <span class="card__image--title">{{$t('preferences.order_breakdown')}}</span>
        </div>
        <div class="card__content">
          <p class="card__paragraph">
            {{$t('preferences.pick_through')}}
          </p>
        </div>
        <div class="card__action">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
    <div class="preferences__item">
      <div class="card">
        <div class="card__image">
          <span class="card__image--title">{{$t('preferences.insuarence')}}</span>
        </div>
        <div class="card__content">
          <p class="card__paragraph">
            {{$t('preferences.third_party')}}
          </p>
        </div>
        <div class="card__action">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
    <div class="preferences__item">
      <div class="card">
        <div class="card__image">
          <span class="card__image--title">{{$t('preferences.sms_password')}} </span>
        </div>
        <div class="card__content">
          <p class="card__paragraph">
            {{$t('preferences.recieve_password')}}
          </p>
        </div>
        <div class="card__action">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
    <div class="preferences__item">
      <div class="card">
        <div class="card__image">
            <span class="card__image--title">{{$t('preferences.delivery_picture')}} </span>
        </div>
        <div class="card__content">
          <p class="card__paragraph">
            {{$t('preferences.delivery_request')}}
          </p>
        </div>
        <div class="card__action">
          <label class="switch">
            <input type="checkbox">
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preferences',
};
</script>

<style lang="css">
.preferences{
    display: flex;
    flex-wrap: wrap;
    flex-basis: auto;
    justify-content: space-between;
    margin-right: 60px;
}
.preferences__item{
    width: 30%;
    align-content: space-around;
    padding-bottom: 1rem;
}
.card{
    position: relative;
    margin: 20px 0 1rem 0;
    background-color: #fff;
    transition: box-shadow .25s;
    border-radius: 2px;
    /* box-shadow: 1px 1px 0 0 rgba(0,0,0,0.16), 1px 1px 0 0 rgba(0,0,0,0.12); */
    box-shadow: none;
    border-left: 1px solid rgba(94, 94, 99, 0.11);
    border-top: 1px solid rgba(94, 94, 99, 0.11);
    border-right: 1px solid rgba(94, 94, 99, 0.11);
    border-bottom: 1px solid rgba(94, 94, 99, 0.11);
    /* border: 1px solid #626263; */
    min-height: 206px;
}
.card__paragraph{
    font-size: 14px;
    font-family: 'Nunito', sans-serif;
    color: #606266;
    font-weight: 300;
}
.image{
    display: block;
    border-radius: 2px 2px 0 0;
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
}
.card__image{
    position: relative;
    font-size: 20px;
    height: 60px;
}
.card__image--title{
    font-size: 18px;
    text-transform: uppercase;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 20px;
    color: #606266 !important;
    text-transform: capitalize !important;
    text-align: center;
    text-decoration: none;
    font-family: 'Nunito', sans-serif;

}
.card__content{
    padding: 20px;
    border-radius: 0 0 2px 2px;
    /* max-height: 83px; */
    max-height: 45px;
    color: #9e9e9e;
}
.card__action{
    border-top: 1px solid rgba(160,160,160,0.2);
    padding: 20px;
    border-style: none;
    text-align: center;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #1782C5;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1782C5;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
