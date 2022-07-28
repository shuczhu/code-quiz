var questionBank = [
    {
        question: "String values must be enclosed within ______ when being assigned to variables.",
        answer:
            ["commas",
             "curly brackets",
             "quotes",
             "parenthesis"]
        ,
        correctAnswer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answer:
            ["JavaScript",
             "terminal/bash",
             "for loops",
             "console.log"]
        ,
        correctAnswer: "console.log"
    },
    {
        question: "The condition in an if / else statement is enclosed with ______",
        answer: [
            "quotes",
            "curly brackets",
            "parenthesis",
            "square brackets"
        ],
        correctAnswer: "curly brackets"
    },
    {
        question: "Commonly used data types DO NOT include:",
        answer: [
            "strings",
            "booleans",
            "alerts",
            "numbers"
        ],
        correctAnswer: "alerts"
    },
    {
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

var startQuizBtn = document.getElementById("start-quiz");
var questionIndex = 0;
var timer = document.getElementById("clock")
var timerClock;
var score = 0;
var question = document.getElementById("question");
var cardQuizEl = document.querySelector(".quiz-card")
var prompt = document.getElementById("prompt");
var showFinalScore = document.getElementById("show-final-score");
var submitEl = document.getElementById("submit")
var initialEl = document.getElementById("initial")
var scoreFormEl = document.getElementById("score-form")
var scoreListEl = document.getElementById("score-list")
var goBackEl = document.getElementById("go-back")
var clearScore = document.getElementById("clear-score")

//create a shuffle function to randomize order of questions and answers. 
function shuffle(arr) {
    var currentIndex = arr.length;
    var randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];

    }

    return arr;
}

//startQuiz function for when start quiz button is clicked 
var startQuiz = function () {
    document.querySelector(".greeting-card").classList.add("hide");
    document.querySelector(".quiz-container").classList.remove("hide");
    shuffle(questionBank);
    buildQuiz();
    countDown();
}

//timer for count down 
var countDown = function () {
    secondsLeft = 60;
    timer.textContent = "Time Left: " + secondsLeft;
    timerClock = setInterval(function () {
        secondsLeft--;
        timer.textContent = "Time Left: " + secondsLeft;

        if (secondsLeft === 0) {
            clearInterval(timerClock);
            document.querySelector(".quiz-container").classList.add("hide");
            document.querySelector(".submit-initial-card").classList.remove("hide");
        }

    }, 1000);

}

startQuizBtn.addEventListener('click', startQuiz);

//generate questions and answers from questionBank
var buildQuiz = function () {
    cardQuizEl.innerHTML = "";

    question.textContent = questionBank[questionIndex].question;

    shuffle(questionBank[questionIndex].answer);

    for (var j = 0; j < questionBank[questionIndex].answer.length; j++) {
        var button = document.createElement("button");
        button.textContent = questionBank[questionIndex].answer[j];
        cardQuizEl.append(button);
    }
}

//verifying if the answer is correct
var answerCheck = function (event) {
    if (event.target.matches("button")) {
        if (event.target.textContent === questionBank[questionIndex].correctAnswer) {
            correctPrompt();
            nextQuestion();
            scoreUp();
        } else {
            incorrectPrompt();
            nextQuestion();
        }
    }
}

cardQuizEl.addEventListener("click", answerCheck)

//moving on to the next question
var nextQuestion = function () {
    questionIndex++;
    if (questionIndex === questionBank.length) {
        clearInterval(timerClock);
        document.querySelector(".quiz-container").classList.add("hide");
        document.querySelector(".submit-initial-card").classList.remove("hide");
    } else { buildQuiz(); }

}

//increasing in score
var scoreUp = function () {
    score = score + 20;
    setScore();
}

//updating score 
function setScore() {
    showFinalScore.textContent = "Your final score is " + score;
}


//prompting correct / incorrect answers
var correctPrompt = function () {
    prompt.textContent = "Correct";
    prompt.setAttribute("style", "color: green");
}

var incorrectPrompt = function () {
    prompt.textContent = "Incorrect";
    prompt.setAttribute("style", "color: red")
    secondsLeft = secondsLeft - 10;
}


setScore();


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

    //sort scoreboard in descending order
    scoreBoard.sort((a, b) => b.scoreValue - a.scoreValue);

    //if scoreBoard from local storage is empty, clear score board displayed 
    if (scoreBoard.length === 0) {
        scoreListEl.innerHTML = "";
    } else {

        //generate scoreboard list to be displayed on scoreboard 
        for (var i = 0; i < scoreBoard.length; i++) {
            var scoreInfo = scoreBoard[i];
            var li = document.createElement("li");
            li.textContent = scoreInfo.name + "-----" + scoreInfo.scoreValue;
            scoreListEl.appendChild(li);
        }
    }
}

//restart button
var restart = function () {
    window.location.reload()
}
goBackEl.addEventListener("click", restart)

//clear score button
clearScore.addEventListener("click", function () {
    localStorage.clear();
    storeScore()
})
