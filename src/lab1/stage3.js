let numbersToRemember1 = [];
let numberTimerInterval;
let numberTimeLeft = 5;

function startThirdStage() {
    document.getElementById("number-list").style.display = "none";
    document.getElementById("symbol-list").style.display = "none";
    document.getElementById("start-button").style.display = "none";
    document.getElementById("check-button").style.display = "none";
    document.getElementById("result-container").innerHTML = "";
    startNumberTimer();
    numbersToRemember1 = generateRandomNumbers(5);
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = numbersToRemember1.map(number => {
        const textColor = numbersToRemember1.indexOf(number) < 3 ? "black" : "red";
        return `<span style="color: ${textColor};">${number}</span>`;
    }).join("<br>");
    gameContainer.style.display = "block";
    setTimeout(() => {
        stopNumberTimer();
        gameContainer.style.display = "none";
        document.getElementById("check-button").style.display = "block";
        const numberOptions = document.getElementById("number-options");
        numberOptions.innerHTML = "";
        for (let i = 0; i < 10; i++) {
            numberOptions.innerHTML += `<li><label><input type="checkbox" value="${i}"> ${i}</label></li>`;
        }
        document.getElementById("number-list").style.display = "block";
        document.getElementById("check-button").addEventListener("click", checkNumberSelection);
    }, 5000);
}

function checkNumberSelection() {
    if (document.getElementById("number-list").style.display === "block") {
        const selectedNumbers = Array.from(document.querySelectorAll("#number-options input:checked"))
            .map(input => parseInt(input.value));
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedNumbers.length; i++) {
            if (numbersToRemember1.includes(selectedNumbers[i])) {
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
            startFourthStage();
        }, 2000);
    }
}

function startNumberTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Время: 5 секунд";
    numberTimeLeft = 5;
    numberTimerInterval = setInterval(() => {
        numberTimeLeft--;
        timerElement.innerHTML = `Время: ${numberTimeLeft} секунд`;
        if (numberTimeLeft <= 0) {
            stopNumberTimer();
        }
    }, 1000);
}

function stopNumberTimer() {
    clearInterval(numberTimerInterval);
    numberTimeLeft = 5;
    document.getElementById("timer").innerHTML = "Время: 5 секунд";
}

function generateRandomNumbers(count) {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < count) {
        const randomDigit = Math.floor(Math.random() * 10);
        uniqueNumbers.add(randomDigit);
    }
    return Array.from(uniqueNumbers);
}
