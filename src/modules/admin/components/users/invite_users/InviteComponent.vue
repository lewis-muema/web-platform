<template lang="html">
    <div class="">
        <div class="inv-container">
            <div class="inv-inputs">
                <div class="side-flex error">
                    <span id="show_error"></span>
                </div>
                <div class="side-flex inp" id="set0">
                    <input class="form-control" type="text" name="email" value="" placeholder="name@example.com">
                    <input class="form-control" type="text" name="name" value="" placeholder="Full Name (Optional)">
                    <el-select class="addUser--select" v-model="value" placeholder="Department">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="side-flex inp" id="set1">
                <input class="form-control" type="text" name="email" value="" placeholder="name@example.com">
                <input class="form-control" type="text" name="name" value="" placeholder="Full Name (Optional)">
                <el-select class="addUser--select" v-model="value" placeholder="Department">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="side-flex inp" id="set2">
                <input class="form-control" type="text" name="email" value="" placeholder="name@example.com">
                <input class="form-control" type="text" name="name" value="" placeholder="Full Name (Optional)">
                <el-select class="addUser--select" v-model="value" placeholder="Department">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="side-flex submit">
            <div class="column-flex pad-flex alleft">
                <div class="addUser--link"><a v-on:click="add_another" class="add-anchor"><i class="el-icon-circle-plus-outline"></i>&nbsp;Add
                    another</a> <span> or </span> <a v-on:click="invite_many" class="add-anchor" href="#">add many
                    at once</a></div>
            </div>
            <div class="addUser--submit">
                <button v-on:click="postInvites" class="btn-submit" type="submit"
                        name="action">Send Invites
                </button>
            </div>
        </div>

        <div class="side-flex">
            <div class="column-flex pad-flex inv-link">
                <div class="flex"><a v-on:click="get_link" class="add-anchor inviteMany--anchor"><i
                        class="el-icon-share"></i><span>&nbsp;Get an invite link to share</span></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';
    import $ from 'jquery'

    export default {
        name: 'invite-component',
        components: {},
        data() {
            return {
                options: [{
                    value: 'Option1',
                    label: 'Option1'
                }, {
                    value: 'Option2',
                    label: 'Option2'
                }, {
                    value: 'Option3',
                    label: 'Option3'
                }, {
                    value: 'Option4',
                    label: 'Option4'
                }, {
                    value: 'Option5',
                    label: 'Option5'
                }],
                value: ''
            }
        },
        mounted() {
            this.init_select()
            $('.error').hide();

            let number = this.getAdds
            if (number > 3) {
                for (var i = 3; i < number; i++) {
                    $(".inp:eq(1)").clone().attr("id", "set" + i).appendTo(".inv-inputs")
                }
                this.populate()
            }
            else if (number == 3 && this.getInvites != null) {
                this.populate()
            }
        },
        computed: {
            ...mapGetters(
                {
                    getDepartment: '$_admin/getDepartment',
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
                    updateDepartments: '$_admin/updateDepartments',
                    postInvites: '$_admin/postInvites',
                    updateAdds: '$_admin/updateAdds',
                }
            ),
            populate: function () {
                var set = this.getInvites

                for (var i = 0; i < set.length; i++) {
                    $("#set" + i).find("input[name='email']").val(set[i][0])
                    $("#set" + i).find("input[name='name']").val(set[i][1])
                }
            },
            get_link: function () {
                this.updateViewState(2);
            },
            invite_many: function () {
                this.updateViewState(3);
                // this.$store.commit('updateViewState', 3)
            },
            init_select: function () {
                var depts = []
                if (this.getDepartments != null) {
                    depts = this.getDepartments
                    var optionsAsString = "";
                    for (var i = 0; i < depts.length; i++) {
                        optionsAsString += "<option value='" + depts[i]['department_id'] + "'>" + depts[i]['department_name'] + "</option>";
                    }
                    $("select[class='inpDept']").find('option').remove().end().append($(optionsAsString));
                    $('select').formSelect();
                }
                else {
                    var optionsAsString = "<option value=0 disabled>Default Department</option>";
                    $("select[class='inpDept']").find('option').remove().end().append($(optionsAsString));
                    $('select').formSelect();
                }
            },
            add_another: function () {
                $(".inp:eq(1)").clone().attr("id", "set" + (this.getAdds)).appendTo(".inv-inputs")
                this.updateAdds(1)
                // console.log($("#set1").find("input[name='email']").val())
            },
            postInvites: function () {
                let number = this.getAdds
                var data = new Array();
                for (var x = 0; x < number; x++) {
                    console.log()
                    if (this.checkEmpty($("#set" + x).find("input[name='email']").val())) {
                        this.updateAdds(2)
                    }
                    else {
                        data[x] = new Array($("#set" + x).find("input[name='email']").val(), $("#set" + x).find("input[name='name']").val(), $("#set" + x).find("select[name='dept']").val())
                    }
                }

                if (this.getAdds < 1) {
                    this.valid('Please enter at least one valid email address')
                    this.newAdds(3)
                }
                else {
                    this.updateInvites(data)
                    this.$store.dispatch('postInvites').then(function () {
                        this.updateViewState(4)
                    }.bind(this))

                }
            },
            checkEmpty: function (val) {
                if (val == "") {
                    return true;
                }
                else {
                    return false;
                }
            },
            valid: function (string) {
                $('#show_error').text(string)
                $('.error').show("fast")
                setTimeout(function () {
                    $('.error').hide("slow")
                }, 5000);

            }
        }
    }
</script>

<style lang="css">

    .addUser--select {
        width: 100%;
    }
    .addUser--submit{
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

    .submit {
        margin-top: 40px;
        padding: 20px;
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
    .inviteMany--anchor{
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

    .inv-inputs {
        margin-top: 30px;
    }
</style>
