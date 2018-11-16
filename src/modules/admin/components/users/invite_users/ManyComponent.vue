<template lang="html">
    <div class="inv-container">
        <div class="row many--row">
            <form class="col s12">
                <div class="row textarea--row">
                    <div class="input-field col s12 inviteMany--textarea">
                        <textarea id="email_area" class="inviteMany--textareabox"></textarea>
                        <label class="active inviteMany--text">Enter multiple email addresses separated by a
                            comma</label>
                    </div>
                </div>
            </form>
            <div class="side-flex many-flex">
                <div class="column-flex space-right">
                    <button v-on:click="get_inv" class="btn-submit btn-cancel" type="submit"
                            name="action">Cancel
                    </button>
                </div>
                <div class="column-flex">
                    <button v-on:click="inv_many" class="btn-submit" type="submit" name="action">
                        Add Invitees
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
                this.newAdds(number)
                this.updateInvites(data)
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

    .inviteMany--text {
        font-size: 14px;
        color: #9e9e9e;
    }

    .many--row {
        width: 100% !important;
        display: inline !important;
    }

    .btn-cancel {
        background-color: transparent !important;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2) !important;
        color: #333 !important;
        border: none !important;
        width: 200px!important;
    }

    .btn-submit {
        font-size: 14px !important;
        width: 200px!important;
    }

    .inviteMany--textarea {
        width: 100% !important;
        height: 120px!important;
    }
    .inviteMany--textareabox {
        width: 100% !important;
        height: 120px!important;
        border: 1px solid #dcdfe6 !important;
        border-radius: 4px !important;
    }
    .inviteMany--textareabox:focus{
        border: 1px solid #1782c5 !important;
        -webkit-box-shadow: none !important;
        outline:none;
        box-shadow: none !important;
    }
    .textarea--row{
        margin-bottom: 50px !important;
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
