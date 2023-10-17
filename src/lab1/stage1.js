document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("check-button").addEventListener("click", checkAnswer);

let numbersToRemember = [];
let timerInterval;
let timeLeft = 5;
let totalCorrectAnswers = 0;
let totalIncorrectAnswers = 0;


function startGame() {
    const startButton = document.getElementById("start-button");
    const resultContainer = document.getElementById("result-container");
    const gameContainer = document.getElementById("game-container");
    const checkButton = document.getElementById("check-button");
    const numberOptions = document.getElementById("number-options");

    startButton.style.display = "none";
    resultContainer.innerHTML = "";
    startTimer();
    const uniqueNumbers = generateUniqueNumbers(5, 0, 9);
    numbersToRemember = [...uniqueNumbers];
    gameContainer.innerHTML = numbersToRemember.join("<br>");
    gameContainer.style.display = "block";

    setTimeout(() => {
        stopTimer();
        gameContainer.style.display = "none";
        checkButton.style.display = "block";
        numberOptions.innerHTML = "";

        for (let i = 0; i < 10; i++) {
            numberOptions.innerHTML += `<li><label><input type="checkbox" value="${i}"> ${i}</label></li>`;
        }

        document.getElementById("number-list").style.display = "block";
    }, 5000);
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Время: ${timeLeft} секунд`;
        if (timeLeft <= 0) stopTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timeLeft = 5;
    document.getElementById("timer").textContent = "Время: 5 секунд";
}

function checkAnswer() {
    const numberList = document.getElementById("number-list");
    if (numberList.style.display === "block") {
        const selectedNumbers = Array.from(document.querySelectorAll("#number-options input:checked"))
            .map(input => parseInt(input.value, 10));
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedNumbers.length; i++) {
            if (numbersToRemember.includes(selectedNumbers[i])) {
                correctCount++;
                totalCorrectAnswers++;
            } else {
                incorrectCount++;
                totalIncorrectAnswers++;
            }
        }
        const resultContainer = document.getElementById("result-container");
        resultContainer.innerHTML = `Верных ответов: ${correctCount}<br>Неверных ответов: ${incorrectCount}`;
        setTimeout(() => {
            startSecondStage();
        }, 2000);
    }
}

function generateUniqueNumbers(count, min, max) {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < count) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        uniqueNumbers.add(randomNumber);
    }
    return Array.from(uniqueNumbers);
}