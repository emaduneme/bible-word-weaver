// UPDATED: Reduced words to 12 per theme to fit the 12x12 grid better.
const GAME_WORDS = {
    "Torah Names & Places": {
        theme: "Find the key figures and places from the books of the Torah (Genesis, Exodus, Leviticus, Numbers, Deuteronomy).",
        words: ["ADAM", "EVE", "NOAH", "ABRAHAM", "SARAH", "ISAAC", "JACOB", "MOSES", "EGYPT", "CANAAN", "SINAI", "REDSEA"]
    },
    "New Testament Books": {
        theme: "Locate the names of key books found in the New Testament.",
        words: ["MATTHEW", "MARK", "LUKE", "JOHN", "ACTS", "ROMANS", "TITUS", "JAMES", "JUDE", "HEBREWS", "GALATIANS", "EPHESIANS"]
    },
    "Prominent Women": {
        theme: "Discover the names of influential women across the Bible.",
        words: ["SARAH", "REBEKAH", "RACHEL", "LEAH", "MIRIAM", "DEBORAH", "RUTH", "ESTHER", "MARY", "MARTHA", "ABIGAIL", "HANNAH"]
    }
};

// UPDATED: Grid size set to 12 for mobile optimization
const GRID_SIZE = 12;
let grid = [];
let startCell = null;
let isDrawing = false;
let selectedCells = [];
let currentThemeKey = '';
let wordsToFind = [];
let foundWords = new Set();
let userId = 'anon_user';

// --- Utility Functions for Firebase/Auth (MUST BE INCLUDED) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Game Setup and Initialization ---

function initGame(themeKey) {
    currentThemeKey = themeKey;
    wordsToFind = GAME_WORDS[themeKey].words.slice(); // Use a copy
    foundWords = new Set();
    grid = generateGrid(wordsToFind);
    renderGame();
}

function generateGrid(words) {
    let newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    let placedWords = [];

    // Sort words by length descending to place long words first
    const sortedWords = words.sort((a, b) => b.length - a.length);

    sortedWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 50;

        while (!placed && attempts < maxAttempts) {
            attempts++;
            const direction = Math.random() < 0.5 ? 'H' : 'V'; // Horizontal or Vertical
            const wordLength = word.length;

            let startX, startY;
            let dx, dy; // Direction vector

            if (direction === 'H') {
                // Horizontal: dx = 1, dy = 0
                dx = 1; dy = 0;
                startX = Math.floor(Math.random() * (GRID_SIZE - wordLength + 1));
                startY = Math.floor(Math.random() * GRID_SIZE);
            } else {
                // Vertical: dx = 0, dy = 1
                dx = 0; dy = 1;
                startX = Math.floor(Math.random() * GRID_SIZE);
                startY = Math.floor(Math.random() * (GRID_SIZE - wordLength + 1));
            }

            if (canPlaceWord(newGrid, word, startX, startY, dx, dy)) {
                placeWord(newGrid, word, startX, startY, dx, dy);
                placedWords.push(word);
                placed = true;
            }
        }
    });

    fillEmptyCells(newGrid);
    return newGrid;
}

function canPlaceWord(grid, word, startX, startY, dx, dy) {
    for (let i = 0; i < word.length; i++) {
        const x = startX + i * dx;
        const y = startY + i * dy;

        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;

        const currentCell = grid[y][x];
        if (currentCell !== null && currentCell !== word[i]) {
            return false; // Conflict
        }
    }
    return true;
}

function placeWord(grid, word, startX, startY, dx, dy) {
    for (let i = 0; i < word.length; i++) {
        const x = startX + i * dx;
        const y = startY + i * dy;
        grid[y][x] = word[i];
    }
}

function fillEmptyCells(grid) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] === null) {
                grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

// --- Rendering Functions ---

function renderGame() {
    const gridContainer = document.getElementById('game-grid');
    const wordListContainer = document.getElementById('word-list');
    const themeTitle = document.getElementById('theme-title');
    const themeDescription = document.getElementById('theme-description');
    const winThemeName = document.getElementById('win-theme-name');


    gridContainer.innerHTML = '';
    wordListContainer.innerHTML = '';

    themeTitle.textContent = currentThemeKey;
    themeDescription.textContent = GAME_WORDS[currentThemeKey].theme;
    winThemeName.textContent = currentThemeKey;


    // Render Grid
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell transition-all duration-100 ease-out';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.textContent = grid[y][x];

            if (foundWords.has(grid[y][x])) {
                cell.classList.add('found');
            }

            cell.addEventListener('mousedown', handleMouseDown);
            cell.addEventListener('mouseenter', handleMouseEnter);
            gridContainer.appendChild(cell);
        }
    }

    // Render Word List
    wordsToFind.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = `word-item p-3 mb-2 rounded-lg text-gray-200 font-semibold text-sm cursor-pointer transition-colors duration-200 ${foundWords.has(word) ? 'word-item-found bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`;
        wordItem.dataset.word = word;
        wordItem.textContent = word;
        wordListContainer.appendChild(wordItem);
    });
}

// --- Selection and Interaction Logic ---

function getCellElement(x, y) {
    return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
}

function handleMouseDown(e) {
    if (foundWords.size === wordsToFind.length) return; // Game over
    isDrawing = true;
    startCell = { x: parseInt(e.target.dataset.x), y: parseInt(e.target.dataset.y) };
    updateSelection(startCell.x, startCell.y);
}

function handleMouseEnter(e) {
    if (isDrawing) {
        updateSelection(parseInt(e.target.dataset.x), parseInt(e.target.dataset.y));
    }
}

function updateSelection(endX, endY) {
    // Clear previous selection
    document.querySelectorAll('.grid-cell').forEach(cell => {
        if (!cell.classList.contains('found')) {
            cell.classList.remove('selected');
        }
    });

    selectedCells = [];

    const startX = startCell.x;
    const startY = startCell.y;

    // Calculate displacement
    const dx = endX - startX;
    const dy = endY - startY;

    // Determine direction (must be horizontal or vertical for this version)
    let stepX = 0;
    let stepY = 0;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Allow only H and V
    if (absDx === 0 && absDy > 0) { // Vertical
        stepY = dy / absDy;
    } else if (absDy === 0 && absDx > 0) { // Horizontal
        stepX = dx / absDx;
    } else if (absDx === 0 && absDy === 0) { // Single cell
        stepX = 0;
        stepY = 0;
    } else {
        // Not a valid line selection (diagonal/L-shape). Only select the start cell.
        const cell = getCellElement(startX, startY);
        if (cell) {
            cell.classList.add('selected');
            selectedCells.push(cell);
        }
        return;
    }

    const steps = Math.max(absDx, absDy) + 1;

    for (let i = 0; i < steps; i++) {
        const x = startX + i * stepX;
        const y = startY + i * stepY;
        const cell = getCellElement(x, y);
        if (cell && !cell.classList.contains('found')) {
            cell.classList.add('selected');
            selectedCells.push(cell);
        }
    }
}

function handleMouseUp() {
    if (!isDrawing) return;
    isDrawing = false;

    const selectedWord = selectedCells.map(cell => cell.textContent).join('');

    // Check if selectedWord (or its reverse) is in the word list
    const reversedWord = selectedWord.split('').reverse().join('');

    const targetWords = wordsToFind.filter(w => !foundWords.has(w));
    let foundMatch = null;

    for (const word of targetWords) {
        if (word === selectedWord || word === reversedWord) {
            foundMatch = word;
            break;
        }
    }

    if (foundMatch) {
        markWordFound(foundMatch);
    } else {
        // Clear selection if no match
        document.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
    }
}

function markWordFound(word) {
    foundWords.add(word);

    // 1. Highlight cells as found
    selectedCells.forEach(cell => {
        cell.classList.remove('selected');
        cell.classList.add('found');
    });

    // 2. Mark word in the list as found
    const listItem = document.querySelector(`.word-item[data-word="${word}"]`);
    if (listItem) {
        listItem.classList.add('word-item-found');
        listItem.classList.remove('bg-gray-800', 'hover:bg-gray-700');
        listItem.classList.add('bg-gray-700');
    }

    // 3. Check for game win
    if (foundWords.size === wordsToFind.length) {
        showWinMessage();
    }
}

function showWinMessage() {
    const modal = document.getElementById('win-modal');
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('win-modal').classList.add('hidden');
}

// --- Touch Event Handlers ---
function handleTouchStart(e) {
    if (foundWords.size === wordsToFind.length) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('grid-cell')) {
        isDrawing = true;
        startCell = { x: parseInt(target.dataset.x), y: parseInt(target.dataset.y) };
        updateSelection(startCell.x, startCell.y);
    }
}

function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('grid-cell')) {
        updateSelection(parseInt(target.dataset.x), parseInt(target.dataset.y));
    }
}

function handleTouchEnd(e) {
    handleMouseUp();
}

// --- Event Listeners and Initial Load ---
function addTouchListeners() {
    const gridContainer = document.getElementById('game-grid');
    gridContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    gridContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
}

window.onload = () => {
    // Add global mouse up listener to stop drawing anywhere
    document.addEventListener('mouseup', handleMouseUp);

    // Add listeners to theme buttons
    document.querySelectorAll('[data-theme]').forEach(button => {
        button.addEventListener('click', (e) => {
            const theme = e.currentTarget.dataset.theme;
            initGame(theme);
            document.getElementById('win-modal').classList.add('hidden');
        });
    });

    // Add touch listeners for mobile
    addTouchListeners();

    // Start the first game
    initGame("Torah Names & Places");
};
