var stompClient = null;
var interval = null;
let rID = null;
let sID = null;

function connect(roomID) {
    let socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        let socketId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];

        $("#roomID").html(roomID);

        stompClient.subscribe(`/topic/quiz/${roomID}`, function (sessions) {
            showGreeting(JSON.parse(sessions.body));
        });

        stompClient.subscribe(`/topic/quiz/questions${roomID}`, function (response) {
            handleResponse(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/answers${roomID}`, function (response) {
            handleResponse(JSON.parse(response.body));
        });

        rID = roomID;
        sID = socketId;

        let room = JSON.stringify({
            roomID: roomID,
            mode: 'multiplayer',
            host: true,
            join: true,
            sessionID: socketId
        })
        sendName(roomID, room);
        startPolling(roomID, socketId);
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

function startPolling(roomID) {

    let room = JSON.stringify({
        roomID: roomID,
        mode: 'multiplayer',
        host: true,
        join: false,
        sessionID: 0
    })


    interval = setInterval(() => { 
        stompClient.send(`/app/quiz/${roomID}`, {}, room);
    }, 3000);
}

function stopPolling() {
    // window.clearInterval(interval);
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