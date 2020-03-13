var stompClient = null;
var sID = null;
var rID = null;
let score = 0;

let questionResult = null;

$(document).ready(function () {
    $("#question").hide();
    $("#possibleAnswers").hide();
    $("#results").hide();
    $("#loader").hide();
    $("#timer").hide();
    $(".timer-description").hide();
    $("#questionResults").hide();
    $("#leave").hide();
});

function join() {

    let roomID = $("#roomID").val();

    if (roomID == "") {
        alert("Room does not exist");
    }
    else {
        connect(roomID);
    }
}

function connect(roomID) {
    rID = roomID;
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        let socketId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];

        sID = socketId;

        $("#leave").show();

        $("#user").html("User: " + sID);

        stompClient.subscribe(`/topic/quiz/${roomID}`, function (response) {
            handleResponse(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/quizbegin/${roomID}`, function (response) {
            handleStartQuizRepsonse();
        });

        stompClient.subscribe(`/topic/quiz/questions/${roomID}`, function (response) {
            handleQuestion(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/sendscoreresult/${roomID}`, function (response) {
            handleResult(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/done/${roomID}`, function () {
            done();
        });

        sendName(roomID, JSON.stringify({
            roomID: roomID,
            mode: 'multiplayer',
            host: false,
            join: true,
            sessionID: socketId,
            score: 0
        }));
    }, function (message) {
        window.location.replace("http://localhost:8080/multiplayer");
    });
}

function handleResponse(response) {
    if (response.length == 1 && response[0].join == false) {
        $("#user").hide();
        $("#waiting").hide();
        $("#loader").hide();


        disconnect();

        alert('room does not exist');
    } else {
        $("#joinForm").hide();
        $("#waiting").show();
    }
}

function handleStartQuizRepsonse() {
    $("#loader").hide();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function handleQuestion(question) {
    //show question
    $("#loader").hide();
    setTimeout(() => {
        $("#question").show();
        $("#timer").show();
        $("#questionResults").hide();
        $("#description").html("Think About It!");
        $(".timer-description").show();
        $("#questionSpace").html(question.question);
    }, 1000);

    for (var j = 0; j < 14; j++) {
        function updateBar(i) {
            setTimeout(() => {
                $(".progress-bar").attr("style", "width: " + (100 / 13) * i + "%");
            }, i * 1000);
        }
        updateBar(j);
    }

    // show possible answers
    setTimeout(() => {
        $("#description").html("Answer!");
        $(".progress-bar").attr("style", "width: " + 0 + "%");
        for (var j = 0; j < 15; j++) {
            function updateBar(i) {
                setTimeout(() => {
                    $(".progress-bar").attr("style", "width: " + (100 / 14) * i + "%");
                }, i * 1000);
            }
            updateBar(j);
        }
    }, 15000);


    setTimeout(() => {
        $("#possibleAnswers").show();
        $(".answerSpace").html("");

        let poss = question.possibleAnswers;

        poss = shuffle(poss);

        poss.forEach((element, i) => {
            $(".answerSpace").append(`<div id='${i}' class='col-6 center card answerChoice' onclick="answerQuestion('${element}', ${i})"><div class='my-auto'>${element}</div></div>`);
        });

    }, 15000);

    //show results

    setTimeout(() => {
        $("#questionResults").show();

        let answered = false;
        let answerDescription = "";
        let points = 0;

        for (let i = 0; i < questionResult.answers.length; i++) {
            if (questionResult.answers[i].user == sID) {
                answered = true;
                answerDescription = questionResult.answers[i].correct;
                points = questionResult.answers[i].points;
                break;
            }
        }

        if (answered) {
            if (answerDescription) {
                $("#resultDescription").html("Correct!");
            }
            else {
                $("#resultDescription").html("Wrong!");
            }
        }
        else {
            $("#resultDescription").html("Did not answer!");
        }

        $("#numPoints").show();
        $("#numPoints").html(points + " points");

        for (let i = 0; i < questionResult.sessions.length; i++) {
            if (questionResult.sessions[i].sessionID == sID) {
                score = questionResult.sessions[i].score;
            }
        }

        questionResult.sessions.sort(function (a, b) {
            return b.score - a.score;
        });

        $(".panel-leaderBoard").html("");

        for (let i = 0; i < questionResult.sessions.length; i++) {
            if (i == 3) {
                break;
            }

            $(".panel-leaderBoard").append(`<div class="panel-body leaderBoard rounded mt-3 shadow">${questionResult.sessions[i].sessionID} : ${questionResult.sessions[i].score}</div>`);
        }

        $("#score").html("Score:" + score);

        $("#possibleAnswers").hide();
        $("#description").html("");
        $("#timer").hide();
        $("#question").hide();
    }, 31000);

    setTimeout(() => {
        $("#question").hide();
        $("#possibleAnswers").hide();
        $("#results").hide();
    }, 40000);

}

function leave() {
    window.location.replace("http://localhost:8080/multiplayer");
}

function done() {
    $("#question").hide();
    $("#timer").hide();
    $("#questionResults").show();
    $("#questionResult").hide();
    $(".timer-description").show();
    $("#questionSpace").hide(question.question);

    for (let i = 0; i < questionResult.sessions.length; i++) {
        if (questionResult.sessions[i].sessionID == sID) {
            score = questionResult.sessions[i].score;
        }
    }

    $("#numPoints").hide();
    $("#description").show();
    $("#description").html("Final Score: " + score);

    $("#score").html("Score:" + score);
}

function handleResult(result) {
    console.log(result);
    questionResult = result;
}

function answerQuestion(answer, i) {
    let quizAnswer = JSON.stringify({
        answer: answer,
        user: sID
    });

    stompClient.send(`/app/quiz/answers/${rID}`, {}, quizAnswer);

    $(`#${i}`).attr("class", "active col-6 center card answerChoice");
    $('.answerChoice').attr("onclick", "");
}

function getResults(results) {

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
    $("#send").click(function () { sendName(roomID); });
});