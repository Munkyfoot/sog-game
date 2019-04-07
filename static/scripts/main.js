var can_color = false;
var tile_refresh = null;
var message_refresh = null;
var replay_frames = [];
var replay_mode = false;

$(function () {
    Generate();

    tile_refresh = setInterval(RefreshTiles, 4000);

    $("#gameboard").on('click', '.tile', function () {
        UpdateTile($(this).attr('id'));
    });

    $("#replay").click(function (e) {
        e.preventDefault();
        if (replay_mode) {
            StopReplay();
        }
        else {
            Replay();
        }
    });

    ChatResize();
    $(window).resize(function () {
        ChatResize();
    });

    if ($("#about").is(':visible')) {
        $("#about").toggle();
    }

    $("#more_info").click(function (e) {
        e.preventDefault();
        $("#about").slideToggle();
    });

    $("#less_info").click(function (e) {
        e.preventDefault();
        $("#about").slideToggle();
    });

    RefreshMessages(true);
    message_refresh = setInterval(RefreshMessages, 5000);

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
            $('#gameboard').append("<div id='" + data[i]['id'] + "' class='tile tile-hover color_" + data[i]['color_id'] + "'></div>");
        }
    });
    $("#info_readout").text("Feel free to change the color of a tile.");
    can_color = true;
}

function UpdateTile(tile_id) {
    if (!can_color) {
        return;
    }

    can_color = false;

    var s = 5;
    $("#info_readout").text("Please wait " + s + " seconds recolor another a tile.");
    var x = setInterval(function () {
        s--;
        $("#info_readout").text("Please wait " + s + " seconds recolor another a tile.");
        if (s <= 0) {
            clearInterval(x);
            $("#info_readout").text("You may now recolor another a tile.");
            $(".tile").addClass("tile-hover");
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
            var classes = 'tile color_' + data[i]['color_id'];

            if ($("#" + data[i]['id']).hasClass('tile-hover')) {
                classes += " tile-hover";
            }

            $("#" + data[i]['id']).attr('class', classes);
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

function ChatResize() {
    var free_space = $(window).innerHeight() - $("#title").innerHeight() - $("#gameboard").innerHeight() - $("#info").innerHeight() - $("#chat").innerHeight() + $("#chat_output").innerHeight();
    $("#chat_output").css('maxHeight', free_space);
}

function Replay() {
    clearInterval(tile_refresh);

    $(".tile").attr('class', 'tile color_0');

    $.getJSON('/json/log/', function (data) {
        replay_mode = true;
        $("#replay").text("Stop Replay");
        for (var i = 0; i < data.length; i++) {
            ReplayFrame(data, i);
        }
    });
}

function StopReplay() {
    for (var i = 0; i < replay_frames.length; i++) {
        clearInterval(replay_frames[i]);
    }

    replay_frames = [];

    RefreshTiles();
    tile_refresh = setInterval(RefreshTiles, 4000);

    replay_mode = false;
    $("#replay").text("Replay");
}

function ReplayFrame(data, i) {
    var x = setTimeout(function () {
        $("#" + data[i]['tile_id']).attr('class', 'tile color_' + data[i]['new_color_id']);

        if (i == data.length - 1) {
            StopReplay();
        }

    }, 500 * i);

    replay_frames.push(x);
}