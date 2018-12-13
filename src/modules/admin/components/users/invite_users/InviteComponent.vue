<template lang="html">
    <div class="">
        <div class="inv-container inv-justify">
            <div class="inv-inputs">
                <div v-for="element in elements" class="side-flex inp">
                    <input class="form-control" type="text" v-model="element.email" name="email"
                           placeholder="name@example.com">
                    <input class="form-control" type="text" v-model="element.name" name="name"
                           placeholder="Full Name (Optional)">
                    <el-select class="addUser--select" v-model="element.department" placeholder="Department">
                        <el-option v-for="department in departments" :key="department.department_id"
                                   :label="department.department_name" :value="department.department_id">
                        </el-option>
                    </el-select>
                </div>

            </div>
        </div>
        <div class="side-flex add-user-submit">
            <div class="column-flex pad-flex alleft">
                <div class="addUser--link"><a v-on:click="addElement" class="add-anchor"><i
                        class="el-icon-circle-plus-outline"></i>&nbsp;Add
                    another</a> <span> or </span> <a v-on:click="invite_many" class="add-anchor" href="#">add many
                    at once</a></div>
            </div>
            <div class="addUser--submit">
                <button v-on:click="postInvites" class="button-primary" type="submit"
                        name="action">{{button}}
                </button>
            </div>
        </div>

        <div class="side-flex add-user-submit">
            <div class="column-flex pad-flex inv-link">
                <div class="flex"><a v-on:click="getInviteLink" class="add-anchor inviteMany--anchor"><i
                        class="el-icon-share"></i><span>&nbsp;Get an invite link to share</span></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';

    export default {
        name: 'invite-component',
        components: {},
        data() {
            return {
                value: '',
                button: "Send Invites",
                elements: [
                    {
                        "email": "",
                        "name": "",
                        "department": ""
                    },
                    {
                        "email": "",
                        "name": "",
                        "department": ""
                    },
                    {
                        "email": "",
                        "name": "",
                        "department": ""
                    }
                ],
                invitees: []
            }
        },
        mounted() {
            let number = this.getAdds
            if (number > 3) {
                for (let i = 3; i < number; i++) {
                    this.elements.push({value: ''});
                }
                this.populate()
            }
            else if (number == 3 && this.getInvites!= null) {
                this.populate()
            }
        },
        computed: {
            ...mapGetters(
                {
                    departments: '$_admin/getDepartmentsList',
                    getViewState: '$_admin/getViewState',
                    getBizName: '$_admin/getBizName',
                    getAdds: '$_admin/getAdds',
                    getInvites: '$_admin/getInvites',
                }
            ),
        },
        methods: {
            ...mapMutations(
                {
                    updateViewState: '$_admin/setViewState',
                    updateInvites: '$_admin/updateInvites',
                    updateDepartmentsList: '$_admin/updateDepartmentsList',
                    postInvites: '$_admin/postInvites',
                    updateBizName: '$_admin/updateBizName',
                }
            ),
            ...mapActions({
                inviteNewUsers: '$_admin/inviteNewUsers',
                createInviteLink: '$_admin/createInviteLink'
            }),
            populate: function (){
                let set = this.getInvites
                for (let i = 0; i < set.length; i++) {
                    this.elements[i].email = set[i][0];
                }
            },
            get_link: function () {
                this.updateViewState(5);
            },
            invite_many: function () {
                this.updateViewState(3);
            },
            postInvites: function () {
                for (let i=0, iLen=this.elements.length; i<iLen; i++) {
                    let email = this.elements[i].email;
                    if (email != '') {
                        this.button = "Sending...";
                        let session = this.$store.getters.getSession;
                        let cop_id = 0;
                        if (session.default == 'biz') {
                            cop_id = session[session.default]['cop_id'];
                        }
                        for (let i=0, iLen=this.elements.length; i<iLen; i++) {
                            let email = this.elements[i].email;
                            let name = this.elements[i].name;
                            let department = this.elements[i].department;

                            this.invitees.push({
                                "cop_id": cop_id,
                                "email": email,
                                "phone": "0712000000",
                                "password": "qwerty",
                                "name": name,
                                "department_id": department
                            });
                        }
                        let payload = this.invitees;
                        console.log(payload);
                        let full_payload = {
                            "values": payload,
                            "vm": this,
                            "app": "NODE_PRIVATE_API",
                            "endpoint": "invite_user"
                        }
                        this.$store.dispatch("$_admin/inviteNewUsers", full_payload).then(response => {
                            this.button = "Send Invites";
                            console.log("invitations sent");
                            console.log(response);
                            let level = 1; //success
                            let notification = {"title": "", "level": level, "message": "Invitations sent!"}; //notification object
                            this.$store.commit('setNotification', notification);
                            this.$store.commit('setNotificationStatus', true); //activate notification
                        }, error => {
                            this.button = "Send Invites";
                            console.log("invitations NOT sent");
                            console.log(error);
                            let level = 3;
                            let notification = {
                                "title": "",
                                "level": level,
                                "message": "Something went wrong."
                            }; //notification object
                            this.$store.commit('setNotification', notification);
                            this.$store.commit('setNotificationStatus', true); //activate notification

                        });
                    }
                    else {
                        let level = 2;
                        let notification = {
                            "title": "",
                            "level": level,
                            "message": "Please enter at least one valid email address."
                        }; //notification object
                        this.$store.commit('setNotification', notification);
                        this.$store.commit('setNotificationStatus', true); //activate notification
                    }
                }

            },
            addElement: function () {
                this.elements.push({value: ''});
            },
            getInviteLink: function () {
                let session = this.$store.getters.getSession;
                let cop_id = 0;
                if (session.default == 'biz') {
                    cop_id = session[session.default]['cop_id'];
                    cop_id = cop_id.toString()
                }
                let payload = {
                    "cop_id": cop_id
                }

                console.log(payload)
                let full_payload = {
                    "values": payload,
                    "vm": this,
                    "app": "NODE_PRIVATE_API",
                    "endpoint": "create_invite"
                }
                this.$store.dispatch("$_admin/createInviteLink", full_payload).then(response => {
                    console.log("link created");
                    this.updateViewState(5);
                    console.log(response);
                    let level = 1; //success
                    let notification = {"title": "Invite Link", "level": level, "message": "Link created!"}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification
                }, error => {
                    console.log("link NOT created");
                    console.log(error);
                    let level = 2;
                    let notification = {"title": "Invite Link", "level": level, "message": "An error occurred."}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification

                });

            }

        }
    }
</script>

<style lang="css">

    .addUser--select {
        width: 100%;
    }

    .addUser--submit {
        margin-right: 6.5%;
    }

    .btn-submit {
        font-size: 14px;
    }

    a {
        color: #039be5;
        text-decoration: none;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }

    i.right {
        float: right;
        margin: 5px 0 5px 15px;
    }

    .add-user-submit {
        /*margin-top: 40px;*/
        padding: 20px;
        margin: 30px !important;
    }

    .error {
        justify-content: center;
    }

    .inp > .column-flex {
        align-items: flex-start;
        margin-right: 5px;
    }

    .alright {
        align-items: flex-end;
    }

    .or-div {
        align-items: center;
        justify-content: center;
        font-size: xx-large;
    }

    .alleft {
        justify-content: flex-end;
        align-items: flex-start;
    }

    .inv-link {
        padding-top: 5%;
    }

    .flex {
        display: flex;
    }

    .alleft > div {
        display: flex;
        align-items: center;
    }

    .alleft span {
        padding-left: 5px;
        padding-right: 5px;
    }

    .add-anchor {
        display: flex;
        align-items: center;
        /*margin-left: 1.7%;*/
    }

    .inviteMany--anchor {
        margin-left: 1.7% !important;
    }

    .addUser--link {
        margin-left: 1.7%;
    }

    .add-anchor:hover {
        text-decoration: none !important;
        border-bottom: 1.5px solid !important;
        margin-bottom: -2px !important;
    }

    .plus-icon {
        font-size: 20px !important;
        padding-right: 3px;
    }

    .select-wrapper {
        width: 100%;
    }

    .inv-justify {
        margin-top: -1.29rem !important;
    }

    .inv-inputs {
        margin-top: 30px;
    }
</style>
