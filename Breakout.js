//************************************************* Break Out Game Using JavaScript ******************************************//
//***************************************************************************************************************************//



// -------------------------------------------------- Variable Initialization -------------------------------------------------// 
const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");

const WIDTH_OF_PADDLE = 100;
const HEIGHT_OF_PADDLE = 15;
const PADDLE_MARGIN_BOTTOM = 65;
const RADIUS_OF_BALL = 13;
const OBSTACLE_WIDTH = 90;
const OBSTACLE_HEIGHT = 7;
const OBSTACLE_MARGIN_BOTTOM = 350;
const PLAYER_NAME = localStorage.getItem("user_name");
//--------------------------------------------------------------------------------------------------------------------------------//



// --------------------------------------------------------- Sound Initialization ------------------------------------------------//
const BALL_LOST = new Audio();
BALL_LOST.src = ('./sounds/mixkit-fairy-cartoon-success-voice-344.wav');

const BREAKOUT = new Audio();
BREAKOUT.src = ('./sounds/breakout.mp3');

const BRICK_HIT = new Audio();
BRICK_HIT.src = ('./sounds/brick.mp3');

const LEVEL_COMPLETED = new Audio();  // Level Completed Sound
LEVEL_COMPLETED.src = ('./sounds/smb_stage_clear.wav');

// const music = new Audio();  
// music.src = ('./sounds/music.mp3');

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = ('./sounds/mixkit-negative-tone-interface-tap-2569.wav'); // PADDLE Hit Sound

const LIFE_DECREASE = new Audio();
LIFE_DECREASE.src = ('./sounds/smb_warning.wav'); // On Hit Red Bricks
// ---------------------------------------------------------------------------------------------------------------------------//




// --------------------------------------------------------- Background Image -------------------------------------------------//
const BACKGROUND = new Image;
BACKGROUND.src = "./color1.jpg";
//-----------------------------------------------------------------------------------------------------------------------------//


// ---------------------------------------------------- variable declaration --------------------------------------------------//
let leftArrow = false;
let rightArrow = false;
let space = false; /// Bind Space for Start/Pause
let maxLife = 4;
let score = 0;
let scoreCount = 5; // you will get 5 points per brick collision
let gameLevel = 5;
let maxLevel = 5;
let gameOver = false;

ctx.lineWidth = 2.5; // stroke width of PADDLE and bricks
// ---------------------------------------------------------------------------------------------------------------------------//




//------------------------------------------------------- Paddle Creation ----------------------------------------------------//
const PADDLE = {
    x: cvs.width / 2 - WIDTH_OF_PADDLE / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - HEIGHT_OF_PADDLE,
    width: WIDTH_OF_PADDLE,
    height: HEIGHT_OF_PADDLE,
    dx: 6 // moving speed of PADDLE
}

function paddleDraw() {
    ctx.fillStyle = "yellow";

    ctx.fillRect(PADDLE.x, PADDLE.y, PADDLE.width, PADDLE.height);

    ctx.strokeStyle = "yellow";
    // ctx.strokeRect(PADDLE.x, PADDLE.y, PADDLE.width, PADDLE.height);
}
// ---------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------------- Paddle Move with Arrow Key --------------------------------------------------//
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        leftArrow = true;
    } else if (event.key === "ArrowRight") {
        rightArrow = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        leftArrow = false;
    } else if (event.key === "ArrowRight") {
        rightArrow = false;
    }
});
// ---------------------------------------------------------------------------------------------------------------------------//



// ----------------------------------------------------- Binding space with start/pause -----------------------------------------//
document.addEventListener("keypress", function (event) {
    // console.log("space daba diya");
    if (event.code === 'Space') {
        // console.log("space daba diya");
        pauseToggle();

    }
});
// ---------------------------------------------------------------------------------------------------------------------------//



// ----------------------------------------------------- Paddle Move Function -------------------------------------------------//
function paddleMove() {
    if (rightArrow && PADDLE.x + PADDLE.width < cvs.width) {
        PADDLE.x += PADDLE.dx;
    } else if (leftArrow && PADDLE.x > 0) {
        PADDLE.x -= PADDLE.dx;
    }
}
// ---------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------------------- Ball Creation ------------------------------------------------------//
const ball = {
    x: cvs.width / 2,
    y: PADDLE.y - RADIUS_OF_BALL,
    radius: RADIUS_OF_BALL,
    speed: 4, // Initial Speed Of Ball
    dx: 3 * (Math.random() * 2 - 1),
    // angle of ball random numbers will be generate between +3 to -3 
    dy: -3
}

function ballDraw() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "lightgreen";
    ctx.fill();

    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.closePath();

}
// ---------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------------------- Ball Move ---------------------------------------------------------//
function ballMove() {
    ball.x += ball.dx; // Ball Moving Direction up on x-Axis
    ball.y += ball.dy; // Ball Moving Direction up on y- Axis
}
//-------------------------------------------------------------------------------------------------------------------------------//



//---------------------------------------------------------- Ball / Wall Collision-----------------------------------------------//
function ballWithWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {  // ball goes outside of canvas  
        maxLife--; // life will decrease
        ballReset(); // Ball will reset
        BALL_LOST.play(); 
    }
}
//-------------------------------------------------------------------------------------------------------------------------------//




//-------------------------------------------------------- Reset Ball -----------------------------------------------------------//
function ballReset() {
    ball.x = cvs.width / 2;
    ball.y = PADDLE.y - RADIUS_OF_BALL;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}
//-------------------------------------------------------------------------------------------------------------------------------//



//----------------------------------------------------- Reset Life After Level Up -----------------------------------------------//
function resetLife() {
    if (gameLevel > 1) {
        maxLife = 4;
    }
}
//------------------------------------------------------------------------------------------------------------------------------//



//----------------------------------------------------- Ball / Paddle Collision ------------------------------------------------//
function ballWithPaddleCollision() {
    if (ball.x < PADDLE.x + PADDLE.width && ball.x > PADDLE.x && 
        (ball.y + ball.radius) < PADDLE.y + PADDLE.height && (ball.y + ball.radius) > PADDLE.y) {
        PADDLE_HIT.play();
        let collidePoint = ball.x - (PADDLE.x + PADDLE.width / 2);

        collidePoint = collidePoint / (PADDLE.width / 2);

        let angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}
//------------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------------------- Bricks Creation ----------------------------------------------------//
const brick = {
    row: 2,
    column: 12,
    width: 80,
    // spaceFactor : 2,
    height: 15,
    offSetLeft: 9,
    offSetTop: 8,
    marginTop: 40,
    fillColor: " #004080",
    strokeColor: "white"
}

const COLORS = {
    'S': 'yellow',  // Reduce Paddle length
    'L': 'blue',    // Increase Paddle length
    'N': 'white',
    '+L': 'green',   // Life++
    '-L': 'red'      // Increase ball speed
}

const STROKCOLORS = {
    1: "white",
    2: "black"
}
//---------------------------------------------------------------------------------------------------------------------------------//



//------------------------------------------ Array for filling Random Color In Bricks --------------------------------------------//

let power = ['N', 'L', 'N', 'N', 'N', 'N', 'S', 'N', 'N', 'N', '-L', 'N', '+L', 'N', 'N', 'N', 'N']

//-------------------------------------------------------------------------------------------------------------------------------//



//------------------------------------------------- Array for Bricks Creation --------------------------------------------------//
let bricks = [];
function bricksCreation() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft, // for column
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop, // for row
                power: power[getRandomInt(0, power.length)], // Random loop is running 0 to power.length
                // status: (c===r) ? false : true,// bricks creation status, if it will false bricks will not create
                status : true,
                strength: getRandomInt(1, 2) // distroy bricks randomly, maximum 2 hit allowed.
            }
        }
    }
}
bricksCreation();
//-----------------------------------------------------------------------------------------------------------------------------//



//------------------------------------------------------ draw Bricks ----------------------------------------------------------//
function bricksDraw() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.fillStyle = COLORS[b.power];
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = STROKCOLORS[b.strength];  // change stroke color according to strength
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}
//------------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------------- Ball with Brick Collision ------------------------------------------------//

function ballWithBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x &&
                    ball.x - ball.radius < b.x + brick.width &&
                    ball.y + ball.radius > b.y && 
                    ball.y - ball.radius < b.y + brick.height) 
                    {

                    ball.dy = -ball.dy; // reverse condition of ball after destroy brick
                    BRICK_HIT.play();

                    b.strength = b.strength - 1;

                    // when strength = 0 then brick will destroy.
                    if (b.strength === 0) {
                        b.status = false; //brick will destroy when status will set to false.
                    }

                    // when brick will destroy, then score should be increase.
                    if (b.strength === 0) {
                        score += scoreCount;
                        localStorage.setItem("score", score);
                    }

                    switch (b.power) {
                        case 'S': PADDLE.width = PADDLE.width - 5;
                            break;

                        case 'L': PADDLE.width = PADDLE.width + 5;
                            BREAKOUT.play();
                            break;

                        case '-L': if (maxLife > 1) {
                            // maxLife = maxLife - 1
                            LIFE_DECREASE.play();
                            ball.speed += 0.1;
                            // Paddle.speed += 1.5;
                        }
                            break;

                        case '+L': if (maxLife < 4) {
                            maxLife = maxLife + 1
                        }
                            break;

                    }
                    // SCORE += SCORE_COUNT;
                }
            }
        }
    }
}
//----------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------------- Display Score, Level, Life -----------------------------------------------//
function displayGamePoints(text, textX, textY) {
    ctx.fillStyle = "white";
    ctx.font = "22px bold";
    ctx.fillText(text, textX, textY);
}
//-------------------------------------------------------------------------------------------------------------------------------//



//---------------------------------------------------- Game Over Condition ------------------------------------------------------//
function gameEnd() {

    if (maxLife <= 0) {
        gameOver = true;
        // displayGamePoints("Game Over", cvs.width / 2 - 50, cvs.height / 2);
        // displayGamePoints("Play Again !", cvs.width / 2 - 50, cvs.height / 2 + 30);
        // game over sound 
        window.location.href = "gameover.html";
    }
}
//-------------------------------------------------------------------------------------------------------------------------------//



//-------------------------------------------------- Game Level Increase ---------------------------------------------------//
function levelUp() {
    let isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status; // true + ture = move to next level otherwise stay on current level
        }
    }
    if (isLevelDone) {
        if (gameLevel === maxLevel) {
            gameOver = true;
            // displayGamePoints("Win Win !", cvs.width / 2 - 45, cvs.height / 2);
            window.location.href = "congratulations.html";
            return;
        }
        LEVEL_COMPLETED.play();
        brick.row++;
        bricksCreation();
        ball.speed += 0.3; //on level up ball speed will increase
        PADDLE.dx += 0.3; // on level up PADDLE speed will increase
        // brick.marginTop += 30;
        ballReset();
        gameLevel++;
        resetLife();
       
    }

}
//-------------------------------------------------------------------------------------------------------------------------------//


//------------------------------------------------ Obstacles Object Creation ----------------------------------------------------//
const OBSTACLE = {
    x: cvs.width / 2 - OBSTACLE_WIDTH / 2, // set position of obstacles
    y: cvs.height - OBSTACLE_MARGIN_BOTTOM - OBSTACLE_HEIGHT, // set hight of obstacles
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
}
// ---------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------- Moving Obstacle Try -------------------------------------------------//
// let checkObstacleStatus = false;


// movingObstacle = new Obstacle(canvas.width / 2 - 10, 0, 20, 50);
// movingObstacle1 = new Obstacle(canvas.width / 2 + 20, canvas.height - 50, 20, 50);


// movingObstacle.obstacledraw(color);
// movingObstacle1.obstacledraw(color);


// if (movingObstacle.y <= 0) {
//     checkObstacleStatus = true;
// }
// else if (movingObstacle.y >= canvas.height - movingObstacle.obsHeight) {
//     checkObstacleStatus = false;
// }

// if (movingObstacle1.y <= 0) {
//     checkObstacleStatus1 = true;
// }
// else if (movingObstacle1.y >= canvas.height - movingObstacle1.obsHeight) {
//     checkObstacleStatus1 = false;
// }


// movingObstacleMovement(check) {
//     if (check) {
//         color = "white";

//         this.y += this.dy;
//     }
//     else {
//         color = "white";
//         this.y -= this.dy
//     }

// }

// obstacleCollision1(movingObstacle);
// obstacleCollision1(movingObstacle1);

// movingObstacle.movingObstacleMovement(checkObstacleStatus);
// movingObstacle1.movingObstacleMovement(checkObstacleStatus1);

//-----------------------------------------------------------------------------------------------------------------//



//------------------------------------------- First Obstacle draw -------------------------------------------------//
function obstacleFirst() {
    // Middle Obstacle
    if (gameLevel === 2) {

        
        ctx.fillStyle = "black";
        ctx.fillRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);


        ctx.fillStyle = "red";
        ctx.fillRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        obstacleSecondCollision();
        obstacleThirdCollision();
    }
}
// -----------------------------------------------------------------------------------------------------------------//



//--------------------------------------------- Second Obstacle draw -----------------------------------------------//
function obstacleSecond() {
    // Left Obstacle
    if (gameLevel === 3) {

        //left obstacle
        ctx.fillStyle = "red";
        ctx.fillRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        //middle obstacle
        ctx.fillStyle = "black";
        ctx.fillRect(OBSTACLE.x, OBSTACLE.y + 10, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x, OBSTACLE.y + 10, OBSTACLE.width, OBSTACLE.height);

        // right obstacle
        ctx.fillStyle = "yellow";
        ctx.fillRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        obstacleFirstCollision();
        obstacleSecondCollision();
        obstacleThirdCollision();
    }
}
// ----------------------------------------------------------------------------------------------------------------//



//---------------------------------------------- Third Obstacle draw ----------------------------------------------//
function obstacleThird() {
    if (gameLevel === 4) {
        //left obstacle

        ctx.fillStyle = "yellow";
        ctx.fillRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        //middle2 obstacle
        ctx.fillStyle = "orange";
        ctx.fillRect(OBSTACLE.x, OBSTACLE.y + 80, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x, OBSTACLE.y + 80, OBSTACLE.width, OBSTACLE.height);

        // right obstacle
        ctx.fillStyle = "red";
        ctx.fillRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);
        // obstacleFirstCollision();
        obstacleSecondCollision();
        obstacleThirdCollision();
        obstacleFourthCollision();

    }
}
//---------------------------------------------- Level Fift Obstacle Added ----------------------------------------------//

function obstacleFourth() {
    if (gameLevel === 5) {
        //left obstacle

        ctx.fillStyle = "yellow";
        ctx.fillRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        //middle2 obstacle
        ctx.fillStyle = "orange";
        ctx.fillRect(OBSTACLE.x, OBSTACLE.y + 80, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x, OBSTACLE.y + 80, OBSTACLE.width, OBSTACLE.height);

        // right obstacle
        ctx.fillStyle = "red";
        ctx.fillRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);
        // obstacleFirstCollision();
        obstacleSecondCollision();
        obstacleThirdCollision();
        obstacleFourthCollision();

    }
}

// -------------------------------------------------------------------------------------------------------------//



//---------------------------------------------- Collision With First Obstacle ------------------------------------//
function obstacleFirstCollision() {
    if (ball.x + ball.radius > OBSTACLE.x && ball.x - ball.radius < OBSTACLE.x + OBSTACLE.width && ball.y + ball.radius > OBSTACLE.y + 10 && ball.y - ball.radius < OBSTACLE.y + 10 + OBSTACLE.height) {
        ball.dy = -ball.dy;
    }
}
// ----------------------------------------------------------------------------------------------------------------//


//-------------------------------------------- Collision With Second Obstacle -------------------------------------//
function obstacleSecondCollision() {
    if (ball.x + ball.radius > OBSTACLE.x - 300 && ball.x - ball.radius < OBSTACLE.x - 300 + OBSTACLE.width && ball.y + ball.radius > OBSTACLE.y + 100 && ball.y - ball.radius < OBSTACLE.y + 100 + OBSTACLE.height) {
        ball.dy = -ball.dy;
    }
}
// ----------------------------------------------------------------------------------------------------------------//


//-------------------------------------------- Collision With Third Obstacle ---------------------------------------//
function obstacleThirdCollision() {
    if (ball.x + ball.radius > OBSTACLE.x + 300 && ball.x - ball.radius < OBSTACLE.x + 300 + OBSTACLE.width && ball.y + ball.radius > OBSTACLE.y + 100 && ball.y - ball.radius < OBSTACLE.y + 100 + OBSTACLE.height) {
        ball.dy = -ball.dy;
    }
}
// ---------------------------------------------------------------------------------------------------------------------------//


//-------------------------------------------- Collision With Fourth Obstacle ---------------------------------------//
function obstacleFourthCollision() {
    if (ball.x + ball.radius > OBSTACLE.x && ball.x - ball.radius < OBSTACLE.x + OBSTACLE.width && ball.y + ball.radius > OBSTACLE.y + 80 && ball.y - ball.radius < OBSTACLE.y + 80 + OBSTACLE.height) {
        ball.dy = -ball.dy;
    }
}
// ------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------- Moving Paddle Using Button ------------------------------------------//

let leftBtn = document.getElementById("leftBtn");
let rightBtn = document.getElementById("rightBtn");

let lefttInterval;
let rightInterval;

console.log(rightInterval);
console.log(typeof (rightInterval) == "undefined");


leftBtn.addEventListener("touchstart",()=>{
    if(typeof(rightInterval) != "undefined"){
        clearInterval(rightInterval);
    }
    lefttInterval = setInterval(function (){
        if(leftBtn && PADDLE.x > 0){
            PADDLE.x -= PADDLE.dx;
        }

    }, 10);
});

leftBtn.addEventListener("touchend",()=>{
    if(typeof(lefttInterval) != "undefined"){
        clearInterval(lefttInterval);
    }
});

rightBtn.addEventListener("touchstart",()=>{			
    if(typeof(lefttInterval) != "undefined"){
        clearInterval(lefttInterval);
    }
    rightInterval = setInterval(function (){
        if (rightBtn && PADDLE.x + PADDLE.width < cvs.width) {
                PADDLE.x += PADDLE.dx;
        }
    }, 10);
});

rightBtn.addEventListener("touchend",()=>{
    if(typeof(rightInterval) != "undefined"){
        clearInterval(rightInterval);
    }
});

// leftBtn.addEventListener("mousedown", () => {
//     if (typeof (rightInterval) != "undefined") {
//         clearInterval(rightInterval);
//     }
//     lefttInterval = setInterval(function () {
//         if (leftBtn && PADDLE.x > 0 && isPause === false) {
//             PADDLE.x -= PADDLE.dx;
//         }

//     }, 10);
// });

// leftBtn.addEventListener("mouseup", () => {
//     if (typeof (lefttInterval) != "undefined") {
//         clearInterval(lefttInterval);
//     }
// });

// rightBtn.addEventListener("mousedown", () => {
//     if (typeof (lefttInterval) != "undefined") {
//         clearInterval(lefttInterval);
//     }
//     rightInterval = setInterval(function () {
//         if (rightBtn && PADDLE.x + PADDLE.width < cvs.width && isPause === false) {
//             PADDLE.x += PADDLE.dx;
//         }
//     }, 10);
// });
// rightBtn.addEventListener("mouseup", () => {
//     if (typeof (rightInterval) != "undefined") {
//         clearInterval(rightInterval);
//     }
// });
// ---------------------------------------------------------------------------------------------------------------------------//



//---------------------------------------------- Calling Drawing Functions --------------------------------------------//

function draw() {
    paddleDraw();
    ballDraw();
    bricksDraw();
    displayGamePoints("Score:" + score, 35, 25);
    localStorage.setItem("score", score); // storing scores in local storage

    displayGamePoints("Life:" + maxLife, cvs.width - 85, 25);
    displayGamePoints("Level:" + gameLevel, cvs.width / 2 - 40, 25);
    displayGamePoints(PLAYER_NAME, cvs.width / 1.4, 25);
    obstacleFirst();
    obstacleSecond();
    obstacleThird();
    obstacleFourth();
}
//--------------------------------------------------------------------------------------------------------------------------//



//------------------------------------------------ Calling Updation Functions ----------------------------------------------//

function updateAll() {
    paddleMove();
    ballMove();
    ballWithWallCollision();
    ballWithPaddleCollision();
    ballWithBrickCollision();
    gameEnd();
    levelUp();
}
// ------------------------------------------------------- Pause Function ----------------------------------------------------- //
let isPause = true;
function pauseToggle() {
    if (isPause === false) {
        isPause = true;
    }
    else {
        isPause = false;
    }
    // console.log(isPause);
}
// --------------------------------------------------------------------------------------------------------------------------//



// ------------------------------------------------------------ Loop function --------------------------------------------- //
function loop() {
    ctx.drawImage(BACKGROUND, 0, 0, 1200, 1000);
    // music.play();
    draw();
    if (!gameOver) {
        if (isPause === false) {
            updateAll();
            // console.log(isPause);
        }
        else {
            // console.log(isPause);
        }
    }
    else {
        updateAll();
        return;
    }
    requestAnimationFrame(loop);
}
// --------------------------------------------------------------------------------------------------------------------------//


// ---------------------------------------------------------- Timer For Game Start ----------------------------------------- //
// var counter = 4;
// function print() {
//     if (counter > 1) {
//         document.getElementById("counter").innerHTML = counter - 1;
//     } else {
//         document.getElementById("counter").innerHTML = "Go";
//     }
//     if (counter == 0) {
//         isPause = false;
//         document.getElementById("counter").style.display = "none";
//     }
//     counter--;
// }
// var intervalid = setInterval(() => {
//     print();
//     if (counter < 0) {
//         clearInterval(intervalid);
//     }
// }, 2000);
// --------------------------------------------------------------------------------------------------------------------------//
loop();
requestAnimationFrame(loop);


//--------------------------------------------------------------------------------------------------------------------------//


// function loop() {
//     ctx.drawImage(BACKGROUND, 0, 0, 1200, 1000);
//     update();
//     draw();
//     if (!gameOver) {
//         requestAnimationFrame(loop);  
//     }
// }
// loop();
// requestAnimationFrame(loop);



//-------------------------------------------------------- Random Function--------------------------------------------------//
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    //--------------------------------------------------------------------------------------------------------------------------//


//******************************************************** The - End ****************************************************** //
//************************************************************************************************************************ //
