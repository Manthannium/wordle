import { corpus } from './dictionary.js';

const testdictionary = ['earth','plane','crane','audio','house'];
const dictionary = corpus;

// keyboard
// map (key -> status)
var keyboard = new Map([
    ['q',0],['w',0] ,['e',0],['r',0],['t',0] ,['y',0],['u',0],['i',0] ,['o',0],['p',0],
    ['a',0],['s',0] ,['d',0],['f',0],['g',0] ,['h',0],['j',0],['k',0] ,['l',0],
    ['z',0],['x',0] ,['c',0],['v',0],['b',0] ,['n',0],['m',0]
]);

function getSecretWord() {
    // run till non repeated lettered word is found
    while(1) {
        const secWord = dictionary[Math.floor(Math.random() * dictionary.length)];
        console.log(secWord);

        const myset = new Set();
        for(let j=0; j < 5; ++j) {
            myset.add(secWord[j]);
        }

        if(myset.size == 5) {
            return secWord;
        }
    }
}

const state = {
    // secret is random word from dictionary
    secret: getSecretWord(),
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    
    // default starting cursor
    currentRow: 0,
    currentCol: 0,
};

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    // create game grid
    for(let i=0; i<6; i++) {
        for(let j=0; j<5; j++) {
            drawBox(grid,i,j);
        }
    }
    container.appendChild(grid);
}

function updateGrid() {
    for(let i=0; i < state.grid.length; i++) {
        for(let j=0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;
    
    container.appendChild(box);
    return box;
}

function registerKeyboardEvents() {
    // e is event object
    document.body.onkeydown = (e) => {
        const key = e.key;
        if(key === 'Enter') {
            if(state.currentCol === 5) {
                const word = getCurrentWord();
                if(isWordValid(word)) {
                    revealWord(word);

                    // go to next line
                    state.currentRow++;
                    state.currentCol = 0;
                }
                else {
                    alert('Invalid word');
                }
            }
        }
        if(key === 'Backspace' || key === 'Delete') {
            removeLetter();
        }
        if(isLetter(key)) {
            addLetter(key);
        } 
        updateGrid();
    };
}

function getCurrentWord() {
    // we will use reduce function
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    // animation duration = 0.5 sec = 500ms
    const animation_duration = 500;  // ms

    // color mark the guessed word
    for(let i=0; i<5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if(letter === state.secret[i]) {
                keyboard.set(letter, 1);
                box.classList.add('right');
                changeLetter(letter,"green");
            } else if(state.secret.includes(letter)) {
                if(keyboard.get(letter) != 1) {
                    keyboard.set(letter, 2);
                    changeLetter(letter,"yellow");
                }
                box.classList.add('wrong');
            } else {
                keyboard.set(letter, 3);
                box.classList.add('empty');
                changeLetter(letter,"gray");
            }
        }, ((i+1) * animation_duration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    // check if guessed word is correct
    const isWinner = state.secret === guess;

    // End game
    const isGameOver = state.currentRow === 5;
    
    // because result needs to happen after all letters are revealed
    setTimeout (() => {
        if(isWinner) {
            alert('Congratulations');
            //window.alert('Congratulations');
            //document.write('Congratulations');
            
            // reloads the page and new game is started
            window.location.reload();

        } else if(isGameOver) {
            alert(`The word was ${state.secret}`);
            // game over and new game is started
            window.location.reload();
        }
    }, 3 * animation_duration);

    // print keyboard
    console.log(keyboard);
}

function isLetter(key) {
    // use regex for matching the key to alphabets
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    // check if any space left
    if(state.currentCol === 5) return;

    // set the current position to letter
    state.grid[state.currentRow][state.currentCol] = letter;
    // go to next position
    state.currentCol++;
}

function removeLetter() {
    // check if there is anything to remove
    if(state.currentCol === 0) return;

    // set previos letter to empty string
    state.grid[state.currentRow][state.currentCol - 1] = '';
    // go back
    state.currentCol--;
}

// changes color of letter according to status
function changeLetter(id, color_code) {
    const key = document.getElementById(id);
    key.style.backgroundColor = color_code;
    console.log(key);
}
  
// main function
function startup() {
    //// Manual button 
    // const button = document.createElement('button');
    // const char = "Manual";
    // const span = document.createElement('span');
    // span.style.fontSize = '15px';
    // span.appendChild(document.createTextNode(char));
    // button.appendChild(span);
    // document.body.appendChild(button);
    // button.setAttribute('id', char);
    // button.style.padding = '10px';
    // button.style.margin = '5px';
    // button.onclick = function () {
    //     window.open('manual.png','popUpWindow','height=595,width=600,left=300,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
    // };

    // build game grid
    const game = document.getElementById('game');
    drawGrid(game);

    // Enter key
    {
        const button = document.createElement('button');
        const char = "Enter";
        const span = document.createElement('span');
        span.style.fontSize = '15px';
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);
        document.body.appendChild(button);
        button.setAttribute('id', char);
        button.style.padding = '10px';
        button.style.margin = '5px';
        button.onclick = function () { getLetter(char) };
    }

    // builds keyboard
    for (let i = 97; i <= 122; i++) {
        const button = document.createElement('button');
        const char = String.fromCharCode(i);
        const span = document.createElement('span');
        span.style.fontSize = '16px';
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);
        document.body.appendChild(button);
        button.setAttribute('id', char);
        button.style.padding = '10px';
        button.style.margin = '5px';
        button.onclick = function () { getLetter(char) };
    }

    // Delete key
    {
        const button = document.createElement('button');
        const char = "Delete";
        const span = document.createElement('span');
        span.style.fontSize = '15px';
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);
        document.body.appendChild(button);
        button.setAttribute('id', char);
        button.style.padding = '10px';
        button.style.margin = '5px';
        button.onclick = function () { getLetter(char) };
    }

    function getLetter(id) {
        const key = document.getElementById(id).textContent;
        console.log(key);

        if(key === 'Enter') {
            if(state.currentCol === 5) {
                const word = getCurrentWord();
                if(isWordValid(word)) {
                    revealWord(word);

                    // go to next line
                    state.currentRow++;
                    state.currentCol = 0;
                }
                else {
                    alert('Invalid word');
                }
            }
        }
        if(key === 'Delete') {
            removeLetter();
        }
        if(isLetter(key)) {
            addLetter(key);
        } 
        updateGrid();
    }
    // keyboard ends

    // for response to keys pressed
    registerKeyboardEvents();

    // writes to browser console
    console.log(state.secret);
}

startup();

