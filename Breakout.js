//************************************************* Break Out Game Using JavaScript ******************************************//
//***************************************************************************************************************************//



// -------------------------------------------------- Variable Initialization -------------------------------------------------// 
const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");

const Width_Of_Paddle = 100;
const Height_Of_Paddle = 15;
const PADDLE_MARGIN_BOTTOM = 65;
const RADIUS_Of_Ball = 13;
const obstacleWidth = 90;
const obstacleHight = 7;
const obstacleMarginBottom = 350;
const playerName = localStorage.getItem("user_name");
//--------------------------------------------------------------------------------------------------------------------------------//



// --------------------------------------------------------- Sound Initialization ------------------------------------------------//
const ballLost = new Audio();
ballLost.src = ('./sounds/mixkit-fairy-cartoon-success-voice-344.wav');

const breakout = new Audio();
breakout.src = ('./sounds/breakout.mp3');

const brickhit = new Audio();
brickhit.src = ('./sounds/brick.mp3');

const levelCompleted = new Audio();  // Level Completed Sound
levelCompleted.src = ('./sounds/smb_stage_clear.wav');

// const music = new Audio();  
// music.src = ('./sounds/music.mp3');

const paddleHit = new Audio();
paddleHit.src = ('./sounds/mixkit-negative-tone-interface-tap-2569.wav'); // Paddle Hit Sound

const LifeDecrease = new Audio();
LifeDecrease.src = ('./sounds/smb_warning.wav'); // On Hit Red Bricks
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
let gameLevel = 1;
let maxLevel = 5;
let gameOver = false;

ctx.lineWidth = 2.5; // stroke width of paddle and bricks
// ---------------------------------------------------------------------------------------------------------------------------//




//------------------------------------------------------- Paddle Creation ----------------------------------------------------//
const paddle = {
    x: cvs.width / 2 - Width_Of_Paddle / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - Height_Of_Paddle,
    width: Width_Of_Paddle,
    height: Height_Of_Paddle,
    dx: 6 // moving speed of paddle
}

function Paddle_Draw() {
    ctx.fillStyle = "yellow";

    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "yellow";
    // ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
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
function Paddle_Move() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}
// ---------------------------------------------------------------------------------------------------------------------------//



//--------------------------------------------------------- Ball Creation ------------------------------------------------------//
const ball = {
    x: cvs.width / 2,
    y: paddle.y - RADIUS_Of_Ball,
    radius: RADIUS_Of_Ball,
    speed: 4, // Initial Speed Of Ball
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
// ---------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------------------- Ball Move ---------------------------------------------------------//
function Ball_Move() {
    ball.x += ball.dx; // Ball Moving Direction up on x-Axis
    ball.y += ball.dy; // Ball Moving Direction up on y- Axis
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
    if (ball.y + ball.radius > cvs.height) {  // ball goes outside of canvas  
        maxLife--; // life will decrease
        Ball_Reset(); // Ball will reset
        ballLost.play(); 
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
        maxLife = 4;
    }
}
//------------------------------------------------------------------------------------------------------------------------------//



//----------------------------------------------------- Ball / Paddle Collision ------------------------------------------------//
function Ball_With_Paddle_Collision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && 
        (ball.y + ball.radius) < paddle.y + paddle.height && (ball.y + ball.radius) > paddle.y) {
        paddleHit.play();
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
    'S': 'yellow',  // Reduce paddle length
    'L': 'blue',    // Increase paddle length
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
function Bricks_Creation() {
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
                if (ball.x + ball.radius > b.x &&
                    ball.x - ball.radius < b.x + brick.width &&
                    ball.y + ball.radius > b.y && 
                    ball.y - ball.radius < b.y + brick.height) 
                    {

                    ball.dy = -ball.dy; // reverse condition of ball after destroy brick
                    brickhit.play();

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
                        case 'S': paddle.width = paddle.width - 5;
                            break;

                        case 'L': paddle.width = paddle.width + 5;
                            breakout.play();
                            break;

                        case '-L': if (maxLife > 1) {
                            // maxLife = maxLife - 1
                            LifeDecrease.play();
                            ball.speed += 0.1;
                            // paddle.speed += 1.5;
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
        // DisplayGamePoints("Game Over", cvs.width / 2 - 50, cvs.height / 2);
        // DisplayGamePoints("Play Again !", cvs.width / 2 - 50, cvs.height / 2 + 30);
        // game over sound 
        window.location.href = "gameover.html";
    }
}
//-------------------------------------------------------------------------------------------------------------------------------//



//-------------------------------------------------- Game Level Increase ---------------------------------------------------//
function Level_Up() {
    let isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status; // true + ture = move to next level otherwise stay on current level
        }
    }
    if (isLevelDone) {
        if (gameLevel === maxLevel) {
            gameOver = true;
            // DisplayGamePoints("Win Win !", cvs.width / 2 - 45, cvs.height / 2);
            window.location.href = "congratulations.html";
            return;
        }
        levelCompleted.play();
        brick.row++;
        Bricks_Creation();
        ball.speed += 0.3;0 //on level up ball speed will increase
        paddle.dx += 0.5; // on level up paddle speed will increase
        // brick.marginTop += 30;
        Ball_Reset();
        gameLevel++;
        Reset_Life();
       
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
// ---------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------- Moving Obstacle Try -------------------------------------------------//
// let checkObstacleStatus = false;


// movingObstacle = new Obstacle(canvas.width / 2 - 10, 0, 20, 50);
// movingObstacle1 = new Obstacle(canvas.width / 2 + 20, canvas.height - 50, 20, 50);


// movingObstacle.obstacleDraw(color);
// movingObstacle1.obstacleDraw(color);


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



//------------------------------------------- First Obstacle Draw -------------------------------------------------//
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



//--------------------------------------------- Second Obstacle Draw -----------------------------------------------//
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



//---------------------------------------------- Third Obstacle Draw ----------------------------------------------//
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
        if(leftBtn && paddle.x > 0){
            paddle.x -= paddle.dx;
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
        if (rightBtn && paddle.x + paddle.width < cvs.width) {
                paddle.x += paddle.dx;
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
//         if (leftBtn && paddle.x > 0 && isPause === false) {
//             paddle.x -= paddle.dx;
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
//         if (rightBtn && paddle.x + paddle.width < cvs.width && isPause === false) {
//             paddle.x += paddle.dx;
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

function Draw() {
    Paddle_Draw();
    Ball_Draw();
    Bricks_Draw();
    DisplayGamePoints("Score:" + score, 35, 25);
    localStorage.setItem("score", score); // storing scores in local storage

    DisplayGamePoints("Life:" + maxLife, cvs.width - 85, 25);
    DisplayGamePoints("Level:" + gameLevel, cvs.width / 2 - 40, 25);
    DisplayGamePoints(playerName, cvs.width / 1.4, 25);
    obstacleFirst();
    obstacleSecond();
    obstacleThird();
    obstacleFourth();
}
//--------------------------------------------------------------------------------------------------------------------------//



//------------------------------------------------ Calling Updation Functions ----------------------------------------------//

function update_all() {
    Paddle_Move();
    Ball_Move();
    Ball_With_Wall_Collision();
    Ball_With_Paddle_Collision();
    Ball_With_Brick_Collision();
    Game_End();
    Level_Up();
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
    Draw();
    if (!gameOver) {
        if (isPause === false) {
            update_all();
            // console.log(isPause);
        }
        else {
            // console.log(isPause);
        }
    }
    else {
        update_all();
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
//     Draw();
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
