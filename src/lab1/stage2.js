let symbolsToRemember = [];
let symbolTimerInterval;
let symbolTimeLeft = 5;
let selectedSymbolCount = 0;

function startSecondStage() {
    const numberList = document.getElementById("number-list");
    const symbolList = document.getElementById("symbol-list");
    const startButton = document.getElementById("start-button");
    const checkButton = document.getElementById("check-button");
    const resultContainer = document.getElementById("result-container");
    const gameContainer = document.getElementById("game-container");

    numberList.style.display = "none";
    symbolList.style.display = "none";
    startButton.style.display = "none";
    checkButton.style.display = "none";
    resultContainer.innerHTML = "";
    startSymbolTimer();

    symbolsToRemember = generateRandomSymbols(5);
    gameContainer.innerHTML = symbolsToRemember.join("<br>");
    gameContainer.style.display = "block";

    checkButton.removeEventListener("click", checkSymbolAnswer);

    setTimeout(() => {
        stopSymbolTimer();
        gameContainer.style.display = "none";
        checkButton.style.display = "block";

        const symbolOptions = document.getElementById("symbol-options");
        symbolOptions.innerHTML = "";

        const symbols = ["*", "**", "***", "****", "*****", "******", "*******", "********", "*********", "**********"];

        symbols.forEach(symbol => {
            const label = document.createElement("label");
            label.classList.add("list-group-item");

            const input = document.createElement("input");
            input.classList.add("form-check-input", "me-1");
            input.type = "checkbox";
            input.value = symbol;

            input.addEventListener("change", () => {
                if (input.checked) {
                    selectedSymbolCount++;
                } else {
                    selectedSymbolCount--;
                }

                if (selectedSymbolCount >= 5) {
                    disableRemainingSymbolCheckboxes();
                } else {
                    enableAllSymbolCheckboxes();
                }
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${symbol}`));
            symbolOptions.appendChild(label);
        });

        document.getElementById("symbol-list").style.display = "block";
        checkButton.addEventListener("click", checkSymbolAnswer);
    }, 5000);
}

function startSymbolTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.style.display = "block";
    timerElement.textContent = "00:05";
    symbolTimeLeft = 5;
    symbolTimerInterval = setInterval(() => {
        symbolTimeLeft--;
        timerElement.textContent = `00:0${symbolTimeLeft}`;
        if (symbolTimeLeft <= 0) {
            stopSymbolTimer();
        }
    }, 1000);
}

function stopSymbolTimer() {
    clearInterval(symbolTimerInterval);
    symbolTimeLeft = 5;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "00:05";
    timerElement.style.display = "none";
}

function checkSymbolAnswer() {
    const symbolList = document.getElementById("symbol-list");
    const checkButton = document.getElementById("check-button");

    if (symbolList.style.display === "block") {
        const selectedSymbols = Array.from(document.querySelectorAll("#symbol-options input:checked"))
            .map(input => input.value);
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedSymbols.length; i++) {
            if (symbolsToRemember.includes(selectedSymbols[i])) {
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
            checkButton.removeEventListener("click", checkSymbolAnswer);
            startThirdStage();
        }, 2000);
    }
}

function disableRemainingSymbolCheckboxes() {
    const remainingCheckboxes = document.querySelectorAll("#symbol-options input:not(:checked)");
    remainingCheckboxes.forEach((checkbox) => {
        checkbox.disabled = true;
    });
}

function enableAllSymbolCheckboxes() {
    const allCheckboxes = document.querySelectorAll("#symbol-options input");
    allCheckboxes.forEach((checkbox) => {
        checkbox.disabled = false;
    });
}

function generateRandomSymbols(count) {
    const symbols = ["*", "**", "***", "****", "*****", "******", "*******", "********", "*********", "**********"];
    const randomIndices = new Set();
    const randomSymbols = [];

    while (randomIndices.size < count) {
        const randomIndex = Math.floor(Math.random() * symbols.length);

        if (!randomIndices.has(randomIndex)) {
            randomIndices.add(randomIndex);
            randomSymbols.push(symbols[randomIndex]);
        }
    }

    return randomSymbols;
}