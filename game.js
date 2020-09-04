const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');


rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

const cvs=document.getElementById("breakout");
const ctx= cvs.getContext("2d");

cvs.style.border="1px solid black";

ctx.lineWidth=3;

//game variables
const paddle_width=100;
const padde_height=20;
const paddle_bottom_margin=50;
const ball_radius=8;
const score_unit=10;
const max_level=1;

let left_arrow=false;
let right_arrow=false;
let life=3;
let score=0;
let level=1;
let game_over=false; 


//create paddle
const paddle={
    x :cvs.width/2 - paddle_width/2,
    y :cvs.height - paddle_bottom_margin - padde_height,
    width : paddle_width,
    height : padde_height,
    dx : 5
}

//draw paddle
function drawPaddle(){
    
    
    ctx.fillStyle = "balck"
    ctx.fillRect(paddle.x , paddle.y , paddle.width , paddle.height);
    
    ctx.strokeStyle="#ffcd05"
    ctx.strokeRect(paddle.x , paddle.y ,paddle.width , paddle.height);
    
}
//check which key is pressed
document.addEventListener("keydown",function(event){
    if(event.keyCode==37){
        left_arrow=true;
    }else if(event.keyCode==39){
        right_arrow=true;
    }
})

document.addEventListener("keyup",function(event){
    if(event.keyCode==37){
        left_arrow=false;
    }else if(event.keyCode==39){
        right_arrow=false;
    }
})

//move paddle
function movePaddel(){
    if(right_arrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(left_arrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

//create ball
const ball={
    x : cvs.width/2,
    y : paddle.y - ball_radius,
    radius : ball_radius,
    dx : 3 *(Math.random() *2 -1 ),
    dy : -3,
    speed : 4 
}

//draw ball
function drawBall(){
    ctx.beginPath();
    
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
    ctx.fillStyle="2e3548";
    ctx.fill();
    
    ctx.strokeStyle="ffcd05";
    ctx.stroke();
    ctx.closePath();
}

function moveBall(){
    ball.x+=ball.dx;
    ball.y+=ball.dy;
}

//rest ball 
function resetBall(){
    ball.x= cvs.width/2;
    ball.y= paddle.y - ball_radius;
    ball.dx = 3 *(Math.random() *2 -1 ) ;
    ball.dy = -3 ;
}

//reset padlle
function resetPaddle(){
    paddle.x= cvs.width/2 - paddle_width/2;
    paddle.y= cvs.height - paddle_bottom_margin - padde_height;
    paddle.dx =5 ;

}

//ball to wall collison
function ballWallCollision(){
    if(ball.x +ball.radius > cvs.width ||  ball.x - ball.radius < 0){
        ball.dx=-ball.dx;
        wall_hit.play();
    }else if(ball.y - ball.radius < 0){
        ball.dy=-ball.dy;
        wall_hit.play(); 
    }else if(ball.y+ball.radius > cvs.height){
        life_lost.play();
        life--;
        resetBall();
        resetPaddle();
    }
}

//ball to paddle colison
function ballPaddleCollision(){
    if(ball.x< paddle.x + paddle.width && ball.x >paddle.x && ball.y <paddle.y + paddle.height && ball.y > paddle.y){
        
        paddle_hit.play();
        let collide_point = ball.x -(paddle.x + paddle.width/2);
        
        collide_point= collide_point / (paddle.width/2);
        
        let angle= collide_point * Math.PI/3;
        
        ball.dx=ball.speed * Math.sin(angle);
        ball.dy=- ball.speed * Math.cos(angle);
    }
}

//create single brick
const brick={
    width : 50 ,
    height : 20,
    row : 1 ,
    column : 5 ,
    offset_top : 20,
    offset_left : 20,
    margin_top : 40,
    fillcolor : "#2e3548" ,
    strokecolor : "#fff"
}

//create array of bricks
let bricks = [];
function createBricks(){
    for(let r=0 ; r<brick.row ; r++){
        bricks[r]=[];
        for(let c=0 ; c<brick.column ; c++){
            bricks[r][c]={
                x: c*(brick.width+brick.offset_left)+brick.offset_left,
                y: r*(brick.height+brick.offset_top)+(brick.margin_top+brick.offset_top),
                status: true
            }
        }
    }
}

createBricks();


//draw bricks
function drawBricks(){
    for(let r=0 ; r<brick.row ; r++){
        for(let c=0 ; c<brick.column ; c++){
            let b= bricks[r][c];
            if(b.status){
                ctx.fillStyle=brick.fillcolor;
                ctx.fillRect(b.x ,b.y ,brick.width ,brick.height);
                
                ctx.strokeStyle=brick.strokecolor;
                ctx.strokeRect(b.x ,b.y ,brick.width ,brick.height);
                
            }
           
        }
    }
}


//ball to brick collison
function ballBrickCollision(){
    for(let r=0 ; r<brick.row ; r++){
        for(let c=0 ; c<brick.column ; c++){
            let b= bricks[r][c];
            if(b.status){
            if(ball.x+ball.radius > b.x 
               && ball.x - ball.radius < b.x + brick.width
               && ball.y + ball.radius > b.y
               && ball.y - ball.radius < b.y + brick.height
              ){
                brick_hit.play(); 
                ball.dy=-ball.dy;
                b.status=false;
                score += score_unit;
               }
            }
        }
    }
    
}

//show game staus
function showGameStatus(text, textx, texty, img ,imgx ,imgy){
    
    //ctx.fillStyle=" #FFF ";
    ctx.font=" 25px Germania One ";
    ctx.fillText(text, textx , texty);
    
    ctx.drawImage(img , imgx ,imgy, width=25  , height=25);
    
 }

//function game over
function gameOver(){
    if(life <=0){
        game_over=true;
        showYouLose();
    }
}

//levelup
function levelUp(){
    let level_done=true;
    
    for(let r=0 ; r<brick.row ; r++){
        for(let c=0 ; c<brick.column ; c++){
                level_done = level_done &&  ! bricks[r][c].status; 
        }
    }
    
    if(level_done){
        winner.play();
        
        if(level >= max_level ){
            game_over=true;
            showYouWin();
        }
        brick.row++;
        createBricks();
        ball.speed+=0.5;
        level++;
        resetBall();
        resetPaddle();
    }   
    
    
}

//main draw
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
    //show score
    showGameStatus(score, 35 , 25, score_img ,5 , 5);
    
    //show level
    showGameStatus(level, cvs.width/2 , 25, level_img , cvs.width/2-30 ,5);
    
    
    //show life
    showGameStatus(life, cvs.width-25, 25, life_img , cvs.width-55 ,5);
}

//main update
function update(){
    movePaddel();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();

    gameOver();
    
    levelUp();
}



//main loop
function loop(){
    
    ctx.drawImage(bg_img,0,0)
    
    draw();
    
    update();
    
    if(!game_over){
        requestAnimationFrame(loop);
    }
    
}
loop();


//select sound
const sound_element= document.getElementById("sound");
sound_element.addEventListener("click", audioManager)
                               
function audioManager(){
    
    let img_src = sound_element.getAttribute("src");
    let sound_img = img_src == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    
    sound_element.setAttribute("src", sound_img);
    
    wall_hit.muted = wall_hit.muted ? false :true;
    paddle_hit.muted =paddle_hit.muted ? false :true;
    brick_hit.muted = brick_hit.muted ? false :true;
    winner.muted = winner.muted ? false :true;
    life_lost.muted = life_lost.muted ? false :true;
}


const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}