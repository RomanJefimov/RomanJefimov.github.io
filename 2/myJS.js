// Globalnije peremennije
var FIELD_SIZE_X = 30; // stroki
var FIELD_SIZE_Y = 30; // stolbci
var SNAKE_SPEED = 150; // interval peremewenija zmeiki
var snake = []; // Sama zmeika
var direction = 'y+'; // napravlenije dviwenija
var gameIsRunning = false; // Zapuwenna li igra
var snake_timer; // taimer zmeiki
var food_timer; // Taimer dl9 edi
var score = 0; // Resultat

function init() {
    prepareGameField(); // Generacia pol9

    var wrap = document.getElementsByClassName('wrap')[0];

    wrap.style.width = '1000px';
    // Sobitija knopok Start i Nova9 Igra
    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click',refreshGame);

// Otslewivanije klaviw klaviaturi
    addEventListener('keydown', changeDirection);
}
/**
 * Funktcia generacii igrovogo pol9
 */
function prepareGameField() {
    //Sozdaem tablicu
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table');

    // Generacia 94eek igrovoi tablici
    for (var i = 0; i < FIELD_SIZE_X; i++) {
        // Sozdanije stroki
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            // Sozdanije 94eiki
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;

            row.appendChild(cell); // Dobavlenije 94eiki
        }
        game_table.appendChild(row); // Dobavlenije stroki
    }
    document.getElementById('snake-field').appendChild(game_table); // Dobavlenije tablici
}
/**
 * Start igri
 */
function startGame() {
    gameIsRunning = true;
    respawn(); // sozdali zmiku

    snake_timer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, 5000);
}

/**
 * Funkci9 raspolowenija zmeiki na igrovom pole
 */
function respawn() {
    // Zmeika - massiv td
    // Startova9 dlina zmeiki = 2

    //Respawn zmeiki iz centra
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    // Golova zmeiki
    var snake_head = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x)[0];
    snake_head.setAttribute('class', snake_head.getAttribute('class') + ' snake-unit');
    // Telo zmeiki
    var snake_tail = document.getElementsByClassName('cell-' + (start_coord_y - 1) + '-' + start_coord_x)[0];
    snake_tail.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');

    snake.push(snake_head);
    snake.push(snake_tail);
}
/**
 * Dviwenije Zmeiki
 */
function move() {
    // console.log('move',direction);
    // Sborka classov
    var snake_head_classes = snake[snake.length - 1].getAttribute('class').split(' ');

    // Sdvig golovi
    var new_unit;
    var snake_coords = snake_head_classes[1].split('-');
    var coord_y = parseInt(snake_coords[1]);
    var coord_x = parseInt(snake_coords[2]);

    // Opredel9em novuu to4ku
    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1))[0];
    }
    else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1))[0];
    }
    else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x))[0];
    }
    else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x))[0];
    }
    // Proverki
    // 1) new_unit ne 4astj zmeiki
    // 2) Zmeika ne uwla za granitcu pol9
    // console.Log(new_unit);
    if (!isSnakeUnit(new_unit) && new_unit !== undefined) {
        // Dobavlenije novoi 4asti zmeiki
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);

        // Prover9em, nado li ubratj xvost
        if (!haveFood(new_unit)) {
            // Nahodim hvost
            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');

            // udal9em hvost
            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    }
    else {
        finishTheGame();
    }
}
/**
 * Proverka na zmeiku
 * @param unit
 * @returns {boolean}
 */
function isSnakeUnit(unit) {
    var check = false;
    if (snake.includes(unit)) {
        check = true;
    }
    return check;
}
/**
 * Proverka na edu
 * @param unit
 * @returns {boolean}
 */
function haveFood(unit) {
    var check = false;

    var unit_classes = unit.getAttribute('class').split(' ');

    // Esli eda
    if (unit_classes.includes('food-unit')) {
        check = true;
        createFood();

        score++;
    }
    return check;
}
/**
 * Sozdanije edi
 */
function createFood() {
    var foodCreated = false;

    while (!foodCreated) {
        // random
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');

        // Proverka na zmeiku
        if (!food_cell_classes.includes('snake-unit')) {
            var classes = '';
            for (var i = 0; i < food_cell_classes.length; i++) {
                classes += food_cell_classes[i] + ' ';
            }

            food_cell.setAttribute('class', classes + 'food-unit');
            foodCreated = true;
        }
    }
}
/**
 * Izmenenije napravlenija dviwenija zmeiki
 * @param e - sobitije
 */
function changeDirection(e) {
    console.log(e);
    switch (e.keyCode) {
        case 37: // klaviwa vlevo
            if (direction != 'x+') {
                direction = 'x-'
            }
            break;
        case 38: // klaviwa vverx
            if (direction != 'y-') {
                direction = 'y+'
            }
            break;
        case 39: // klaviwa vpravo
            if (direction !='x-') {
                direction = 'x+'
            }
            break;
        case 40: // klaviwa vniz
            if (direction != 'y+') {
                direction = 'y-'
            }
            break;
    }
}
/**
 * Funkcia zaverweni9 igri
 */
function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    alert('You Lose! Your score: ' + score.toString());
}

/**
 * Nova9 igra
 */
function refreshGame() {
    location.reload();
}

// inicializacia
window.onload = init;