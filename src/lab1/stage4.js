let symbolsToRemember4 = [];
let symbolTimerInterval4;
let symbolTimeLeft4 = 5;

function startFourthStage() {
    document.getElementById("number-list").style.display = "none";
    document.getElementById("symbol-list").style.display = "none";
    document.getElementById("start-button").style.display = "none";
    document.getElementById("check-button").style.display = "none";
    document.getElementById("result-container").innerHTML = "";

    // Generate symbols with the desired color based on the number of characters
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
    for (let i = 0; i < symbols.length; i++) {
        symbolOptions.innerHTML += `<li><label><input type="checkbox" value="${symbols[i]}"> ${symbols[i]}</label></li>`;
    }

    document.getElementById("symbol-list").style.display = "block";
    document.getElementById("check-button").style.display = "block";
    document.getElementById("check-button").addEventListener("click", checkSymbolSelection);
}

function checkSymbolSelection() {
    if (document.getElementById("symbol-list").style.display === "block") {
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
