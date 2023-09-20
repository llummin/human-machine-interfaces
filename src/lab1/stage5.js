let numbersAndSymbolsToRemember5 = [];
let numberSymbolTimerInterval5;
let numberSymbolTimeLeft5 = 5;
let colorMap = new Map();

function startFifthStage() {
    document.getElementById("number-symbol-list").style.display = "none";
    document.getElementById("symbol-list").style.display = "none";
    document.getElementById("number-list").style.display = "none";
    document.getElementById("start-button").style.display = "none";
    document.getElementById("check-button").style.display = "none";
    document.getElementById("result-container").innerHTML = "";
    startNumberSymbolTimer5();
    numbersAndSymbolsToRemember5 = generateUniqueRandomNumbersAndSymbols(5);
    const additionalRows = generateUniqueRandomNumbersAndSymbols(5, numbersAndSymbolsToRemember5);
    const gameContainer = document.getElementById("game-container");
    const sortedRows = sortRows(numbersAndSymbolsToRemember5);
    gameContainer.innerHTML = sortedRows.map(item => {
        const [number, symbols] = item;
        // Retrieve the colors for this combination or generate new ones if not yet assigned
        const textColor = colorMap.get(`${number}-${symbols}`) || generateRandomColor();
        const symbolColor = colorMap.get(`${number}-${symbols}`) || generateRandomSymbolColor();
        // Store the colors for this combination
        colorMap.set(`${number}-${symbols}`, textColor);
        colorMap.set(`${number}-${symbols}`, symbolColor);
        return `<span style="color: ${textColor};">${number}</span> <span style="color: ${symbolColor};">${symbols}</span>`;
    }).join("<br>");
    gameContainer.style.display = "block";
    setTimeout(() => {
        stopNumberSymbolTimer5();
        showNumberSymbolSelection(numbersAndSymbolsToRemember5, additionalRows); // Move this line inside the setTimeout
    }, 5000);
}


function startNumberSymbolTimer5() {
    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Time: 5 seconds";
    numberSymbolTimeLeft5 = 5;
    numberSymbolTimerInterval5 = setInterval(() => {
        numberSymbolTimeLeft5--;
        timerElement.innerHTML = `Time: ${numberSymbolTimeLeft5} seconds`;
        if (numberSymbolTimeLeft5 <= 0) {
            stopNumberSymbolTimer5();
        }
    }, 1000);
}

function stopNumberSymbolTimer5() {
    clearInterval(numberSymbolTimerInterval5);
    numberSymbolTimeLeft5 = 5;
    document.getElementById("timer").innerHTML = "Time: 5 seconds";
}

function generateUniqueRandomNumbersAndSymbols(count) {
    const numbersAndSymbols = new Set();
    while (numbersAndSymbols.size < count) {
        let number, symbols;
        do {
            number = Math.floor(Math.random() * 10);
            symbols = generateRandomSymbolsString();
        } while (numbersAndSymbols.has(`${number}-${symbols}`));
        numbersAndSymbols.add(`${number}-${symbols}`);
    }
    return [...numbersAndSymbols].map(row => {
        const [number, symbols] = row.split('-');
        return [parseInt(number), symbols];
    });
}

function generateRandomSymbolsString() {
    const symbols = ["*", "**", "***", "****", "*****"];
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function generateRandomColor() {
    const colors = ["green", "red", "blue", "black"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateRandomSymbolColor() {
    const colors = ["green", "red", "blue", "black"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showNumberSymbolSelection(rememberedRows, additionalRows) {
    const selectionOptions = document.getElementById("number-symbol-options");
    selectionOptions.innerHTML = "";
    const allRows = rememberedRows.concat(additionalRows);
    const sortedRows = sortRows(allRows);
    for (const item of sortedRows) {
        const [number, symbols] = item;
        const textColor = generateRandomColor();
        const symbolColor = generateRandomSymbolColor();
        selectionOptions.innerHTML += `<li><label><input type="checkbox" data-number="${number}" data-symbols="${symbols}"> <span style="color: ${textColor};">${number}</span> <span style="color: ${symbolColor};">${symbols}</span></label></li>`;
    }

    document.getElementById("number-list").style.display = "none";
    document.getElementById("number-symbol-list").style.display = "block";
    document.getElementById("check-button").style.display = "block";
    document.getElementById("check-button").addEventListener("click", checkNumberSymbolSelection);
}

function sortRows(rows) {
    return [...rows].sort((a, b) => a[0] - b[0] || a[1].localeCompare(b[1]));
}

function checkNumberSymbolSelection() {
    if (document.getElementById("number-symbol-list").style.display === "block") {
        const selectedItems = Array.from(document.querySelectorAll("#number-symbol-options input:checked"))
            .map(input => ({
                number: input.getAttribute("data-number"),
                symbols: input.getAttribute("data-symbols"),
            }));

        let correctCount = 0;
        let incorrectCount = 0;
        for (const selectedItem of selectedItems) {
            if (numbersAndSymbolsToRemember5.some(item => item[0] === parseInt(selectedItem.number) && item[1] === selectedItem.symbols)) {
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
            const resultContainer = document.getElementById("result-container");
            resultContainer.innerHTML = `Всего верных ответов: ${totalCorrectAnswers}<br>Всего неверных ответов: ${totalIncorrectAnswers}`;
        }, 2000);
    }
}
