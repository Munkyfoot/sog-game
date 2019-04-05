var can_color = false;

$(function(){
    Generate();

    setInterval(RefreshTiles, 1000);

    $("#gameboard").on('click', '.tile', function(){
        UpdateTile($(this).attr('id'));
    });

    RefreshMessages();
    setInterval(RefreshMessages, 1500);

    $("#chat_send").click(function(){
        var name = "Player"
        if($("#chat_name").val().length > 0){
            name = $("#chat_name").val();
        }

        SendMessage(name, $("#chat_input").val());
        $("#chat_input").val("")
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

function RefreshTiles(){
    $.getJSON('/json/', function(data){
        for(var i = 0; i < data.length; i++){
            $("#"+data[i]['id']).attr('class', 'tile color_' + data[i]['color_id'])
        }
    });
}

function SendMessage(name, message){
    $.post("/message/", {name : name, message_content: message}).done(function( data ) {
        $("#chat_output").html("Chat")
        for(var i = 0; i < data.length; i++){
            var name = data[i]['name'];
            if(name == "Player"){
                name += data[i]['ip_address'];
            }
            $("#chat_output").append("<div class='chat-message'>" + name + ": " + data[i]['content'] + "</div>")
        }
    });
}

function RefreshMessages(){
    $.getJSON("/json/messages/").done(function( data ) {
        $("#chat_output").html("Chat")
        for(var i = 0; i < data.length; i++){
            var name = data[i]['name'];
            if(name == "Player"){
                name += data[i]['ip_address'].substring(0,3);
            }
            $("#chat_output").append("<div class='chat-message'>" + name + ": " + data[i]['content'] + "</div>")
        }
    });
}