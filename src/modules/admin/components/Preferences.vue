<template lang="html">
    <div class="preferences">
        <div class="preferences__item">
            <div class="card">
                <div class="card__image">
                    <img src="https://app.sendyit.com/biz/image/grey_strip1.png" class="image"><span class="card__image--title">Branch</span>
                </div>
                <div class="card__content">
                    <p class="card__paragraph">Group your staff and orders into branches and view reporting at branch level.</p>
                </div>
                <div class="card__action">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
        </div>
        <div class="preferences__item">
            <div class="card">
                <div class="card__image">
                    <img src="https://app.sendyit.com/biz/image/grey_strip1.png" class="image"><span class="card__image--title">Branch</span>
                </div>
                <div class="card__content">
                    <p class="card__paragraph">Group your staff and orders into branches and view reporting at branch level.</p>
                </div>
                <div class="card__action">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
        </div>
        <div class="preferences__item">
            <div class="card">
                <div class="card__image">
                    <img src="https://app.sendyit.com/biz/image/grey_strip1.png" class="image"><span class="card__image--title">Branch</span>
                </div>
                <div class="card__content">
                    <p class="card__paragraph">Group your staff and orders into branches and view reporting at branch level.</p>
                </div>
                <div class="card__action">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
        </div>
        <div class="preferences__item">
            <div class="card">
                <div class="card__image">
                    <img src="https://app.sendyit.com/biz/image/grey_strip1.png" class="image"><span class="card__image--title">Branch</span>
                </div>
                <div class="card__content">
                    <p class="card__paragraph">Group your staff and orders into branches and view reporting at branch level.</p>
                </div>
                <div class="card__action">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Preferences",
}
</script>

<style lang="css">
    .preferences{
        display: flex;
        flex-wrap: wrap;
        flex-basis: auto;
        justify-content: space-evenly;
    }
    .preferences__item{
        width: 28%;
        align-content: space-around;
        padding-bottom: 2rem;
    }
    .card{
        position: relative;
        margin: 0.5rem 0 1rem 0;
        background-color: #fff;
        transition: box-shadow .25s;
        border-radius: 2px;
        /* box-shadow: 1px 1px 0 0 rgba(0,0,0,0.16), 1px 1px 0 0 rgba(0,0,0,0.12); */
        box-shadow: none;
        border-left: 1px solid rgba(94, 94, 99, 0.11);
        border-right: 1px solid rgba(94, 94, 99, 0.11);
        border-bottom: 1px solid rgba(94, 94, 99, 0.11);
        /* border: 1px solid #626263; */
        min-height: 206px;
    }
    .card__paragraph{
        font-size: 14px;
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
        font-weight: 500;
        text-transform: uppercase;
        color: rgba(51, 51, 51, 0.7);
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 20px;
    }
    .card__content{
        padding: 20px;
        border-radius: 0 0 2px 2px;
        max-height: 83px;
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
      background-color: #1782c5;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #1782c5;
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
