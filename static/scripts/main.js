var can_color = false;

$(function(){
    Generate()

    setInterval(Refresh, 1000);

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
    $("#info").text("Feel free to change the color of a tile.");
    can_color = true;
}

function UpdateTile(tile_id){
    if(!can_color){
        return;
    }

    $.post("/update/"+tile_id+"/").done(function( data ) {
        for(var i = 0; i < data.length; i++){
            $("#"+data[i]['id']).attr('class', 'tile color_' + data[i]['color_id'])
        }

        $("#info").text("Please wait a moment to recolor another tile.");
        can_color = false;
        setTimeout(function(){
            $("#info").text("You may now recolor another a tile.");
            can_color = true;
        }, 3000);
    });
}

function Refresh(){
    $.getJSON('/json/', function(data){
        for(var i = 0; i < data.length; i++){
            $("#"+data[i]['id']).attr('class', 'tile color_' + data[i]['color_id'])
        }
    });
}