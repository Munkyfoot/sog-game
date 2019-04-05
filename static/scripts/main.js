$(function(){
    Generate()

    setInterval(Refresh, 1000/5);

    $("#gameboard").on('click', '.tile', function(){
        UpdateTile($(this).attr('id'));
    });
});

function Generate(){
    $.getJSON('/json/', function(data){
        for(var i = 0; i < data.length; i++){
            $('#gameboard').append("<div id='"+ data[i]['id'] + "' class='tile color_" + data[i]['color_id'] + "'></div>");
        }
    });
}

function UpdateTile(tile_id){
    $.post("/update/"+tile_id+"/").done(function( data ) {
        for(var i = 0; i < data.length; i++){
            $("#"+data[i]['id']).attr('class', 'tile color_' + data[i]['color_id'])
        }
    });
}

function Refresh(){
    $.getJSON('/json/', function(data){
        for(var i = 0; i < data.length; i++){
            $("#"+data[i]['id']).attr('class', 'tile color_' + data[i]['color_id'])
        }
    });
}