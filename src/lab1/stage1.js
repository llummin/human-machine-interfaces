document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("check-button").addEventListener("click", checkAnswer);

let uniqueNumbersToRemember = [];
let numbersToRemember = [];
let timerInterval;
let timeLeft = 5;
let totalCorrectAnswers = 0;
let totalIncorrectAnswers = 0;


function startGame() {
    document.getElementById("start-button").style.display = "none";
    document.getElementById("result-container").innerHTML = "";
    startTimer();
    uniqueNumbersToRemember = generateUniqueNumbers(5, 0, 9);
    numbersToRemember = [...uniqueNumbersToRemember]; // Копируем уникальные цифры в массив, который нужно запомнить
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = numbersToRemember.join("<br>");
    gameContainer.style.display = "block";
    setTimeout(() => {
        stopTimer();
        gameContainer.style.display = "none";
        document.getElementById("check-button").style.display = "block";
        const numberOptions = document.getElementById("number-options");
        numberOptions.innerHTML = "";
        for (let i = 0; i < 10; i++) {
            numberOptions.innerHTML += `<li><label><input type="checkbox" value="${i}"> ${i}</label></li>`;
        }
        document.getElementById("number-list").style.display = "block";
    }, 5000);
}

function startTimer() {
    // Начинаем отсчет времени и обновляем таймер каждую секунду
    const timerElement = document.getElementById("timer");
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `Время: ${timeLeft} секунд`;
        if (timeLeft <= 0) {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timeLeft = 5;
    document.getElementById("timer").innerHTML = "Время: 5 секунд";
}

function checkAnswer() {
    if (document.getElementById("number-list").style.display === "block") {
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
        uniqueNumbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(uniqueNumbers);
}