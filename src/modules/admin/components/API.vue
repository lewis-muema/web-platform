<template lang="html">
    <div class="">
        <div class="">
            <p class="button">
                <a class="button__element" href="https://app.sendyit.com/biz/api/generate_api/669"> Update Api key </a>
                <br> <br>
            </p>
        </div>
        <div class="">
            <table class="table">
                <thead>
                	<tr>
                		<th class="table--header table__item">Username</th>
                		<th class="table--header table__item">API Key</th>
                		<th class="table--header table__item">Created</th>
                        <th class="table--header table__item">Api Status</th>
                        <th class="table--header table__item">Account Status</th>
                        <th class="table--header table__item">Key Enviroment</th>
                	</tr>
                </thead>
                <tbody>
                    <tr>
                      <td class="table__item table__item--edit" ><span class="content--bold">faithshop</span></td>
                      <td class="table__item table__item--bold" >zcHUVkH9GtxZmrUyZ6HY</td>
                      <td class="table__item">Oct 30, 2018</td>
                      <td class="table__item">Activated </td>
                      <td class="table__item">Activated</td>
                      <td class="table__item">Live</td>
                    </tr>
                    <tr>
                      <td class="table__item table__item--edit">
                        <span class="content--bold">faithshop </span>
                      </td>
                      <td class="table__item table__item--bold">
                        ALVvNhD8d7PVcnadsRSV
                      </td>
                      <td class="table__item">
                        Oct 30, 2018
                      </td>
                      <td class="table__item">Activated </td>
                      <td class="table__item">Activated </td>
                      <td class="table__item">Sandbox</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="content">
            <p><span class="content--bold">Ready to start using the Sendy API?</span> Head over to the <a href="http://docs.sendypublicapi.apiary.io/#" target="_blank">developer site</a>&nbsp;for complete documentation.</p>
        </div>
    </div>
</template>

<script>
export default {
    name:"API",
}
</script>

<style lang="css">
    .content{
        margin-top: 2em;
    }
    .content--bold, .table__item--bold{
        font-weight: 400;
    }
    .table{
        border: 1px solid #ccd3d9;
        border-collapse: separate;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        display: table;
        width: 100%;
        border-bottom: 0px solid #CCC;
        max-width: 100%;
        background-color: transparent;
        border-spacing: 0;
    }
    .table--header{
        border-bottom: 1px solid #ccd3d9;
        background: #eaedef;
        color: #64727a;
        font-weight: 500;
        text-align: left;
    }
    .table__item {
        padding: 8px;
        line-height: 18px;
        vertical-align: top;
        padding-right: 0px;
        font-size: 13px;
        border-left: 1px solid #ccd3d9;
        border-bottom: 1px solid #ccd3d9;
    }
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
</style>
