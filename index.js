import { corpus } from './dictionary.js';

var select_audio = new Audio('select.mp3');
select_audio.load();

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
    greenpoints: 0,
    yellowpoints: 0,
    hinted: 0,
    score: 0,
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

// physical keyboard input
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
                    //tempAlert("Invalid word",5000);
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
                state.greenpoints++;
                keyboard.set(letter, 1);
                box.classList.add('right');
                changeLetter(letter.toUpperCase(),"green");
            } else if(state.secret.includes(letter)) {
                if(keyboard.get(letter) != 1) {
                    state.yellowpoints++;
                    keyboard.set(letter, 2);
                    changeLetter(letter.toUpperCase(),"yellow");
                }
                box.classList.add('wrong');
            } else {
                keyboard.set(letter, 3);
                box.classList.add('empty');
                changeLetter(letter.toUpperCase(),"gray");
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
            if(state.hinted == 1) {
                alert(`Good! You got the hint`);
            }
            else {
                alert(`CONGRATULATIONS! \n Your score : ${20*(6-state.currentRow) + state.greenpoints + state.yellowpoints}`);
            }
            
            // reloads the page and new game is started
            window.location.reload();

        } else if(isGameOver) {
            alert(`The word was ${state.secret.toUpperCase()}`);
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

// changes color of virtual keyboard letter according to status
function changeLetter(id, color_code) {
    let key = document.getElementById(id);
    key.style.backgroundColor = color_code;
    console.log(key);
}
  
// main function
function startup() {

    // build game grid
    const game = document.getElementById('game');
    drawGrid(game);

    // build keyboard
    const kboard1 = document.getElementById('kboard1');
    const kboard2 = document.getElementById('kboard2');
    const kboard3 = document.getElementById('kboard3');
    const kboard4 = document.getElementById('kboard4');

    // qwerty keyboard
    let qwerty = [81,87,69,82,84,89,85,73,79,80, 65,83,68,70,71,72,74,75,76, 90,88,67,86,66,78,77];

    // builds keyboard
    // small 65 - 90
    // capital 97 - 122
    for (let j = 0; j <= 25; j++) {
        let i = qwerty[j];
        const button = document.createElement('button');
        const char = String.fromCharCode(i);
        const span = document.createElement('span');
        span.style.fontSize = '20px';
        span.style.fontWeight = '600';
        
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);

        if(j<10) kboard1.appendChild(button);
        else if(j<19) kboard2.appendChild(button);
        else kboard3.appendChild(button);
        
        button.setAttribute('id', char);
        button.style.padding = '5px';
        button.style.margin = '0.5px';
        button.style.height = '40px';
        button.style.width = '40px';
        button.style.borderColor = 'gray';
        button.onclick = function () { getLetter(char) };
    }

    // Enter key
    {
        const button = document.createElement('button');
        const char = "ENTER";
        const span = document.createElement('span');
        span.style.fontSize = '20px';
        span.style.fontWeight = '600';
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);
        kboard4.appendChild(button);
        button.setAttribute('id', char);
        button.style.padding = '5px';
        button.style.margin = '0.5px';
        button.style.backgroundColor = "green";
        button.style.borderColor = 'gray';
        button.onclick = function () { getLetter(char) };
    } 
    
    // ? Manual key
    {
        const button = document.createElement('button');
        const char = "?";
        const span = document.createElement('span');
        span.style.fontSize = '20px';
        span.style.fontWeight = '600';
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);
        kboard3.appendChild(button);
        button.setAttribute('id', char);
        button.style.padding = '5px';
        button.style.margin = '0.5px';
        button.style.height = '40px';
        button.style.width = '40px';
        button.style.borderColor = 'gray';
        button.onclick = function () { 
            select_audio.play();
            window.open('manual.png','popUpWindow','height=595,width=600,left=300,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
        };
    } 

    // Hint key
    {
        const button = document.createElement('button');
        const char = "★";
        const span = document.createElement('span');
        span.style.fontSize = '20px';
        span.style.fontWeight = '600';
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);
        kboard4.appendChild(button);
        button.setAttribute('id', char);
        button.style.padding = '0px';
        button.style.margin = '0.5px';
        button.style.height = '40px';
        button.style.width = '40px';
        button.style.backgroundColor = "#6CC8ED";
        button.style.borderColor = 'gray';
        button.onclick = function () { 
            select_audio.play();

            if(state.currentRow == 5) {
                state.hinted = 1;

                // first leave these actual coorect letters
                let temp = keyboard;
                for(let ij=0; ij<5; ij++) {
                    temp.set(state.secret[ij], 5);
                }

                // now cancel out each empty letter
                let alpha = "abcdefghijklmnopqrstuvwxyz";
                for(let ij=0; ij<26; ij++) {
                    if(temp.get(alpha[ij]) == 0) {
                        // box.classList.add('right');
                        changeLetter(alpha[ij].toUpperCase(),"#6CC8ED");
                    }
                }
            }
            else {
                alert('Hint will be activated in last trial');
            }
            
        };
    }

    // Clear key
    {
        const button = document.createElement('button');
        const char = "CLEAR";
        const span = document.createElement('span');
        span.style.fontSize = '20px';
        span.style.fontWeight = '600';
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);
        kboard4.appendChild(button);
        button.setAttribute('id', char);
        button.style.padding = '5px';
        button.style.margin = '0.5px';
        button.style.backgroundColor = "red";
        button.style.borderColor = 'gray';
        button.onclick = function () { getLetter(char) };
    }

    // virtual keyboard input
    function getLetter(id) {
        select_audio.play();
        let key = document.getElementById(id).textContent;
        key = key.toLowerCase();
        //console.log(key);

        if(key === 'enter') {
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
        if(key === 'clear') {
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

