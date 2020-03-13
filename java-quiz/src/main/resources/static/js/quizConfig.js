var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    var questionRequest = {
        'numQuestions' : $("#quantity").val(),
        'category' : $("#trivia_category").val(),
        'difficulty' : $("#trivia_difficulty").val(),
        'type' : $("#trivia_type").val()
    }
    stompClient.send("/app/questions-request", {}, JSON.stringify(questionRequest));
}



$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#get_questions" ).click(function() { sendName(); });
    connect();
});

$(window).on("load", function(){
    $("#onLoad").hide();
    $(".loader-wrapper").fadeOut(1000);
    $("#onLoad").fadeIn(1000);
});

