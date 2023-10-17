let numbersToRemember1 = [];
let numberTimerInterval;
let numberTimeLeft = 5;
let selectedNumberCount = 0;

function startThirdStage() {
    const numberList = document.getElementById("number-list");
    const symbolList = document.getElementById("symbol-list");
    const startButton = document.getElementById("start-button");
    const checkButton = document.getElementById("check-button");
    const resultContainer = document.getElementById("result-container");
    const gameContainer = document.getElementById("game-container");

    resultContainer.innerHTML = "";

    numberList.style.display = "none";
    symbolList.style.display = "none";
    startButton.style.display = "none";
    checkButton.style.display = "none";
    gameContainer.style.display = "block";

    startNumberTimer();

    numbersToRemember1 = generateRandomNumbers(5);
    gameContainer.innerHTML = numbersToRemember1
        .map((number, index) => {
            const textColor = index < 3 ? "black" : "red";
            return `<span style="color: ${textColor};">${number}</span>`;
        })
        .join("<br>");

    setTimeout(() => {
        stopNumberTimer();

        gameContainer.style.display = "none";
        checkButton.style.display = "block";

        const numberOptions = document.getElementById("number-options");
        numberOptions.innerHTML = "";

        for (let i = 0; i < 10; i++) {
            const label = document.createElement("label");
            label.classList.add("list-group-item");

            const input = document.createElement("input");
            input.classList.add("form-check-input", "me-1");
            input.type = "checkbox";
            input.value = i.toString();

            input.addEventListener("change", () => {
                if (input.checked) {
                    selectedNumberCount++;
                } else {
                    selectedNumberCount--;
                }

                if (selectedNumberCount >= 5) {
                    disableRemainingNumberCheckboxes();
                } else {
                    enableAllNumberCheckboxes();
                }
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${i}`));
            numberOptions.appendChild(label);
        }

        numberList.style.display = "block";
        checkButton.addEventListener("click", checkNumberSelection);
    }, 5000);
}

function checkNumberSelection() {
    const numberList = document.getElementById("number-list");
    const checkButton = document.getElementById("check-button");

    if (numberList.style.display === "block") {
        const selectedNumbers = Array.from(document.querySelectorAll("#number-options input:checked"))
            .map(input => parseInt(input.value));
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedNumbers.length; i++) {
            if (numbersToRemember1.includes(selectedNumbers[i])) {
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
            checkButton.removeEventListener("click", checkNumberSelection);
            startFourthStage();
        }, 2000);
    }
}

function disableRemainingNumberCheckboxes() {
    const remainingCheckboxes = document.querySelectorAll("#number-options input:not(:checked)");
    remainingCheckboxes.forEach((checkbox) => {
        checkbox.disabled = true;
    });
}

function enableAllNumberCheckboxes() {
    const allCheckboxes = document.querySelectorAll("#number-options input");
    allCheckboxes.forEach((checkbox) => {
        checkbox.disabled = false;
    });
}

function startNumberTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.style.display = "block";
    timerElement.innerHTML = "00:05";
    numberTimeLeft = 5;
    numberTimerInterval = setInterval(() => {
        numberTimeLeft--;
        timerElement.innerHTML = `00:0${numberTimeLeft}`;
        if (numberTimeLeft <= 0) {
            stopNumberTimer();
        }
    }, 1000);
}

function stopNumberTimer() {
    clearInterval(numberTimerInterval);
    numberTimeLeft = 5;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "00:05";
    timerElement.style.display = "none";
}

function generateRandomNumbers(count) {
    const randomNumbers = new Set();
    while (randomNumbers.size < count) {
        const randomDigit = Math.floor(Math.random() * 10);
        randomNumbers.add(randomDigit);
    }
    return Array.from(randomNumbers);
}