document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("check-button").addEventListener("click", checkAnswer);

let numbersToRemember = [];
let timerInterval;
let timeLeft = 5;
let totalCorrectAnswers = 0;
let totalIncorrectAnswers = 0;
let selectedCount = 0;

function startGame() {
    const startBtn = document.getElementById("start-button");
    const resultContainer = document.getElementById("result-container");
    const gameContainer = document.getElementById("game-container");
    const checkBtn = document.getElementById("check-button");
    const numberOptions = document.getElementById("number-options");

    startBtn.style.display = "none";
    resultContainer.innerHTML = "";
    startTimer();

    const uniqueNumbers = generateUniqueNumbers(5, 0, 9);
    numbersToRemember = [...uniqueNumbers];

    gameContainer.innerHTML = numbersToRemember.join("<br>");
    gameContainer.style.display = "block";

    setTimeout(() => {
        stopTimer();
        gameContainer.style.display = "none";
        checkBtn.style.display = "block";
        numberOptions.innerHTML = "";

        for (let i = 0; i < 10; i++) {
            const label = document.createElement("label");
            label.classList.add("list-group-item");

            const input = document.createElement("input");
            input.classList.add("form-check-input", "me-1");
            input.type = "checkbox";
            input.value = i;

            input.addEventListener("change", () => {
                if (input.checked) {
                    selectedCount++;
                } else {
                    selectedCount--;
                }

                if (selectedCount >= 5) {
                    disableRemainingCheckboxes();
                } else {
                    enableAllCheckboxes();
                }
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${i}`));
            numberOptions.appendChild(label);
        }

        document.getElementById("number-list").style.display = "block";
    }, 5000);
}

function startTimer() {
    const timerElement = document.getElementById("timer");
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `00:0${timeLeft}`;
        if (timeLeft <= 0) stopTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timeLeft = 5;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "00:05";
    timerElement.style.display = "none";
}

function disableRemainingCheckboxes() {
    const checkboxes = document.querySelectorAll("#number-options input:not(:checked)");
    checkboxes.forEach((checkbox) => {
        checkbox.disabled = true;
    });
}

function enableAllCheckboxes() {
    const checkboxes = document.querySelectorAll("#number-options input");
    checkboxes.forEach((checkbox) => {
        checkbox.disabled = false;
    });
}

function checkAnswer() {
    const numberList = document.getElementById("number-list");
    const checkButton = document.getElementById("check-button");

    if (numberList.style.display === "block") {
        const selectedNumbers = Array.from(document.querySelectorAll("#number-options input:checked"))
            .map(input => parseInt(input.value));
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedNumbers.length; i++) {
            if (numbersToRemember.includes(selectedNumbers[i])) {
                correctCount++;
                totalCorrectAnswers++;
                console.log(totalCorrectAnswers);
            } else {
                incorrectCount++;
                totalIncorrectAnswers++;
                console.log(incorrectCount);
            }
        }
        const resultContainer = document.getElementById("result-container");
        resultContainer.innerHTML = `Верных ответов: ${correctCount}<br>Неверных ответов: ${incorrectCount}`;
        checkButton.disabled = true;

        setTimeout(() => {
            checkButton.disabled = false;
            checkButton.removeEventListener("click", checkAnswer);
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