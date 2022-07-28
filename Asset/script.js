var startQuizBtn = document.getElementById("start-quiz");
var timerClock;

var questionBank = [
{   index: 0,
    question: "String values must be enclosed within ______ when being assigned to variables.",
    answer: 
       [ "commas",
     "curly brackets",
     "quotes",
     "parenthesis"]
    ,
    correctAnswer: "quotes"
},
{   index: 1,
    question: "A very useful tool used during development and debugging for printing content to the debugger is:",
    answer: 
    ["JavaScript",
    "terminal/bash",
    "for loops",
    "console.log"]
    ,
    correctAnswer: "console.log"
},
{   index: 2,
    question: "The condition in an if / else statement is enclosed with ______",
    answer: [
        "quotes",
        "curly brackets",
        "parenthesis",
        "square brackets"
    ],
    correctAnswer: "curly brackets"
},
{   index: 3,
    question: "Commonly used data types DO NOT include:",
    answer: [
        "strings",
        "booleans",
        "alerts",
        "numbers"
    ],
    correctAnswer: "alerts"
},
{   index: 4,
    question: "Arrays in JavaScript can be used to store ______.",
    answer: [
        "numbers and strings",
        "other arrays",
        "booleans",
        "all of the above"
    ],
    correctAnswer: "all of the above"
}
]



var questionIndex = 0;

//timer


var timer = document.getElementById("clock")

var startQuiz = function () {
    document.querySelector(".greeting-card").classList.add("hide");
    document.querySelector(".quiz-container").classList.remove("hide");
    buildQuiz(questionIndex);
    countDown();
}

var countDown = function () {
    secondsLeft = 60;
    timerClock = setInterval(function () {
        secondsLeft--;
        timer.textContent = "Time Left: " + secondsLeft;
    
        if (secondsLeft === 0) {
            clearInterval(timerClock);
            document.querySelector(".quiz-container").classList.add("hide");
            document.querySelector(".submit-initial-card").classList.remove("hide");
        } 

    },1000);
    
}


startQuizBtn.addEventListener('click', startQuiz);


//score
var score = 0;

var question = document.getElementById("question");
var answerOne = document.getElementById("option1");
var answerTwo = document.getElementById("option2");
var answerThree = document.getElementById("option3");
var answerFour = document.getElementById("option4");

var cardQuizEl = document.querySelector(".quiz-card")

var buildQuiz = function () {
    cardQuizEl.innerHTML="";

    for (var j = 0; j < questionBank[questionIndex].answer.length; j++) {
        var button = document.createElement("button");
        button.textContent = questionBank[questionIndex].answer[j];
        cardQuizEl.append(button);
    }
    
    question.textContent = questionBank[questionIndex].question;
}

var answerCheck = function(event){
    if (event.target.matches("button")) {
        if (event.target.textContent === questionBank[questionIndex].correctAnswer) {
            correctPrompt();
            nextQuestion();
            scoreUp();
        } else { 
            incorrectPrompt();
            nextQuestion();}
    }
}

cardQuizEl.addEventListener("click", answerCheck)


var nextQuestion = function () {
    questionIndex++;
    if (questionIndex === questionBank.length) {
        clearInterval(timerClock);
        document.querySelector(".quiz-container").classList.add("hide");
        document.querySelector(".submit-initial-card").classList.remove("hide");
    } else { buildQuiz();}

}

var prompt = document.getElementById("prompt");

var scoreUp = function () {
    score = score+20;
    setScore();
}

function setScore() {
    showFinalScore.textContent = "Your final score is " + score;}


var correctPrompt = function () {
    prompt.textContent = "Correct";
    prompt.setAttribute("style", "color: green");
}

var incorrectPrompt = function () {
    prompt.textContent = "Incorrect";
    prompt.setAttribute("style", "color: red")
    secondsLeft = secondsLeft - 10;
}

// Submit Initial
var showFinalScore = document.getElementById("show-final-score");
setScore();

var submitEl = document.getElementById("submit")
var initialEl = document.getElementById("initial")
var scoreFormEl = document.getElementById("score-form")
var scoreListEl = document.getElementById("score-list")




//submit score into local storage
var storeScore = function (event) {
    var scoreBoard = JSON.parse(localStorage.getItem("score")) || []
    
    if (event) {
    event.preventDefault();

    var scoreItem = {
        name: initialEl.value.trim(),
        scoreValue: score
    }


    scoreBoard.push(scoreItem)
    localStorage.setItem("score", JSON.stringify(scoreBoard))

    if (initialEl === "") {
        return;
    }


    document.querySelector(".submit-initial-card").classList.add("hide");
    document.querySelector(".score-card").classList.remove("hide");
    }

    renderScores(scoreBoard)
}

submitEl.addEventListener("click", storeScore)

//render score from local storage to scoreboard

function renderScores(scoreBoard) {

    scoreBoard.sort((a,b) => b.scoreValue - a.scoreValue); // b - a for reverse sort
    if (scoreBoard.length === 0) {
        scoreListEl.innerHTML="";
    } else {
    for (var i=0; i < scoreBoard.length; i++) {
        var scoreInfo = scoreBoard[i];
        console.log(scoreInfo)
        var li = document.createElement("li");
        li.textContent = scoreInfo.name + "-----" + scoreInfo.scoreValue;
        scoreListEl.appendChild(li);
    }}
}

var goBackEl = document.getElementById("go-back")
var clearScore = document.getElementById("clear-score")

var restart = function () {
    window.location.reload()
}
goBackEl.addEventListener("click", restart)

clearScore.addEventListener("click", function(){
    localStorage.clear();
    storeScore()
})
