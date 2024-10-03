//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width : playerWidth,
    height : playerHeight,
    velocityX : playerVelocityX
}

//ball

let ballHeight = 10;
let ballWidth = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockCollums = 8;
let blockRows = 3;
let maxRows = 10; // limit how many blocks
let blockCount = 0;

//starting block corner top left

let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // for drawing on the board

    //draw player
    context.fillStyle = "yellow";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    //create blocks
    createBlocks();
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    //refresh frame
    context.clearRect(0, 0, board.width, board.height);

    //player
    context.fillStyle = "yellow";
    context.fillRect(player.x, player.y, player.width, player.height);

    //ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //bounce ball off walls
    if(ball.y <= 0){
        //touch top wall
        ball.velocityY *=-1;
    }else if(ball.x <= 0 || (ball.x + ball.width) >= boardWidth){
        //touch left or right wall
        ball.velocityX *= -1; //reverse
    }
    else if(ball.y + ballHeight >= boardHeight){
        //touch bottom wall
        //gameover
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart",80,400);
        gameOver = true;
    }

    // bounce the ball off player paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)){
        ball.velocityY *= -1; // flip y direction up or down
    }else if(leftCollision(ball, player) || rightCollision(ball, player)){
        ball.velocityX *=-1; //flip x direction left or right
    } 

    //block
    context.fillStyle = "yellow"
    for(let i=0; i< blockArray.length; i++){
        let block = blockArray[i];
        if(!block.break){
            if(topCollision(ball, block) || bottomCollision(ball, block)){
                block.break = true;
                ball.velocityY *= -1; // flip y direction of the ball
                blockCount -= 1;
                score+=100;
            }
            else if(leftCollision(ball, block) || rightCollision(ball, block)){
                block.break = true;
                ball.velocityX *= -1; // flip x direction of the ball
                blockCount -= 1;
                score+=100;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //nextLevel

    if(blockCount == 0){
        score += 100*blockRows*blockCollums; 
        blockRows = Math.min(blockRows + 1, blockRows);
        createBlocks();
    }

    //score
    context.font = "20px sans-serif";
    context.fillText(score,10,25);
}

function outOfBounds(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e){
    if(gameOver){
        if(e.code == "Space"){
            resetGame();
        }
    }

    if(e.code == "ArrowLeft"){
        let nextPlayerx = player.x - player.velocityX;
        if(!outOfBounds(nextPlayerx)){
            player.x = nextPlayerx;
        }
    }else if(e.code == "ArrowRight"){
       let nextPlayerx = player.x + player.velocityX;
       if(!outOfBounds(nextPlayerx)){
            player.x = nextPlayerx;
       }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width && // a top left does not reach b top right
            a.x + a.width > b.x && // a top right passes b top left
            a.y < b.y + b.height && // a top left does not reach b bottom left
            a.y + a.height > b.y; // a bottom left passes b top left
}

function topCollision(ball, block){
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball ,block){
    return detectCollision(ball ,block) && (block.y + block.height) >= ball.y
}

function leftCollision(ball ,block){
    return detectCollision(ball, block) && (block.x + ball.width) >= block.x;
}

function rightCollision(ball ,block){
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks(){
    blockArray = []; //clear array
    for(let c =0; c<blockCollums; c++){
        for(let r=0; r<blockRows; r++){
            let block ={
                x: blockX + c*blockWidth + c*10, //c*10 = 10 pixels between columns
                y: blockY + r*blockHeight + r*10, //r*10 = 10 pixels between rows
                width: blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame(){
    gameOver = false;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width : playerWidth,
        height : playerHeight,
        velocityX : playerVelocityX
    }

    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width : ballWidth,
        height : ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }

    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();

}