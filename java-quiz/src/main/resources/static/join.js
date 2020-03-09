var stompClient = null;

function join() {
    let roomID = $("#roomID").val();
    connect(roomID);
}

function connect(roomID) {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        let socketId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
        $.ajax({
            type: "POST",
            url: "/multiplayer/joinsession",
            data: JSON.stringify({
                roomID: roomID,
                mode: 'multiplayer',
                host: false
            }),
            contentType : "application/json",
            dataType: 'json'
        });

        // stompClient.subscribe(`/topic/quiz/${roomID}`, function (greeting) {
        //     showGreeting(JSON.parse(greeting.body).content);
        // });

        sendName(roomID, JSON.stringify({
            roomID: roomID,
            mode: 'multiplayer',
            host: false,
            join: true,
            sessionID: socketId
        }));
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}

function sendName(roomID, message) {
    stompClient.send(`/app/quiz/${roomID}`, {}, message);
}

$(function () {
    $( "#send" ).click(function() { sendName(roomID); });
});