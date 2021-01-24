//Sort Table by Header Function
function sortTable(n) {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("bestsellersProducts");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.getElementsByTagName("TR");
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < rows.length - 1; i++) { //Change i=0 if you have the header th a separate table.
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

$(function() {  //the fallback function for the datepicker, this allows the datepicker to work across all browsers including safari
  if (!Modernizr.inputtypes['date']) {
    $('input[type=date]').datepicker({ 
            dateFormat: 'mm-dd-yy'
        });
    }
});  

// Create Dynamic Table 
function LoadProducts(){
  $('#productsTableBody').empty();

  $.getJSON("https://wt.ops.labs.vu.nl/api21/807c5ce9", function(data){
    $(data).each(function(i, item){
      $('#productsTableBody').append($("<tr>")
    //   .append($("<td>").append(item.select))
      .append($("<td>").append(item.product))
      .append($("<td>").append('<img src="' + decodeURIComponent(item.image) + '" />'))
      .append($("<td>").append(item.best_before_date))
      .append($("<td>").append(decodeURIComponent(item.amount)))
      .append($("<td>").append(item.origin)));
    });
  });
}
  
  
//Reset Button Function
$(document).ready(function() { 
  LoadProducts();

	$('#resetButton').click(function(){
    $.get("https://wt.ops.labs.vu.nl/api21/807c5ce9/reset");
    LoadProducts();
	}); 

  /*Implementing Submit button to add items*/
  $('#addProductForm').on("submit", function(e){
    e.preventDefault(); // Stop refresh of the page
    
    var productString = '{"' + $(this).serialize().replace(/=/g, '":"').replace(/&/g, '","') + '"}';

    $.ajax({
      type: "POST",
      url: "https://wt.ops.labs.vu.nl/api21/807c5ce9",
      contentType: "application/json",
      data: productString,
      success: function(){
        $("#product, #image, #best_before_date, #amount, #origin").val("");
        LoadProducts();
      }
    });
  });
});