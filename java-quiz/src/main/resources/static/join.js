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

        stompClient.subscribe(`/topic/quiz/${roomID}`, function (response) {
            handleResponse(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/questions${roomID}`, function (response) {
            handleResponse(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/answers${roomID}`, function (response) {
            handleResponse(JSON.parse(response.body));
        });

        sendName(roomID, JSON.stringify({
            roomID: roomID,
            mode: 'multiplayer',
            host: false,
            join: true,
            sessionID: socketId
        }));
    });
}

function handleResponse(response) {
    if(response.length == 1 && response[0].join == false) {
        alert('room does not exist');
        disconnect();
    } else {
        $("#joinForm").hide();
        $("#waiting").show();
    }
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