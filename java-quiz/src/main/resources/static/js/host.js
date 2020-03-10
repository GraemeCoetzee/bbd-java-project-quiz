var stompClient = null;
var interval = null;
let rID = null;
let sID = null;
let quiz = null;

function connect(roomID) {
    let socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        let socketId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];

        $("#roomID").html("Game Pin: " + roomID);

        stompClient.subscribe(`/topic/quiz/${roomID}`, function (sessions) {
            showGreeting(JSON.parse(sessions.body));
        });

        stompClient.subscribe(`/topic/quiz/quizbegin/${roomID}`, function (response) {
            handleStartQuizRepsonse(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/answers/${roomID}`, function (response) {
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

function startQuiz() {

    let room = JSON.stringify({
        roomID: rID
    });

    stompClient.send(`/app/quiz/quizbegin/${rID}`, {}, room);
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
    $("#players").html("");
    console.log(message);
    message.forEach(element => {
        if(!element.host)
        $("#players").append("<div class='card col-md-4'><div class='card-body'>" + element.sessionID + "</div></div>");
    });
}

function handleStartQuizRepsonse(message) {
    console.log(message);
    begin(message);
}

function begin(quiz) {
    for(var j = 0; j < quiz.questions.length; j++) {
        function send(i) {
            setTimeout(() => {
                let question = JSON.stringify({
                    question: quiz.questions[i],
                    possibleAnswers: quiz.correctAnswers[i].concat(quiz.wrongAnswers[i])
                });
                stompClient.send(`/app/quiz/questions/${rID}`, {}, question);
            }, i * 40000);
        }
        send(j);
    }
}

function sendQuestion() {

}

function updateScore() {

}

function handleAnsweredQuestionResponse(message) {
    console.log(message);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });

    let roomID = Math.floor((Math.random() * 1000000) + 1);
    connect(roomID);

    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(roomID); });
});