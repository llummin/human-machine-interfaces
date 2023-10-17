let symbolsToRemember4 = [];
let symbolTimerInterval4;
let symbolTimeLeft4 = 5;
let selectedSymbolCount4 = 0;

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

    startSymbolTimer4();

    symbolsToRemember4 = generateRandomSymbols(5);
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
    timerElement.style.display = "block";
    timerElement.innerHTML = "00:05";
    symbolTimeLeft4 = 5;
    symbolTimerInterval4 = setInterval(() => {
        symbolTimeLeft4--;
        timerElement.innerHTML = `00:0${symbolTimeLeft4}`;
        if (symbolTimeLeft4 <= 0) {
            stopSymbolTimer4();
        }
    }, 1000);
}

function stopSymbolTimer4() {
    clearInterval(symbolTimerInterval4);
    symbolTimeLeft4 = 5;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "00:05";
    timerElement.style.display = "none";
}

function showSymbolSelection() {
    enableAllSymbolCheckboxes4();
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
            const symbolText = label.querySelector("span");

            if (input.checked) {
                selectedSymbolCount4++;
                symbolText.style.color = "black";
            } else {
                selectedSymbolCount4--;
                symbolText.style.color = "initial";
            }

            if (selectedSymbolCount4 >= 5) {
                disableRemainingSymbolCheckboxes4();
            } else {
                enableAllSymbolCheckboxes4();
            }
        });

        label.appendChild(input);
        label.innerHTML += `<span style="color: black;">${symbol}</span>`;
        symbolOptions.appendChild(label);
    });

    document.getElementById("symbol-list").style.display = "block";
    document.getElementById("check-button").style.display = "block";
    document.getElementById("check-button").addEventListener("click", checkSymbolSelection);
}

function disableRemainingSymbolCheckboxes4() {
    const remainingCheckboxes = document.querySelectorAll("#symbol-options input:not(:checked)");
    remainingCheckboxes.forEach((checkbox) => {
        checkbox.disabled = true;
    });
}

function enableAllSymbolCheckboxes4() {
    const allCheckboxes = document.querySelectorAll("#symbol-options input");
    allCheckboxes.forEach((checkbox) => {
        checkbox.disabled = false;
    });
}

function checkSymbolSelection() {
    const symbolList = document.getElementById("symbol-list");
    const checkButton = document.getElementById("check-button");

    if (symbolList.style.display === "block") {
        const selectedSymbols = Array.from(document.querySelectorAll("#symbol-options input:checked"))
            .map(input => input.value);
        let correctCount = 0;
        let incorrectCount = 0;
        for (let i = 0; i < selectedSymbols.length; i++) {
            if (symbolsToRemember4.includes(selectedSymbols[i])) {
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
            checkButton.removeEventListener("click", checkSymbolSelection);
            startFifthStage();
        }, 2000);
    }
}
