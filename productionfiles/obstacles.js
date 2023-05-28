const amount_of_squares = canvas.width/8;
const square_size = canvas.width/amount_of_squares;
const obstacles = [];
let mousedown = false;
let button_pressed = 0;
let color;
let promises = [];

//Reset the board - Runs the first time to setup the board
const reset = function(){
    i = 0;
    ctx.fillStyle = "#011";

    for (let y = 1; y <= amount_of_squares+1; y++) {
        for (let x = 1; x <= amount_of_squares+1; x++) {  
            ctx.fillRect((x-1) * square_size , (y-1) * square_size , square_size , square_size ); 
        };
    };
}

//Send the obstacle list to the server
const sendObstacles = async function(){
    const url = "/update-obstacles/";
    
    try{
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
              },
            method:'POST',
            body: JSON.stringify(obstacles),

        });
        if(response.ok){
            return true;
        }
    }
    catch(error){
        console.log(error);
    }
}

//Store obstacles
const storeObstacles = function(x, y){
    if (obstacles.findIndex(i => i.x === x && i.y === y) !== -1){
        return;
    }
    else if (markers.findIndex(i => i.x === x && i.y === y) !== -1){
        return;
    };
    let obstacle = {"x":x,"y":y};
    obstacles.push(obstacle);
    return obstacle;
};

//Remove obstacles
const removeObstacle = function(x, y){
    // let i = find_in_array(obstacles, obstacle);
    let index = obstacles.findIndex(i => i.x === x && i.y === y);
    if (index === -1){
        return
    };
    obstacles.splice(index, 1);
};

//Changes the color of a square
const changeColor = function(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x * square_size , y * square_size , square_size , square_size );
    return ctx.fillStyle;
};

// Prevent the context menu from showing when we right click
canvas.addEventListener("contextmenu", e => e.preventDefault());

//Check when a mouse button is pressed and handle it
canvas.addEventListener('mousedown', function(event) {
    if (marker_mode){
        return
    }
    button_pressed = event.button;
    mousedown = true;
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    let gridX = Math.floor(x / square_size);
    let gridY = Math.floor(y / square_size);

    // If this square is a marker then dont make it an obstacle
    if (markers.findIndex(i => i.x === gridX && i.y === gridY) !== -1){
        return
    }
    reset_path();
    switch (button_pressed){
        case 0:
        color = "#09f";
        storeObstacles(gridX, gridY);
        storeObstacles(gridX+1, gridY);
        storeObstacles(gridX, gridY+1);
        storeObstacles(gridX+1, gridY+1);
        break;
        case 2:
        color = "#011";
        removeObstacle(gridX, gridY);
        removeObstacle(gridX+1, gridY);
        removeObstacle(gridX, gridY+1);
        removeObstacle(gridX+1, gridY+1);
        break;
    };
    changeColor(gridX, gridY, color);
    changeColor(gridX+1, gridY, color);
    changeColor(gridX, gridY+1, color);
    changeColor(gridX+1, gridY+1, color);
});

//The mouse button is being held down
canvas.addEventListener('mousemove', function(event) {
    if (mousedown) {
        var x = event.pageX - canvas.offsetLeft + 1;
        var y = event.pageY - canvas.offsetTop + 1;
        let gridX = Math.floor(x / square_size);
        let gridY = Math.floor(y / square_size);
        // If this square is a marker then dont make it an obstacle
        if (markers.findIndex(i => i.x === gridX && i.y === gridY) !== -1){
            return
        }
        changeColor(gridX, gridY, color);
        changeColor(gridX+1, gridY, color);
        changeColor(gridX, gridY+1, color);
        changeColor(gridX+1, gridY+1, color);
        switch (button_pressed){
            case 0:
            storeObstacles(gridX, gridY);
            storeObstacles(gridX+1, gridY);
            storeObstacles(gridX, gridY+1);
            storeObstacles(gridX+1, gridY+1);
            break;
            case 2:
            removeObstacle(gridX, gridY);
            removeObstacle(gridX+1, gridY);
            removeObstacle(gridX, gridY+1);
            removeObstacle(gridX+1, gridY+1);
            break;
        };
    };
});

//The mouse button is released
canvas.addEventListener('mouseup', function() {
    mousedown = false;
    promises.push(sendObstacles());
    promises.push(sendObstacles());

});

// Release the mouse button if the mouse leaves
canvas.addEventListener('mouseleave', function() {
    mousedown = false;
    promises.push(sendObstacles());
    promises.push(sendObstacles());
});

reset();
