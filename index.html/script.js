let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let paddleHeight = 15;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 10;
let brickColumnCount = 6;
let brickWidth = 67;
let brickHeight = 25;
let brickPadding = 10;
let brickOffsetTop = 25;
let brickOffsetLeft = 25;

let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
let score = 0;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startButton').style.display = 'none';
    setInterval(draw, 10);
});

window.onload = function() {
    let storedNickname = localStorage.getItem("nickname");
    let storedHighScore = localStorage.getItem("highScore") || 0;
    document.getElementById("highScore").innerText = storedHighScore;

    if(storedNickname) {
        document.getElementById("nickname").value = storedNickname;
    }
}

function startGame() {
    localStorage.setItem("highScore", 0);
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    document.getElementById("score").innerText = "Score: " + score;
                        if(score == brickRowCount * brickColumnCount) {
                        sessionStorage.setItem("finalScore", score);
                        window.location.href = "gameover.html";
                    }
                }
            }
        }

        if(y + dy < ballRadius) {
            dy = -dy;
        } else if(y + dy > canvas.height - ballRadius - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }

        if(y + dy > canvas.height - ballRadius) {
            let nickname = localStorage.getItem("nickname");
            let currentScore = score;
            let storedHighScore = localStorage.getItem("highScore") || 0;

            if (currentScore > storedHighScore) {
                storedHighScore = currentScore;
                localStorage.setItem("highScore", storedHighScore);
                document.getElementById("highScore").innerHTML = storedHighScore;
            }
            localStorage.setItem("finalScore", score);
            localStorage.setItem("finalNickname", nickname);
            window.location.href = "gameover.html";
        }
      }
    }
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

       if(y + dy > canvas.height - ballRadius) {
        sessionStorage.setItem("finalScore", score);
        window.location.href = "gameover.html";
       }

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            let finalScore = document.getElementById("score").innerTEXT;
            sessionStorage.setItem("finalScore", finalScore);

            window.location.href = "gameover.html";
        }
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}

setInterval(draw, 10);