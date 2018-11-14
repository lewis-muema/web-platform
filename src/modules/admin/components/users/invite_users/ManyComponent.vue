<template lang="html">
    <div class="inv-container">
        <div class="row">
            <form class="col s12">
                <div class="row">
                    <div class="input-field col s12">
                        <textarea id="email_area" class="materialize-textarea" autofocus></textarea>
                        <label class="active" for="textarea1">Enter multiple email addresses separated by a
                            comma</label>
                    </div>
                </div>
            </form>
            <div class="side-flex many-flex">
                <div class="column-flex space-right">
                    <button v-on:click="get_inv" class="waves-effect waves-light btn cancel-btn" type="submit"
                            name="action">Cancel
                    </button>
                </div>
                <div class="column-flex">
                    <button v-on:click="inv_many" class="btn waves-effect waves-light blue" type="submit" name="action">
                        Add Invitees
                        <i class="material-icons right">send</i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'many-component',
        components: {},
        computed: {
            ...mapGetters(
                {
                    getState: '$_admin/getViewState'
                }
            )
        },
        methods: {
            ...mapMutations(
                {
                    updateViewState: '$_admin/setViewState',
                    newAdds: '$_admin/newAdds',
                    updateInvites: '$_admin/updateInvites'
                }
            ),
            get_inv: function () {
                this.updateViewState(1);
                // this.$store.commit('updateViewState', 1)
            },
            inv_many: function () {
                var set = $("#email_area").val()
                var emails = set.split(",")

                let number = emails.length
                var data = new Array();
                for (var x = 0; x < number; x++) {
                    // var name = (emails[x].split("@"))[0]
                    // var name_try = name.charAt(0).toUpperCase() + name.slice(1);
                    data[x] = new Array(emails[x], '', '')
                    // console.log(name_try)
                }
                this.newAdds (number)
                this.updateInvites (data)
                this.updateViewState(1);
                // this.$store.commit('updateViewState', 1)
            }
        }
    }
</script>

<style lang="css">
    .many-flex {
        width: 50%;
    }

    .materialize-textarea {
        line-height: normal;
        overflow-y: hidden;
        padding: .8rem 0 .8rem 0;
        resize: none;
        min-height: 3rem;
        box-sizing: border-box;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #9e9e9e;
        border-radius: 0;
        outline: none;
        height: 3rem;
        font-size: 14px;
        width: 100%;
        margin: 0 0 8px 0;
        -webkit-box-shadow: none;
        box-shadow: none;
        -webkit-box-sizing: content-box;
        transition: box-shadow .3s, border .3s, -webkit-box-shadow .3s;
        color: #575757;
    }

    .input-field > label:not(.label-icon).active {
        transform: translateY(-14px) scale(0.8);
        transform-origin: 0 0;
    }

    label {
        display: inline-block;
        margin-bottom: 5px;
    }

    .cancel-btn {
        position: relative;
        cursor: pointer;
        display: inline-block;
        overflow: hidden;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        vertical-align: middle;
        z-index: 1;
        transition: .3s ease-out;
        text-align: center;
        letter-spacing: .5px;
        text-decoration: none;
        font-size: 14px;
        outline: 0;
        border: none;
        border-radius: 2px;
        height: 36px;
        line-height: 36px;
        padding: 0 16px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        -webkit-appearance: button;
        text-transform: uppercase !important;
    }

    .input-field > label {
        color: #9e9e9e;
        position: absolute;
        top: 0;
        font-size: 1rem;
        cursor: text;
        transition: transform .2s ease-out, color .2s ease-out, -webkit-transform .2s ease-out;
        transform-origin: 0% 100%;
        text-align: initial;
        transform: translateY(12px);
    }

    .hiddendiv {
        visibility: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
        padding-top: 1.2rem;
        position: absolute;
        top: 0;
        z-index: -1;
    }
</style>
