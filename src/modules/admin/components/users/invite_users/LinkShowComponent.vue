<template lang="html">
    <div class="inv-container">
        <div class="show-out">
            <div class="show-txt">
                <label class="inviteUser--text">Invite link for {{bizName}}</label>
                <input readonly :value="this.getInviteLink" id="in_link" type="text" class="form-control show--input">
            </div>
            <div class="inviteUser--button">
                <button v-on:click="copy_link" class="button-primary">{{button}}</button>
            </div>
            <div class="inviteUser--button show-button-justify">
                <a v-on:click="back" class="show-link-justify">BACK</a>
            </div>
        </div>
        <div class="show-in">
            Anyone can use this link to join {{this.getBizName}} on Sendy
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: 'link-show-component',
        data() {
            return {
                button: "Copy to clipboard",
                bizName: ""
            }
        },
        mounted() {
            let session = this.$store.getters.getSession;
            if (session.default == 'biz') {
                this.bizName = session[session.default]['cop_name'];
            }
        },

        computed: {
            ...mapGetters(
                {
                    getState: '$_admin/getViewState',
                    getBizName: '$_admin/getBizName',
                    getInviteLink: '$_admin/getInviteLink'
                }
            )
        },
        methods: {
            ...mapMutations(
                {
                    updateViewState: '$_admin/updateViewState'
                }
            ),

            copy_link: function () {
                let copyText = document.getElementById("in_link");
                copyText.select();
                document.execCommand("Copy")
                this.button = "Copied"
            },
            back: function () {
                this.updateViewState(1);
            }
        }
    }
</script>

<style lang="css">
    .inviteUser--text {
        padding: 0 0 15px;
        color: #555;
        font-size: 14px;
    }

    .btn-submit {
        padding: 10px !important;
    }

    .inviteUser--button {
        margin-top: 48px;
        margin-left: 20px;
    }

    .show-txt {
        display: flex;
        flex-direction: column;
        flex: 3;
    }

    .show-out {
        display: flex;
        flex-direction: row;
        padding: 40px;
    }

    .show-in {
        font-size: 14px !important;
        padding: 0px 40px;
        text-align: left;
        color: #555 !important;
    }

    .show--input {
        margin-top: 17px !important;
    }

    .show-button-justify {
        padding-top: 10px !important;
        color: #555 !important;
    }

    .show-link-justify {
        color: #555 !important;
        text-align: right !important;
        padding-top: 10px !important;
    }
</style>
