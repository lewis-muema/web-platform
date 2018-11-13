<template lang="html">
    <div class="">
        <div class="inv-container">
            <div class="inv-inputs">
                <div class="side-flex error">
                    <span id="show_error"></span>
                </div>
                <div class="side-flex inp" id="set0">
                    <div class="column-flex pad-flex">
                        <input type="text" name="email" value="" placeholder="Email">
                    </div>
                    <div class="column-flex pad-flex">
                        <input type="text" name="name" value="" placeholder="Full Name (Optional)">
                    </div>
                    <div class="column-flex pad-flex">
                        <select class='inpDept' name="dept">
                        </select>
                    </div>
                </div>
                <div class="side-flex inp" id="set1">
                    <div class="column-flex pad-flex">
                        <input type="text" name="email" value="" placeholder="Email">
                    </div>
                    <div class="column-flex pad-flex">
                        <input type="text" name="name" value="" placeholder="Full Name (Optional)">
                    </div>
                    <div class="column-flex pad-flex">
                        <select class='inpDept' name="dept">
                        </select>
                    </div>
                </div>
                <div class="side-flex inp" id="set2">
                    <div class="column-flex pad-flex">
                        <input type="text" name="email" value="" placeholder="Email">
                    </div>
                    <div class="column-flex pad-flex">
                        <input type="text" name="name" value="" placeholder="Full Name (Optional)">
                    </div>
                    <div class="column-flex pad-flex">
                        <select class='inpDept' name="dept">
                        </select>
                    </div>
                </div>
            </div>
            <div class="side-flex submit">
                <div class="column-flex pad-flex alleft">
                    <div><a v-on:click="add_another" class="add-anchor"><i class="material-icons plus-icon">add_circle_outline</i>Add
                        another</a> <span> or </span> <a v-on:click="invite_many" class="add-anchor" href="#">add many
                        at once</a></div>
                </div>
                <div class="column-flex pad-flex alright">
                    <button v-on:click="postInvites" class="btn waves-effect waves-light blue" type="submit"
                            name="action">Send Invites
                        <i class="material-icons right">send</i>
                    </button>
                </div>
            </div>

            <div class="side-flex">
                <div class="column-flex pad-flex inv-link">
                    <div class="flex"><a v-on:click="get_link" class="add-anchor"><i class="material-icons plus-icon">link</i><span>Get an invite link to share</span></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'invite-component',
        components: {},
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
                [
                    'getBizName',
                    'getViewState',
                    'getDepartments',
                    'getAdds',
                    'getInvites'
                ]
            )
        },
        methods: {
            populate: function () {
                var set = this.getInvites

                for (var i = 0; i < set.length; i++) {
                    $("#set" + i).find("input[name='email']").val(set[i][0])
                    $("#set" + i).find("input[name='name']").val(set[i][1])
                }
            },
            get_link: function () {
                this.$store.commit('updateViewState', 2)
            },
            invite_many: function () {
                this.$store.commit('updateViewState', 3)
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
                this.$store.commit('updateAdds', 1)
                // console.log($("#set1").find("input[name='email']").val())
            },
            postInvites: function () {
                let number = this.getAdds
                var data = new Array();
                for (var x = 0; x < number; x++) {
                    console.log()
                    if (this.checkEmpty($("#set" + x).find("input[name='email']").val())) {
                        this.$store.commit('updateAdds', 2)
                    }
                    else {
                        data[x] = new Array($("#set" + x).find("input[name='email']").val(), $("#set" + x).find("input[name='name']").val(), $("#set" + x).find("select[name='dept']").val())
                    }
                }

                if (this.getAdds < 1) {
                    this.valid('Please enter at least one valid email address')
                    this.$store.commit('newAdds', 3)
                }
                else {
                    this.$store.commit('updateInvites', data)
                    this.$store.dispatch('postInvites').then(function () {
                        this.$store.commit('updateViewState', 4)
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
    .waves-effect {
        position: relative;
        cursor: pointer;
        display: inline-block;
        overflow: hidden;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        vertical-align: middle;
        z-index: 1;
        -webkit-transition: .3s ease-out;
        transition: .3s ease-out;
        text-decoration: none;
        color: #fff;
        text-align: center;
        letter-spacing: .5px;
        font-size: 14px;
        outline: 0;
        border: none;
        border-radius: 2px;
        height: 36px;
        line-height: 36px;
        padding: 0 16px;
        text-transform: uppercase !important;
    }

    input:not([type]), input[type=text]:not(.browser-default){
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #9e9e9e;
        border-radius: 0;
        outline: none;
        height: 3rem;
        width: 100%;
        font-size: 16px;
        margin: 0 0 8px 0;
        padding: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
        -webkit-transition: border .3s, -webkit-box-shadow .3s;
        transition: border .3s, -webkit-box-shadow .3s;
        transition: box-shadow .3s, border .3s;
        transition: box-shadow .3s, border .3s, -webkit-box-shadow .3s;
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
