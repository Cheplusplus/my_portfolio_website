let squares = document.getElementsByClassName("sudoku-square");
let selected = null;
let immutable_squares = [];
let puzzle = [];
let solution = [];

const seed_input = document.getElementById("seed");
const seed_value = document.getElementById("seed_value");

const slider = document.getElementById('difficulty-slider');
const slider_value = document.getElementById('difficulty');
let difficulty = slider.value;

const loading_message = document.getElementById("loading");
loading_message.style.fontSize = "30px";

//Create and set the row, col and block variables 
let rows = [[],[],[],[],[],[],[],[],[]];
let cols = [[],[],[],[],[],[],[],[],[]];
let blocks = [[],[],[],[],[],[],[],[],[]];

for (let i = 0; i < 9; i++) {
    rows[i] = [...document.getElementsByClassName(`x${i}`)];
    cols[i] = [...document.getElementsByClassName(`y${i}`)];
}

// Set the correct squares in the block's list
for (let row = 0, block = 0; row < 9; row++) {
    if (row == 3 || row ==6) {block = row;};
    for (let line = 0; line < 3; line++) {
        blocks[block].push(rows[row][line]);
        rows[row][line].setAttribute("block",block);
    };
    for (let line = 3; line < 6; line++) {
        blocks[block+1].push(rows[row][line]);
        rows[row][line].setAttribute("block",block+1);
    };
    for (let line = 6; line < 9; line++) {
        blocks[block+2].push(rows[row][line]);
        rows[row][line].setAttribute("block",block+2);
    }
};

//Sets the background colour of an element
const set_element_color = function(element, color) {
    element.style.backgroundColor = color;
};

//Sets the elements textContent property
const set_element_text = function(element, textcontent) {
    element.textContent = textcontent;
}

//Gets the elements textContent property
const compare_element_text = function(element, content) {
    if (typeof content == "object"){ content = content.textContent };
    return element.textContent == content;
}
 
//Resets the background colours back to white
const reset_colors = function() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = "white";
    };    
};

//Get an object back from a squares attributes
const get_object = function(item) {
    return {"element":item, "row":item.id[0], "col":item.id[2], "block":item.getAttribute("block")}
}

// Highlight the squares with the same value as the passed in parameter
const highlight_same_values = function(item) {
    for (let i = 0; i < squares.length; i++) {
        if (compare_element_text(item.element, '')){return}
        if (compare_element_text(squares[i], item.element)) {
            set_element_color(squares[i],'lightGreen');
        };
    };
};

//Highlight the row, column and block of the selected square
const highlight_row_col_block = function(item) {
    for (let i = 0; i < 9; i++) { 
        set_element_color(rows[item.row][i],"lightBlue");
        set_element_color(cols[item.col][i],"lightBlue");
        set_element_color(blocks[item.block][i],"lightBlue");
    }
}

// Reset the board to default
const reset_board = function() {
    for (let i = 0; i < squares.length; i++) {
        immutable_squares = [];
        set_element_text(squares[i], '');
        squares[i].style.fontWeight = "normal";
        reset_colors();
    };
};

//This runs when you change the slider. Update amount of balls
slider.oninput = function() {
    set_element_text(slider_value, "Difficulty:" + this.value);
    difficulty = slider.value;
}

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken,
  };

//Gets a new puzzle from the server
const get_new_puzzle = async function() {
    let seed = parseInt(seed_input.value)
    if (isNaN(seed)) {
    seed = Math.floor(Math.random()*100000000);
    }
    set_element_text(seed_value,`Seed:${seed}`);
    let difficulty = slider.value;
    const url = `/new_puzzle/${difficulty}/${seed}`;
    set_element_text(loading_message, "Loading...");
    try {
        await fetch(url, {
            headers: headers,
            method: 'GET',
        }).then((response) => response.json()).then((data)=> {
            set_element_text(loading_message, "");
            puzzle = data[0];
            solution = data[1];
            reset_board();
            puzzle.forEach(function(item){
                let square = document.getElementById(Object.keys(item)[0]);
                set_element_text(square, Object.values(item)[0]);
                square.style.fontWeight = "900";
                immutable_squares.push(square);
            });
        })
        
    }
    catch(error){
        console.log(error);
    };
};

// Get the solution from the server and display it.
const get_solution = async function() {
    console.log(solution);
    solution.forEach(function(item){
        let square = document.getElementById(Object.keys(item)[0]);
        set_element_text(square, Object.values(item)[0]);
        immutable_squares.push(square);
    });

}

// Set up the buttons
const solve_button = document.getElementById("solution");
const generate_button = document.getElementById("generate");
solve_button.addEventListener('click', get_solution);
generate_button.addEventListener('click', get_new_puzzle);
set_element_text(slider_value, "Difficulty:" + slider.value);

//EventListener for clicking on the inside squares
for (let i = 0; i < squares.length; i++) {
    squares[i].style.cursor = "pointer";
    squares[i].addEventListener('click', function() {
        reset_colors();
        if (immutable_squares.findIndex(i => i === this) !== -1){
            highlight_same_values(get_object(this));
            check_value(this);
            selected = null;
            return;
        };
        selected = get_object(this);
        highlight_row_col_block(selected);
        highlight_same_values(get_object(this));
        set_element_color(this, "lightGreen");
        check_value(this);
    })
};

// EventListener for a keypress and only do something if its a number
document.addEventListener("keydown", function(e) {
    if ("123456789".includes(e.key) && selected){
        if (compare_element_text(selected.element, e.key)) {
            set_element_text(selected.element, '');
            reset_colors();
            highlight_row_col_block(selected);
            set_element_color(selected.element, "lightBlue");
            check_value(selected.element);
            return;
        };
        reset_colors();
        highlight_row_col_block(selected);
        set_element_text(selected.element, e.key);
        highlight_same_values(selected);
        check_value(selected.element);
        check_win_condition();
    };
});

//Check if the squares value is valid and sets its colour to red if its not
//green if it is and blue if its part of the group
//The styling of the blocks can be turned off by setting parameter style=false
const check_value = function(item, style=true) {
    item = get_object(item);
    let pass = true;

    if (!"123456789".includes(item.element.textContent) || !item.element.textContent) {  
        return;
    };
    
    for (let i = 0; i < 9; i++) {
        if (compare_element_text(rows[item.row][i], item.element) && rows[item.row][i] != item.element){ 
            if(style) {set_element_color(rows[item.row][i],"red");
            };
            pass = false;
        }
        if (compare_element_text(cols[item.col][i], item.element) && cols[item.col][i] != item.element){ 
            if(style) {set_element_color(cols[item.col][i],"red");
            };
            pass = false;
        }
        if (compare_element_text(blocks[item.block][i], item.element) && blocks[item.block][i] != item.element){ 
            if(style) {set_element_color(blocks[item.block][i],"red");
            };
            pass = false;
        }
    }
    if(style) {
        if (pass) {set_element_color(item.element, "lightGreen");}
        else {set_element_color(item.element, "red");};
    };
    return pass;
};

// Checks if the win condition is met
const check_win_condition = function(){
    for (let i = 0; i < squares.length; i++) {
        if (!check_value(squares[i], style=false)) {return;}
        if (compare_element_text(squares[i], '')) {return;}  
    }
    reset_colors();
    alert("Congratulations! You got it!");
}

// Get a new puzzle when you load the page
get_new_puzzle();