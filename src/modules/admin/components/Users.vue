    <template lang="html">
    <div class="">
        <div class="menu">
            <p class="button">
                <a class="button__element"> Add User </a>
                <br> <br>
            </p>
        </div>

    </div>

</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)
export default {
    // components:{Vuetify},
    name:"Users",
    data () {
        return {

        };
    }
}
</script>

<style lang="css">
    /* @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
    @import '~vuetify/dist/vuetify.min.css'; */

    .button{
        float:right;
    }
    .button__element{
        text-transform: uppercase;
        display: inline-block;
        padding: 10px 30px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 3px;
        color: #fff;
        background-color: #1782C5;
        border-color: #357ebd;
        text-decoration: none;
    }
    .menu{
        display: flow-root;
    }

</style>
