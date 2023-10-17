let symbolsToRemember4 = [];
let symbolTimerInterval4;
let symbolTimeLeft4 = 5;

function startFourthStage() {
    const numberList = document.getElementById("number-list");
    const symbolList = document.getElementById("symbol-list");
    const startButton = document.getElementById("start-button");
    const checkButton = document.getElementById("check-button");
    const resultContainer = document.getElementById("result-container");

    numberList.style.display = "none";
    symbolList.style.display = "none";
    startButton.style.display = "none";
    checkButton.style.display = "none";
    resultContainer.innerHTML = "";

    const symbolsToRemember4 = generateRandomSymbols(5);
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = symbolsToRemember4.map(symbol => {
        const textColor = symbol.length % 2 === 0 ? "red" : "lightcoral";
        return `<span style="color: ${textColor};">${symbol}</span>`;
    }).join("<br>");

    gameContainer.style.display = "block";

    setTimeout(() => {
        gameContainer.style.display = "none";
        showSymbolSelection();
    }, 5000);
}

function startSymbolTimer4() {
    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Время: 5 секунд";
    symbolTimeLeft4 = 5;
    symbolTimerInterval4 = setInterval(() => {
        symbolTimeLeft4--;
        timerElement.innerHTML = `Время: ${symbolTimeLeft4} секунд`;
        if (symbolTimeLeft4 <= 0) {
            stopSymbolTimer4();
        }
    }, 1000);
}

function stopSymbolTimer4() {
    clearInterval(symbolTimerInterval4);
    symbolTimeLeft4 = 5;
    document.getElementById("timer").innerHTML = "Время: 5 секунд";
}

function showSymbolSelection() {
    const symbolOptions = document.getElementById("symbol-options");
    symbolOptions.innerHTML = "";

    const symbols = ["*", "**", "***", "****", "*****", "******", "*******", "********", "*********", "**********"];

    symbols.forEach(symbol => {
        const listItem = document.createElement("li");
        const label = document.createElement("label");
        const input = document.createElement("input");
        const text = document.createTextNode(symbol);

        input.type = "checkbox";
        input.value = symbol;
        label.appendChild(input);
        label.appendChild(text);
        listItem.appendChild(label);
        symbolOptions.appendChild(listItem);
    });

    document.getElementById("symbol-list").style.display = "block";
    document.getElementById("check-button").style.display = "block";
    document.getElementById("check-button").addEventListener("click", checkSymbolSelection);
}

function checkSymbolSelection() {
    const symbolList = document.getElementById("symbol-list");
    if (symbolList.style.display === "block") {
        const selectedSymbols = Array.from(document.querySelectorAll("#symbol-options input:checked"))
            .map(input => input.value);
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedSymbols.length; i++) {
            if (symbolsToRemember4.includes(selectedSymbols[i])) {
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
            startFifthStage();
        }, 2000);
    }
}
