let numbersAndSymbolsToRemember5 = [];
let numberSymbolTimerInterval5;
let numberSymbolTimeLeft5 = 5;
let colorMap = new Map();

function startFifthStage() {
    const numberSymbolList = document.getElementById("number-symbol-list");
    const symbolList = document.getElementById("symbol-list");
    const numberList = document.getElementById("number-list");
    const startButton = document.getElementById("start-button");
    const checkButton = document.getElementById("check-button");
    const resultContainer = document.getElementById("result-container");
    const gameContainer = document.getElementById("game-container");

    numberSymbolList.style.display = "none";
    symbolList.style.display = "none";
    numberList.style.display = "none";
    startButton.style.display = "none";
    checkButton.style.display = "none";
    resultContainer.innerHTML = "";

    startNumberSymbolTimer5();
    numbersAndSymbolsToRemember5 = generateUniqueRandomNumbersAndSymbols(5);
    const additionalRows = generateUniqueRandomNumbersAndSymbols(5, numbersAndSymbolsToRemember5);
    const sortedRows = sortRows(numbersAndSymbolsToRemember5);

    gameContainer.innerHTML = sortedRows.map(item => {
        const [number, symbols] = item;
        const textColor = colorMap.get(`${number}-${symbols}`) || generateRandomColor();
        const symbolColor = colorMap.get(`${number}-${symbols}`) || generateRandomSymbolColor();
        colorMap.set(`${number}-${symbols}`, textColor);
        colorMap.set(`${number}-${symbols}`, symbolColor);
        return `<span style="color: ${textColor};">${number}</span> <span style="color: ${symbolColor};">${symbols}</span>`;
    }).join("<br>");

    gameContainer.style.display = "block";

    setTimeout(() => {
        stopNumberSymbolTimer5();
        showNumberSymbolSelection(numbersAndSymbolsToRemember5, additionalRows);
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
    const options = document.getElementById("number-symbol-options");
    options.innerHTML = "";
    const allRows = [...rememberedRows, ...additionalRows];
    const sortedRows = sortRows(allRows);
    sortedRows.forEach(([number, symbols]) => {
        const textColor = generateRandomColor();
        const symbolColor = generateRandomSymbolColor();
        options.innerHTML += `
            <li>
                <label>
                    <input type="checkbox" data-number="${number}" data-symbols="${symbols}">
                    <span style="color: ${textColor};">${number}</span>
                    <span style="color: ${symbolColor};">${symbols}</span>
                </label>
            </li>
        `;
    });

    const numberList = document.getElementById("number-list");
    const symbolList = document.getElementById("number-symbol-list");
    const checkButton = document.getElementById("check-button");
    numberList.style.display = "none";
    symbolList.style.display = "block";
    checkButton.style.display = "block";
    checkButton.addEventListener("click", checkNumberSymbolSelection);
}

function sortRows(rows) {
    return [...rows].sort((rowA, rowB) => {
        const [xA, yA] = rowA;
        const [xB, yB] = rowB;
        return xA - xB || yA.localeCompare(yB);
    });
}

function checkNumberSymbolSelection() {
    const numberSymbolList = document.getElementById("number-symbol-list");
    if (numberSymbolList.style.display === "block") {
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
            resultContainer.innerHTML = `Всего верных ответов: ${totalCorrectAnswers}<br>Всего неверных ответов: ${totalIncorrectAnswers}`;
        }, 2000);
    }
}
