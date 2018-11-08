export default {
  /*
  Usage:
  1. Include as a mixin in your component and declare
    `import DatatableMixin from path`

    `mixins: [ DatatableMixin ],`

  2.Call function create_datatable
    Declaration `create_datatable(el, data, options)`

  3. The function takes the following arguments
    el (string) : The id of the element where the datatable is to be created
    data (array) : The records to be displayed on the table as a JSON array
    options : An object with custom table options which include -
      i.  title (string) - Title of the table
      ii. count (boolean) - Defines if there should be a count column as the first on each row
      iii. custom_col (array) - An array of objects that describes custom columns on the table that are not in the data. These columns are described by
        key : The column's key which will show on the header
        render : The data to be shown on the non-header cells of the column
      iv. col_options (array) - An array of objects that describes custom classes for the columns in the table. These are be described by
        option : The classname to be added to the column
        target : The index of the column to apply the class. Starts from 0

  4. (Optional) Include the datatable css in your component css
    `<style lang="css">
      @import "../../../styles/datatable.css";
    </style>`

  Example Implementation :
  this.create_datatable(el, data,
  {
    title : "Payments Test",
    count: true,
    custom_col:[
      {
        key: "Custom test",
        render: '<a href="#" class="mdshow" onclick="#">Test Custom</a>'
      },
      {
        key: "Custom test2",
        render: '<a href="#" class="mdshow" onclick="#">Test Custom2</a>'
      },
    ],
    col_options: [
      {
        option:'',
        target:''
      },
    ],
  });

  TBA: Code for child rows e.g on order history
  */
  methods: {
    create_datatable(el, data, options) {

        var col = [];
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        if (options.count == true) {
          col.splice(0, 0, " ");
        }
        options.custom_col.forEach(function(element) {
          element.pos = col.push(element.key);
        });

        var table = document.createElement("table");

        {
          var trf = table.insertRow(0);
          var td = document.createElement('td');
          td.setAttribute('colSpan', col.length);
          td.setAttribute('class', 'datatable--title');
          td.innerHTML = options.title
          trf.appendChild(td);
        }


        var tr = table.insertRow(-1);

        for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");
          th.innerHTML = col[i];
          tr.appendChild(th);
        }

        var customs = options.custom_col.length;

        for (var i = 0; i < data.length; i++) {
          tr = table.insertRow(-1);
          var custom_count = 0
          for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            if (options.count == true && j==0) {
              tabCell.innerHTML = i+1;
            }
            else {
              if (j >= (col.length - customs)) {
                tabCell.innerHTML = options.custom_col[custom_count].render;
                custom_count++;
              }
              else {
                tabCell.innerHTML = data[i][col[j]];
              }
            }
          }
        }

        table.setAttribute('class', 'datatable');
        var divContainer = document.getElementById(el);
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }
  }
}
