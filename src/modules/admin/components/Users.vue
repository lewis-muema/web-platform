    <template lang="html">
    <div class="">
        <div class="menu">
            <p class="button">
                <a class="button__element"> Add User </a>
                <br> <br>
            </p>
        </div>
        <div class="">
            <v-card>
                <v-card-title>
                  Users
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="desserts"
                  :search="search"
                  prev-icon="mdi-menu-left"
                  next-icon="mdi-menu-right"
                  sort-icon="mdi-menu-down"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td>{{ props.item.name }}</td>
                      <td class="text-xs-right">{{ props.item.calories }}</td>
                      <td class="text-xs-right">{{ props.item.fat }}</td>
                      <td class="text-xs-right">{{ props.item.carbs }}</td>
                      <td class="text-xs-right">{{ props.item.protein }}</td>
                      <td class="text-xs-right">{{ props.item.iron }}</td>
                      <td class="text-xs-right">{{ props.item.iron1 }}</td>
                    </tr>
                  </template>
                  <template slot="expand" slot-scope="props">
                    <v-card flat>
                      <v-card-text>Peek-a-boo!</v-card-text>
                    </v-card>
                  </template>
                </v-data-table>
            </v-card>
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
        search: '',
        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Phone', value: 'calories' },
          { text: 'Email', value: 'fat' },
          { text: 'Department', value: 'carbs' },
          { text: 'Type', value: 'protein' },
          { text: 'Status', value: 'iron' },
          { text: 'Actions', value: 'iron1' }
        ],
        desserts: [
          {
            value: false,
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
            iron1: 'Edit user'
          },
          {
            value: false,
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
            iron1: 'Edit user'
          },
          {
            value: false,
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
            iron1: 'Edit user'
          },
          {
            value: false,
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
            iron1: 'Edit user'
          },
          {
            value: false,
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
            iron1: 'Edit user'
          }
        ]
      }
    }
}
</script>

<style lang="css">
    @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
    @import '~vuetify/dist/vuetify.min.css';

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
