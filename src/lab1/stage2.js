let symbolsToRemember = [];
let symbolTimerInterval;
let symbolTimeLeft = 5;

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
            symbolOptions.innerHTML += `<li><label><input type="checkbox" value="${symbol}"> ${symbol}</label></li>`;
        });

        document.getElementById("symbol-list").style.display = "block";
        checkButton.addEventListener("click", checkSymbolAnswer);
    }, 5000);
}

function startSymbolTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "Время: 5 секунд";
    symbolTimeLeft = 5;
    symbolTimerInterval = setInterval(() => {
        symbolTimeLeft--;
        timerElement.textContent = `Время: ${symbolTimeLeft} секунд`;
        if (symbolTimeLeft <= 0) {
            stopSymbolTimer();
        }
    }, 1000);
}

function stopSymbolTimer() {
    clearInterval(symbolTimerInterval);
    symbolTimeLeft = 5;
    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Время: 5 секунд";
}

function checkSymbolAnswer() {
    const symbolList = document.getElementById("symbol-list");
    if (symbolList.style.display === "block") {
        const selectedSymbols = Array.from(document.querySelectorAll("#symbol-options input:checked"))
            .map(input => input.value);
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedSymbols.length; i++) {
            if (symbolsToRemember.includes(selectedSymbols[i])) {
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
            startThirdStage();
        }, 2000);
    }
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