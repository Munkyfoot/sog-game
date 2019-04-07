var can_color = false;

$(function () {
    Generate();

    setInterval(RefreshTiles, 2000);

    $("#gameboard").on('click', '.tile', function () {
        UpdateTile($(this).attr('id'));
    });

    var free_space = $(window).height() - $("#gameboard").height() - $("#info").height() - $("#chat").height() + $("#chat_output").height() - 12;

    $("#chat_output").css('maxHeight', free_space);

    RefreshMessages(true);
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
        DisplayMessages(data);
    });
}

function RefreshMessages(force_to_bottom = false) {
    $.getJSON("/json/messages/").done(function (data) {
        DisplayMessages(data, force_to_bottom);
    });
}

function DisplayMessages(data, force_to_bottom = false) {
    var scrollTopSaved = $("#chat_output").scrollTop();
    var scrolling = $("#chat_output").scrollTop() <= ($("#chat_output")[0].scrollHeight - $("#chat_output").innerHeight());

    $("#chat_output").html("")
    for (var i = 0; i < data.length; i++) {
        var name = data[i]['name'];
        if (name == "Player") {
            name += data[i]['ip_address'].substring(0, 3);
        }

        var ip_segments = data[i]['ip_address'].split(".");
        var color_style = "style='background-color:rgba(" + ip_segments[0] + ", " + ip_segments[1] + ", " + ip_segments[2] + ", 0.25);'";

        var date = new Date(data[i]['date_time']);
        var timestamp = date.toLocaleString();

        $("#chat_output").append("<div class='chat-message' " + color_style + "><small>" + timestamp + "</small><br>" + name + ": " + data[i]['content'] + "</div>")
    }

    if (!scrolling || force_to_bottom) {
        scrollTopSaved = $("#chat_output")[0].scrollHeight;
    }
    $("#chat_output").scrollTop(scrollTopSaved);
    //$("#chat_output").animate({ scrollTop: scrollTopSaved }, 0);
}