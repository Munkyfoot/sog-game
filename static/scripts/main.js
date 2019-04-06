var can_color = false;

$(function () {
    Generate();

    setInterval(RefreshTiles, 2000);

    $("#gameboard").on('click', '.tile', function () {
        UpdateTile($(this).attr('id'));
    });

    RefreshMessages();
    setInterval(RefreshMessages, 3000);

    $("#chat_send").click(function () {
        var name = "Player"
        if ($("#chat_name").val().length > 0) {
            name = $("#chat_name").val();
        }

        SendMessage(name, $("#chat_input").val());
        $("#chat_input").val("")
    });
});

function Generate() {
    $.getJSON('/json/', function (data) {
        for (var i = 0; i < data.length; i++) {
            $('#gameboard').append("<div id='" + data[i]['id'] + "' class='tile color_" + data[i]['color_id'] + "'></div>");
        }
    });
    $("#info").text("Feel free to change the color of a tile.");
    can_color = true;
}

function UpdateTile(tile_id) {
    if (!can_color) {
        return;
    }

    can_color = false;

    var s = 5;
    $("#info").text("Please wait " + s + " seconds recolor another a tile.");
    var x = setInterval(function () {
        s--;
        $("#info").text("Please wait " + s + " seconds recolor another a tile.");
        if (s <= 0) {
            clearInterval(x);
            $("#info").text("You may now recolor another a tile.");
            can_color = true;                
        }
    }, 1000);

    $.post("/update/" + tile_id + "/").done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#" + data[i]['id']).attr('class', 'tile color_' + data[i]['color_id'])
        }
    });
}

function RefreshTiles() {
    $.getJSON('/json/', function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#" + data[i]['id']).attr('class', 'tile color_' + data[i]['color_id'])
        }
    });
}

function SendMessage(name, message) {
    $.post("/message/", { name: name, message_content: message }).done(function (data) {
        $("#chat_output").html("")
        for (var i = 0; i < data.length; i++) {
            DisplayMessage(data[i]);
        }
    });
}

function RefreshMessages() {
    $.getJSON("/json/messages/").done(function (data) {
        $("#chat_output").html("")
        for (var i = 0; i < data.length; i++) {
            DisplayMessage(data[i]);
        }
    });
}

function DisplayMessage(message_data) {
    var name = message_data['name'];
    if (name == "Player") {
        name += message_data['ip_address'].substring(0, 3);
    }

    var ip_segments = message_data['ip_address'].split(".");
    var color_style = "style='background-color:rgba(" + ip_segments[0] + ", " + ip_segments[1] + ", " + ip_segments[2] + ", 0.25);'";

    var date = new Date(message_data['date_time']);
    var timestamp = date.toLocaleString();

    $("#chat_output").append("<div class='chat-message' " + color_style + "><small>" + timestamp + "</small><br>" + name + ": " + message_data['content'] + "</div>")
}