var stompClient = null;
var sID = null;
var rID = null;



$( document ).ready(function() {
    $("#question").hide();
    $("#possibleAnswers").hide();
    $("#results").hide();
    $("#loader").hide();
    $("#timer").hide();
    $(".timer-description").hide();
});

function join() {
    let roomID = $("#roomID").val();
    connect(roomID);
}

function connect(roomID) {

    rID =  roomID;
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        let socketId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];

        sID = socketId;

        stompClient.subscribe(`/topic/quiz/${roomID}`, function (response) {
            handleResponse(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/quizbegin/${roomID}`, function (response) {
            handleStartQuizRepsonse();
        });

        stompClient.subscribe(`/topic/quiz/questions/${roomID}`, function (response) {
            handleQuestion(JSON.parse(response.body));
        });

        sendName(roomID, JSON.stringify({
            roomID: roomID,
            mode: 'multiplayer',
            host: false,
            join: true,
            sessionID: socketId
        }));
    }, function(message) {
        alert(message);
        window.location.replace("http://localhost:8080/multiplayer");
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

function handleStartQuizRepsonse() {
    $("#loader").hide();
}

function handleQuestion(question) {
    $("#loader").hide();
    setTimeout(()=> {
        $("#question").show();
        $("#timer").show();

        $("#description").html("Think About It!");
        $(".timer-description").show();
        $("#questionSpace").html(question.question);
    }, 1000);

    for(var j = 0; j < 14; j++) {
        function updateBar(i) {
            setTimeout(() => {
                $(".progress-bar").attr("style", "width: " + (100/13)*i + "%");
            }, i * 1000);
        }
        updateBar(j);
    }

    setTimeout( () => {
        $("#description").html("Answer!");
        $(".progress-bar").attr("style", "width: " + 0 + "%");
        for(var j = 0; j < 15; j++) {
            function updateBar(i) {
                setTimeout(() => {
                    $(".progress-bar").attr("style", "width: " + (100/14)*i + "%");
                }, i * 1000);
            }
            updateBar(j);
        }
    }, 15000);
    

    setTimeout(()=> {
        $("#possibleAnswers").show();
        $(".answerSpace").html("");

        question.possibleAnswers.forEach((element, i) => {
            $(".answerSpace").append(`<div id='${i}' class='col-6 center card answerChoice' onclick="answerQuestion('${element}', ${i})"><div class='my-auto'>${element}</div></div>`);
        });

    }, 15000);

    

    setTimeout(()=> {
        $("#results").show();
        $("#possibleAnswers").hide();
    }, 30000);

    setTimeout(()=> {
        $("#question").hide();
        $("#possibleAnswers").hide();
        $("#results").hide();
    }, 40000);

}

function answerQuestion(answer, i) {
    let quizAnswer = JSON.stringify({
        answer: answer,
        user: sID
    });

    stompClient.send(`/app/quiz/answers/${rID}`, {}, quizAnswer);
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}

function sendName(roomID, message) {
    stompClient.send(`/app/quiz/${roomID}`, {}, message);
    $("#loader").show();
}

$(function () {
    $( "#send" ).click(function() { sendName(roomID); });
});