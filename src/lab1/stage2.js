let symbolsToRemember = [];
let symbolTimerInterval;
let symbolTimeLeft = 5;

function startSecondStage() {
    document.getElementById("number-list").style.display = "none";
    document.getElementById("symbol-list").style.display = "none";
    document.getElementById("start-button").style.display = "none";
    document.getElementById("check-button").style.display = "none";
    document.getElementById("result-container").innerHTML = "";
    startSymbolTimer();
    symbolsToRemember = generateRandomSymbols(5);
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = symbolsToRemember.join("<br>");
    gameContainer.style.display = "block";
    document.getElementById("check-button").removeEventListener("click", checkSymbolAnswer);
    setTimeout(() => {
        stopSymbolTimer();
        gameContainer.style.display = "none";
        document.getElementById("check-button").style.display = "block";
        const symbolOptions = document.getElementById("symbol-options");
        symbolOptions.innerHTML = "";
        const symbols = ["*", "**", "***", "****", "*****", "******", "*******", "********", "*********", "**********"];
        for (let i = 0; i < symbols.length; i++) {
            symbolOptions.innerHTML += `<li><label><input type="checkbox" value="${symbols[i]}"> ${symbols[i]}</label></li>`;
        }
        document.getElementById("symbol-list").style.display = "block";
        document.getElementById("check-button").addEventListener("click", checkSymbolAnswer);
    }, 5000);
}


function startSymbolTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Время: 5 секунд"; // Сбрасываем таймер
    symbolTimeLeft = 5;
    symbolTimerInterval = setInterval(() => {
        symbolTimeLeft--;
        timerElement.innerHTML = `Время: ${symbolTimeLeft} секунд`;
        if (symbolTimeLeft <= 0) {
            stopSymbolTimer();
        }
    }, 1000);
}

function stopSymbolTimer() {
    clearInterval(symbolTimerInterval);
    symbolTimeLeft = 5;
    document.getElementById("timer").innerHTML = "Время: 5 секунд";
}

function checkSymbolAnswer() {
    if (document.getElementById("symbol-list").style.display === "block") {
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