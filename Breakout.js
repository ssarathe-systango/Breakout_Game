const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");

const Width_Of_Paddle = 100;
const Height_Of_Paddle = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const RADIUS_Of_Ball = 10;

// Background Image
const BACKGROUND = new Image;
BACKGROUND.src = "./color.jpg";

let leftArrow = false
let rightArrow = false
let LIFE = 3;
let SCORE = 0;
let SCORE_COUNT = 10;
let GAME_LEVEL = 1;
let MAX_LEVEL = 3;
let GAME_OVER = false;


ctx.lineWidth = 3;

const paddle = {
    x: cvs.width / 2 - Width_Of_Paddle / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - Height_Of_Paddle,
    width: Width_Of_Paddle,
    height: Height_Of_Paddle,
    dx: 5
}

function Paddle_Draw() {
    ctx.fillStyle = "orange";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "black";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

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

const ball = {
    x: cvs.width / 2,
    y: paddle.y - RADIUS_Of_Ball,
    radius: RADIUS_Of_Ball,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
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

function Ball_Move() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function Ball_With_Wall_Collision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        Ball_Reset();
    }
}

function Ball_Reset() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - RADIUS_Of_Ball;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

function Ball_With_Paddle_Collision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y < paddle.y + paddle.height && ball.y > paddle.y) {

        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        collidePoint = collidePoint / (paddle.width / 2);

        let angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

const brick = {
    row: 2,
    column: 10,
    width: 80,
    height: 25,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "navy",
    strokeColor: "white"
}

let bricks = [];

function Bricks_Creation() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}

Bricks_Creation();

function Bricks_Draw() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// Ball bricks collision

function Ball_With_Brick_Collision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = false;
                    SCORE += SCORE_COUNT;
                }
            }
        }
    }
}

// Display Score, Level, Life
function DisplayGamePoints(text, textX, textY) {
    ctx.fillStyle = "Black";
    ctx.font = "22px bold";
    ctx.fillText(text, textX, textY);

}

function Game_End() {
    if (LIFE <= 0) {
        GAME_OVER = true;
        DisplayGamePoints("Game Over", cvs.width / 2 - 50, cvs.height / 2);
        DisplayGamePoints("Play Again !", cvs.width / 2 - 50, cvs.height / 2 + 30);
    }
}

//Level up
function Level_Up() {
    let isLevelDone = true;

    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }

    if (isLevelDone) {
        if (GAME_LEVEL >= MAX_LEVEL) {
            GAME_OVER = true;
            WIN_SOUND.play();
            DisplayGamePoints("Win Win !", cvs.width / 2 - 45, cvs.height / 2);
            return;
        }
        brick.row++;
        Bricks_Creation();
        ball.speed += 0.9;
        Ball_Reset();
        GAME_LEVEL++;
    }
}

function Draw() {
    Paddle_Draw();
    Ball_Draw();
    Bricks_Draw();
    DisplayGamePoints("Score:" + SCORE, 35, 25);
    DisplayGamePoints("Life:" + LIFE, cvs.width - 85, 25);
    DisplayGamePoints("Level:" + GAME_LEVEL, cvs.width / 2 - 40, 25);
}

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

    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }
}

loop();
requestAnimationFrame(loop);
