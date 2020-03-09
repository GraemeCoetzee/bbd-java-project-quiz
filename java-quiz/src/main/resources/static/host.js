var stompClient = null;

function connect(roomID) {
    let socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        let socketId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
        $.ajax({
            type: "POST",
            url: "/multiplayer/createsession",
            data: JSON.stringify({
                roomID: roomID,
                mode: 'multiplayer',
                host: true,
                join: true,
                socketID: socketId
            }),
            contentType : "application/json",
            dataType: 'json'
        });

        $("#roomID").html(roomID);

        stompClient.subscribe(`/topic/quiz/${roomID}`, function (sessions) {
            showGreeting(JSON.parse(sessions.body));
        });

        sendName(roomID, JSON.stringify({
            roomID: roomID,
            mode: 'multiplayer',
            host: true,
            join: true,
            sessionID: socketId
        }));
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

function sendName(roomID, message) {
    stompClient.send(`/app/quiz/${roomID}`, {}, message);
}

function showGreeting(message) {
    $("#greetings").html("");
    console.log(message);
    message.forEach(element => {
        if(!element.host)
        $("#greetings").append("<tr><td>" + element.sessionID +" joined" + "</td></tr>");
    });
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