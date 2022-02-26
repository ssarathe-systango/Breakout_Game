//--------------------------------------------------- Break Out Game Using JavaScript -----------------------------------------//

const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");

const Width_Of_Paddle = 100;
const Height_Of_Paddle = 15;
const PADDLE_MARGIN_BOTTOM = 65;
const RADIUS_Of_Ball = 13;
const obstacleWidth = 100;
const obstacleHight = 15;
const obstacleMarginBottom = 350;

// Background Image
const BACKGROUND = new Image;
BACKGROUND.src = "./color1.jpg";

// ---------------------------------------------------- variable declaration --------------------------------------------------//
let leftArrow = false;
let rightArrow = false;
let maxLife = 3;
let score = 0;
let scoreCount = 5; // you will get 5 points per brick collision
let gameLevel = 1;
let maxLevel = 5;
let gameOver = false;

// stroke width of paddle and bricks
ctx.lineWidth = 2;

//------------------------------------------------------- Paddle Creation ----------------------------------------------------//
const paddle = {
    x: cvs.width / 2 - Width_Of_Paddle / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - Height_Of_Paddle,
    width: Width_Of_Paddle,
    height: Height_Of_Paddle,
    dx: 5 // moving speed of paddle
}

function Paddle_Draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "yellow";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//---------------------------------------------------------- Paddle Move -------------------------------------------------------//

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

function Paddle_Move() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

//--------------------------------------------------------- Ball Creation ------------------------------------------------------//

const ball = {
    x: cvs.width / 2,
    y: paddle.y - RADIUS_Of_Ball,
    radius: RADIUS_Of_Ball,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    // angle of ball random numbers will be generate between +3 to -3 
    dy: -3
}

function Ball_Draw() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "lightgreen";
    ctx.fill();

    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.closePath();

}

//----------------------------------------------------------- Ball Move ---------------------------------------------------------//

function Ball_Move() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}
//-------------------------------------------------------------------------------------------------------------------------------//



//---------------------------------------------------------- Ball / Wall Collision-----------------------------------------------//
function Ball_With_Wall_Collision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {
        maxLife--;
        Ball_Reset();
    }
}
//-------------------------------------------------------------------------------------------------------------------------------//




//-------------------------------------------------------- Reset Ball -----------------------------------------------------------//
function Ball_Reset() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - RADIUS_Of_Ball;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}
//-------------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------------- Reset Life After Level Up -----------------------------------------------//
function Reset_Life() {
    if (gameLevel > 1) {
        maxLife = 3;
    }

}
//------------------------------------------------------------------------------------------------------------------------------//



//----------------------------------------------------- Ball / Paddle Collision ------------------------------------------------//
function Ball_With_Paddle_Collision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y < paddle.y + paddle.height && ball.y > paddle.y) {

        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        collidePoint = collidePoint / (paddle.width / 2);

        let angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}
//------------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------------------- Bricks Creation ----------------------------------------------------//
const brick = {
    row: 1,
    column: 2,
    width: 80,
    height: 15,
    offSetLeft: 5,
    offSetTop: 10,
    marginTop: 40,
    fillColor: " #004080",
    strokeColor: "white"
}

const COLORS = {
    'S': 'yellow',  // Reduce paddle length
    'L': 'blue',    // Increase paddle length
    'N': 'white',
    '+L': 'green',   // Life++
    '-L': 'red'      // Life--
}

const STROKCOLORS = {
    1: "white",
    2: "black"
}
//---------------------------------------------------------------------------------------------------------------------------------//

//------------------------------------------ Array for filling Random Color In Bricks --------------------------------------------//

let power = ['S', 'N', '+L', '-L', 'L', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']

//-------------------------------------------------------------------------------------------------------------------------------//


//------------------------------------------------- Array for Bricks Creation --------------------------------------------------//
let bricks = [];

function Bricks_Creation() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                power: power[getRandomInt(0, power.length)],
                status: true,
                strength: getRandomInt(1, 2) // distroy bricks randomly, maximum 2 hit allowed.
            }
        }
    }
}
Bricks_Creation();
//-----------------------------------------------------------------------------------------------------------------------------//



//------------------------------------------------------ Draw Bricks ----------------------------------------------------------//
function Bricks_Draw() {
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

function Ball_With_Brick_Collision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = -ball.dy;

                    b.strength = b.strength - 1;
                    // when strength = 0 then brick will not destroy.
                    if (b.strength === 0) {
                        b.status = false;
                    }

                    // when brick will destroy, then score should be increase.
                    if (b.strength === 0) {
                        score += scoreCount;
                    }

                    switch (b.power) {
                        case 'S': paddle.width = paddle.width - 5;
                            break;

                        case 'L': paddle.width = paddle.width + 15;
                            break;

                        case '-L': if (maxLife > 1) {
                            maxLife = maxLife - 1
                        }
                            break;

                        case '+L': if (maxLife < 3) {
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
function DisplayGamePoints(text, textX, textY) {
    ctx.fillStyle = "white";
    ctx.font = "22px bold";
    ctx.fillText(text, textX, textY);
}
//-------------------------------------------------------------------------------------------------------------------------------//




//---------------------------------------------------- Game Over Condition ------------------------------------------------------//
function Game_End() {
    if (maxLife <= 0) {
        gameOver = true;
        DisplayGamePoints("Game Over", cvs.width / 2 - 50, cvs.height / 2);
        DisplayGamePoints("Play Again !", cvs.width / 2 - 50, cvs.height / 2 + 30);
    }
}
//-------------------------------------------------------------------------------------------------------------------------------//




//-------------------------------------------------- Level Increase Condition ---------------------------------------------------//
function Level_Up() {
    let isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }
    if (isLevelDone) {
        if (gameLevel == maxLevel) {
            gameOver = true;
            DisplayGamePoints("Win Win !", cvs.width / 2 - 45, cvs.height / 2);
            return;
        }
        brick.row++;
        Bricks_Creation();
        ball.speed += 0.9; //on level up ball speed will increase
        paddle.dx += 2.0; // on level up paddle speed will increase
        // brick.offSetTop += 30;
        Ball_Reset();
        gameLevel++;
        Reset_Life();
        // paddle.width = paddle.width - 20;
    }

}
//-------------------------------------------------------------------------------------------------------------------------------//


//------------------------------------------------ Obstacles Object Creation ----------------------------------------------------//
const OBSTACLE = {
    x: cvs.width / 2 - obstacleWidth / 2, // set position of obstacles
    y: cvs.height - obstacleMarginBottom - obstacleHight, // set hight of obstacles
    width: obstacleWidth,
    height: obstacleHight,
}

//--------------------------------------------------- First Obstacle Draw -------------------------------------------------------//
function obstacleFirst() {
    // Middle Obstacle
    if (gameLevel === 2) {

        ctx.fillStyle = "black";
        ctx.fillRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);


        ctx.fillStyle = "black";
        ctx.fillRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        obstacleSecondCollision();
        obstacleThirdCollision();
    }
}

//--------------------------------------------------- Second Obstacle Draw -------------------------------------------------------//
function obstacleSecond() {
    // Left Obstacle
    if (gameLevel === 3) {
        ctx.fillStyle = "black";
        ctx.fillRect(OBSTACLE.x, OBSTACLE.y + 80, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x, OBSTACLE.y + 80, OBSTACLE.width, OBSTACLE.height);


        ctx.fillStyle = "black";
        ctx.fillRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);


        ctx.fillStyle = "black";
        ctx.fillRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(OBSTACLE.x - 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        obstacleFirstCollision();
        obstacleSecondCollision();
        obstacleThirdCollision();
    }
}

//--------------------------------------------------- Third Obstacle Draw -------------------------------------------------------//
function obstacleThird() {
    // Right Obstacle
    if (gameLevel === 4) {
        // ctx.fillStyle = "black";
        // ctx.fillRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);

        // ctx.strokeStyle = "white";
        // ctx.strokeRect(OBSTACLE.x + 300, OBSTACLE.y + 100, OBSTACLE.width, OBSTACLE.height);
        // obstacleThirdCollision();
    }
}


//------------------------------------------------ Collision With First Obstacle --------------------------------------------//
function obstacleFirstCollision() {
    if (ball.x + ball.radius > OBSTACLE.x && ball.x - ball.radius < OBSTACLE.x + OBSTACLE.width && ball.y + ball.radius > OBSTACLE.y + 80 && ball.y - ball.radius < OBSTACLE.y + 80 + OBSTACLE.height) {
        ball.dy = -ball.dy;
    }
}

//------------------------------------------------ Collision With Second Obstacle --------------------------------------------//
function obstacleSecondCollision() {
    if (ball.x + ball.radius > OBSTACLE.x - 300 && ball.x - ball.radius < OBSTACLE.x - 300 + OBSTACLE.width && ball.y + ball.radius > OBSTACLE.y + 100 && ball.y - ball.radius < OBSTACLE.y + 100 + OBSTACLE.height) {
        ball.dy = -ball.dy;
    }
}

//------------------------------------------------ Collision With Third Obstacle --------------------------------------------//
function obstacleThirdCollision() {
    if (ball.x + ball.radius > OBSTACLE.x + 300 && ball.x - ball.radius < OBSTACLE.x + 300 + OBSTACLE.width && ball.y + ball.radius > OBSTACLE.y + 100 && ball.y - ball.radius < OBSTACLE.y + 100 + OBSTACLE.height) {
        ball.dy = -ball.dy;
    }
}

//---------------------------------------------- Calling Drawing Functions-----------------------------------------//

function Draw() {
    Paddle_Draw();
    Ball_Draw();
    Bricks_Draw();
    DisplayGamePoints("Score:" + score, 35, 25);
    DisplayGamePoints("Life:" + maxLife, cvs.width - 85, 25);
    DisplayGamePoints("Level:" + gameLevel, cvs.width / 2 - 40, 25);
    obstacleFirst();
    obstacleSecond();
    obstacleThird();
}
//----------------------------------------------------------------------------------------------------------------------//



//---------------------------------------------- Calling Updation Functions ---------------------------------------//

function update() {
    Paddle_Move();
    Ball_Move();
    Ball_With_Wall_Collision();
    Ball_With_Paddle_Collision();
    Ball_With_Brick_Collision();
    Game_End();
    Level_Up();
}


function loop() {
    ctx.drawImage(BACKGROUND, 0, 0, 1200, 1000);

    Draw();

    update();

    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}
loop();
requestAnimationFrame(loop);

//----------------------------------------------------------------------------------------------------------------------//




//-------------------------------------- Function for generate random colors for bricks ------------------------------//
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
