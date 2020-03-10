var stompClient = null;

function connect(roomID) {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        $.ajax({
            type: "POST",
            url: "/singleplayer/createsession",
            data: JSON.stringify({
                roomID: roomID,
                mode: 'singleplayer',
                host: true,
                join: true
            }),
            contentType : "application/json",
            dataType: 'json'
        });

        $("#roomID").html(roomID);

        // stompClient.subscribe(`/topic/quiz/${roomID}`, function (greeting) {
        //     showGreeting(JSON.parse(greeting.body).content);
        // });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

function sendName() {
    stompClient.send(`/app/quiz/${param}`, {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });

    let roomID = Math.floor((Math.random() * 10000000000) + 1);
    connect(roomID);

    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(roomID); });
});