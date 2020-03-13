var stompClient = null;
var interval = null;
let rID = null;
let sID = null;
let quiz = null;
let timeTaken  = 0;
let currentCorrectAnswer = '';

let answers = [];

function connect(roomID) {
    let socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        let socketId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];

        $("#roomID").html("Game Pin: " + roomID);

        stompClient.subscribe(`/topic/quiz/${roomID}`, function (sessions) {
            showGreeting(JSON.parse(sessions.body));
        });

        stompClient.subscribe(`/topic/quiz/answers/${roomID}`, function (response) {
            handleAnsweredQuestionResponse(JSON.parse(response.body));
        });

        stompClient.subscribe(`/topic/quiz/questionroundsessions/${roomID}`, function (response) {
            handleQuestionRoundSessions(JSON.parse(response.body));
        });

        
        stompClient.subscribe('/topic/questions-response', function (response) {
            let result = JSON.parse(response.body);
            let question = [];
            let correctAnswer = [];
            let wrongAnswer = [];

            result.results.forEach((ques, i) => {
                question.push(ques.question);
                correctAnswer.push([ques.correct_answer]);
                wrongAnswer.push(ques.incorrect_answers);
            });

            quiz = {
                numberOfQuestions: 0,
                questions: question,
                correctAnswers: correctAnswer,
                wrongAnswers: wrongAnswer,
                roomID: rID
            }
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
    }, function(message) {
        window.location.replace("http://localhost:8080/multiplayer/quizSetup");
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

function handleAnswer(answer) {
    console.log(answer);
}


function startQuiz() {
    if(quiz == null) {
        alert("Enter quiz details");
        window.location.replace("http://localhost:8080/multiplayer/quizSetup");
    }
    let room = JSON.stringify({
        roomID: rID
    });

    begin(quiz);
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

function handleStartQuizRepsonse() {
    begin(quiz);
}

function timer() {
    for(var k = 0; k < 40; k++) {
        function timer(i) {
            setTimeout(() => {
                timeTaken = i -15;
            }, i * 1000);
        }
        timer(k);
    }
}

function initAnswers() {
    ansers = [];
    // answers.push({
    //     user: '',
    //     points: 0,
    //     correct: false
    // });
}

//  send results

function gatherResults() {
    let room = JSON.stringify({
        roomID: rID    
    });

    setTimeout(() => {
        stompClient.send(`/app/quiz/questionroundsessions/${rID}`, {}, room);
    },30000);
}

function handleQuestionRoundSessions(sessions) {
    let result = JSON.stringify({
        sessions: sessions,
        answers: answers
    });

    stompClient.send(`/app/quiz/sendscoreresult/${rID}`, {}, result);
  
}

function begin(quiz) {
    for(var j = 0; j < quiz.questions.length; j++) {
        function send(i) {
            setTimeout(() => {
                timer();
                gatherResults();
                initAnswers();
                answers = [];
                currentCorrectAnswer = quiz.correctAnswers[i];

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

function updateScore(user, points) {
    let score = JSON.stringify({
        user: user,
        score: 0,
        pointsGained: points
    });

    stompClient.send(`/app/quiz/updatescore/${rID}`, {}, score);
}

function handleAnsweredQuestionResponse(answer) {
    let points = 0;
    let correct  = false;

    if(answer.answer == currentCorrectAnswer) {
        points = (15 - timeTaken) * 73;
        correct = true;
    }

    answers.push({
        user: answer.user,
        points: points,
        correct: correct
    });

    updateScore(answer.user, points);
}

function handleResultsRequest() {

}

function sendResults() {

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