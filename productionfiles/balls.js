let planet = "earth";
let gravity;
let air_resistance;

let rand = function(min, max){
    return Math.floor(Math.random()*(max-min)+min);
};

// Set the window size
const window_size = {"width":canvas.width, "height":canvas.height};

//Ball class
class Ball {
    constructor(x,y,vx,vy,ax,ay,size){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.color = "#" + decimalToHexString(rand(255,10000));
        this.size = size;
    }
    
    update(){
        this.vx += this.ax
        this.vy += this.ay
        this.x += this.vx
        this.y += this.vy

        // Check if the ball has collided with the floor
        if (this.y > window_size.height - this.size){
            this.vy = -this.vy * 0.8
            this.y = window_size.height - this.size
        }

        // Check if the ball has collided with the left or right wall
        if (this.x < this.size || this.x > window_size.width - this.size){
            this.vx = -this.vx * 0.9
        }
        if (this.x < this.size){
            this.x = this.size;
        }
        if (this.x > window_size.width - this.size){
            this.x = window_size.width - this.size;
        }
        // Apply damping to the ball's velocity
        this.vx *= air_resistance
        this.vy *= air_resistance
    }
}

let earth_settings = document.getElementById("earth");
let moon_settings = document.getElementById("moon");
let jupiter_settings = document.getElementById("jupiter");
let balls_slider = document.getElementById("balls_slider");
let balls_amount = document.getElementById("balls_amount");

earth_settings.addEventListener('mousedown', function(){
    planet = 'earth';
    setPlanet(planet);
});

moon_settings.addEventListener('mousedown', function(){
    planet = 'moon';
    setPlanet(planet);
});
jupiter_settings.addEventListener('mousedown', function(){
    planet = 'jupiter';
    setPlanet(planet);
});

const setPlanet = function(planet){
    switch(planet){
        case "earth":
            gravity = 0.981;
            air_resistance = 0.999;
            break;
        case "moon":
            gravity = 0.124;
            air_resistance = 1;
            break;
        case "jupiter":
            gravity = 2.479;
            air_resistance = 0.99;
            break;
    }
};

//Update amount of balls
balls_slider.oninput = function(){
    balls_amount.innerHTML = "Amount of balls:" + this.value;
}

//Set amount of balls
let amount_of_balls = balls_slider.value;
balls_amount.innerHTML = "Amount of balls:" + balls_slider.value;

//Create the balls
const create_balls = function(){
    let balls = [];
    for(i=0; i<amount_of_balls; i++){
        let size = rand(15, 30);
        let x =rand(10,90)*window_size.width/100;
        let y = rand(0,30)*window_size.height/100;
        balls.push(new Ball(x,y,rand(-5,5),rand(0,5),0,gravity, size));
    };
    return balls;
}

//Draw a ball
const draw_ball = function(x,y,radius,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,2 * Math.PI);
    ctx.fill();
}

function decimalToHexString(number){
  if (number < 0){
    number = 0xFFFFFFFF + number + 1;
  }
  return number.toString(16).toUpperCase();
}

let balls = create_balls(amount_of_balls);

const reset = function(){
    balls = [];
    balls = create_balls();
}

setPlanet(planet);
reset();
const run = setInterval(function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(i=0; i<amount_of_balls; i++){
        let this_ball = balls[i];
        this_ball.update();
        draw_ball(this_ball.x,this_ball.y,this_ball.size, this_ball.color);
    }
}, 10);

canvas.addEventListener('mousedown', function(event) {
    amount_of_balls = balls_slider.value;
    reset();
});

