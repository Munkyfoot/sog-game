$(function(){

});

$.getJSON('/json/', function(data){
    for(var i = 0; i < data.length; i++){
        $('#gameboard').append("<div id='"+ data[i]['id'] + "' class='tile color_" + data[i]['color_id'] + "'></div>");
    }
});