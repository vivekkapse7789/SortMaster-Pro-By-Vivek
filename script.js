const visualContainer = document.getElementById("visualContainer");
const logPanel = document.getElementById("logPanel");
const passCounter = document.getElementById("passCounter");
const stepDescription = document.getElementById("stepDescription");
const userInput = document.getElementById("userInput");
const initBtn = document.getElementById("initBtn");
const speedSlider = document.getElementById("speedSlider");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const arraySnapshot = document.getElementById("arraySnapshot");
const compareDisplay = document.getElementById("compareCount");
const swapDisplay = document.getElementById("swapCount");

let delay = 800; 
let comparisons = 0;
let swaps = 0;

if(speedSlider) {
    speedSlider.addEventListener("input", (e) => {
        delay = parseInt(e.target.value);
    });
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    if(compareDisplay) compareDisplay.innerText = "0";
    if(swapDisplay) swapDisplay.innerText = "0";
}

function updateArraySnapshot() {
    const cards = document.querySelectorAll(".card");
    const currentArr = Array.from(cards).map(card => card.innerText);
    arraySnapshot.innerText = `[ ${currentArr.join(", ")} ]`;
    arraySnapshot.style.color = "var(--swapping)";
    setTimeout(() => arraySnapshot.style.color = "#f8fafc", 300);
}

function updateProgressBar(currentPass, totalElements) {
    let percentage = Math.round((currentPass / totalElements) * 100);
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `Progress: ${percentage}%`;
}

function addToLog(msg, type = "") {
    const div = document.createElement("div");
    div.style.marginBottom = "5px";
    if(type === "log-pass") div.style.color = "#10b981";
    if(type === "log-swap") div.style.color = "#fbbf24";
    div.innerHTML = `<span style="color: #6366f1;">></span> ${msg}`;
    logPanel.prepend(div);
}

function clearAllClasses() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.classList.remove("comparing", "swapping-active");
    });
}

initBtn.addEventListener("click", () => {
    const val = userInput.value;
    const arr = val.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (arr.length > 0) {
        renderCards(arr);
        resetStats();
        progressBar.style.width = "0%";
        progressText.innerText = "Progress: 0%";
        logPanel.innerHTML = ""; 
        addToLog("New array set. Ready to start.");
    }
});

function renderCards(arr) {
    visualContainer.innerHTML = "";
    const maxVal = Math.max(...arr); 
    arr.forEach(val => {
        const card = document.createElement("div");
        card.classList.add("card");
        const scaledHeight = 50 + (val / maxVal) * 250; 
        card.style.height = `${scaledHeight}px`;
        card.innerText = val;
        visualContainer.appendChild(card);
    });
    updateArraySnapshot();
}

// --- BUBBLE SORT WITH LOGS ---
async function bubbleSort() {
    let cards = document.querySelectorAll(".card");
    let n = cards.length;
    if(n === 0) return;
    resetStats();
    addToLog("Starting Bubble Sort...", "log-pass");

    for (let i = 0; i < n; i++) {
        passCounter.innerText = `Pass: ${i + 1}`;
        for (let j = 0; j < n - i - 1; j++) {
            let v1 = parseInt(cards[j].innerText);
            let v2 = parseInt(cards[j+1].innerText);

            cards[j].classList.add("comparing");
            cards[j+1].classList.add("comparing");
            
            comparisons++;
            compareDisplay.innerText = comparisons;
            stepDescription.innerText = `Comparing ${v1} and ${v2}`;

            await new Promise(r => setTimeout(r, delay / 2));

            if (v1 > v2) {
                swaps++;
                swapDisplay.innerText = swaps;
                addToLog(`Swap: ${v1} > ${v2}`, "log-swap");
                
                cards[j].classList.add("swapping-active");
                cards[j+1].classList.add("swapping-active");
                await new Promise(r => setTimeout(r, delay));

                let tempH = cards[j].style.height;
                let tempT = cards[j].innerText;
                cards[j].style.height = cards[j+1].style.height;
                cards[j].innerText = cards[j+1].innerText;
                cards[j+1].style.height = tempH;
                cards[j+1].innerText = tempT;
            }
            cards[j].classList.remove("comparing", "swapping-active");
            cards[j+1].classList.remove("comparing", "swapping-active");
        }
        cards[n - i - 1].classList.add("is-sorted");
        addToLog(`Pass ${i+1} complete. ${cards[n-i-1].innerText} is in position.`, "log-pass");
        updateProgressBar(i + 1, n);
        updateArraySnapshot();
    }
    clearAllClasses();
    addToLog("Bubble Sort Complete!", "log-pass");
}

// --- SELECTION SORT WITH LOGS ---
async function selectionSort() {
    let cards = document.querySelectorAll(".card");
    let n = cards.length;
    if(n === 0) return;
    resetStats();
    addToLog("Starting Selection Sort...", "log-pass");

    for (let i = 0; i < n; i++) {
        passCounter.innerText = `Pass: ${i + 1}`;
        let minIdx = i;
        cards[i].classList.add("swapping-active");
        let valI = parseInt(cards[i].innerText);
        addToLog(`New search: finding smallest from index ${i}`);

        for (let j = i + 1; j < n; j++) {
            let valJ = parseInt(cards[j].innerText);
            let valMin = parseInt(cards[minIdx].innerText);

            cards[j].classList.add("comparing");
            comparisons++;
            compareDisplay.innerText = comparisons;
            stepDescription.innerText = `Is ${valJ} smaller than ${valMin}?`;

            await new Promise(r => setTimeout(r, delay / 2));

            if (valJ < valMin) {
                addToLog(`New minimum found: ${valJ}`);
                if(minIdx !== i) cards[minIdx].classList.remove("swapping-active");
                minIdx = j;
                cards[minIdx].classList.add("swapping-active");
            }
            cards[j].classList.remove("comparing");
        }
        if (minIdx !== i) {
            swaps++;
            swapDisplay.innerText = swaps;
            addToLog(`Swapping ${cards[i].innerText} with ${cards[minIdx].innerText}`, "log-swap");
            let tempH = cards[i].style.height;
            let tempT = cards[i].innerText;
            cards[i].style.height = cards[minIdx].style.height;
            cards[i].innerText = cards[minIdx].innerText;
            cards[minIdx].style.height = tempH;
            cards[minIdx].innerText = tempT;
            await new Promise(r => setTimeout(r, delay));
        }
        cards[minIdx].classList.remove("swapping-active");
        cards[i].classList.add("is-sorted");
        updateProgressBar(i + 1, n);
        updateArraySnapshot();
    }
    clearAllClasses();
    addToLog("Selection Sort Complete!", "log-pass");
}

// --- INSERTION SORT WITH LOGS ---
async function insertionSort() {
    let cards = document.querySelectorAll(".card");
    let n = cards.length;
    if (n === 0) return;
    resetStats();
    addToLog("Starting Insertion Sort...", "log-pass");

    for (let i = 0; i < n; i++) {
        passCounter.innerText = `Pass: ${i}`;
        let j = i;
        let valToInsert = parseInt(cards[i].innerText);
        addToLog(`Inserting ${valToInsert}...`);
        cards[i].classList.add("swapping-active");
        await new Promise(r => setTimeout(r, delay));

        while (j > 0) {
            let leftVal = parseInt(cards[j - 1].innerText);
            comparisons++;
            compareDisplay.innerText = comparisons;
            cards[j-1].classList.add("comparing");
            stepDescription.innerText = `Comparing ${valToInsert} with ${leftVal}`;

            await new Promise(r => setTimeout(r, delay / 2));

            if (leftVal > valToInsert) {
                swaps++;
                swapDisplay.innerText = swaps;
                addToLog(`Shift: ${leftVal} moves right`, "log-swap");
                let tempH = cards[j].style.height;
                let tempT = cards[j].innerText;
                cards[j].style.height = cards[j - 1].style.height;
                cards[j].innerText = cards[j - 1].innerText;
                cards[j - 1].style.height = tempH;
                cards[j - 1].innerText = tempT;
                
                cards[j].classList.remove("swapping-active");
                cards[j - 1].classList.add("swapping-active");
                await new Promise(r => setTimeout(r, delay));
                cards[j].classList.remove("comparing");
                j--;
            } else {
                addToLog(`${valToInsert} sits after ${leftVal}`);
                cards[j-1].classList.remove("comparing");
                break; 
            }
        }
        for(let k = 0; k <= i; k++) cards[k].classList.add("is-sorted");
        cards[j].classList.remove("swapping-active");
        updateProgressBar(i + 1, n);
        updateArraySnapshot();
    }
    updateProgressBar(n, n);
    clearAllClasses();
    addToLog("Insertion Sort Complete!", "log-pass");
}