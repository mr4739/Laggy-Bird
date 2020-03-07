// Mindy Ruan
// Final Project

let canvasW = 700, canvasH = 550;  // canvas dimensions
let pipes = [];                    // all pipes on screen
let pipeW = 60, pipeH = 120;       // pipe gap dimensions
let bird;
let mode;          // current game mode
let score;
let highScore;
let nextLag;        // time before next lag starts
let lagTime;        // time lag starts
let lagDur;         // lag duration
let pipeImg, pipeFImg, birdImg, bgImg;
let pixFont;
let titleSize = 50;
let subtitleSize = 30;

// Positions of bird and pipes when lag started
let fakePipes = [];
let fakeBirdPos;

// Game modes: Start, Play, Lag, Game Over
const Mode = {
    START: 'START',
    PLAY: 'PLAY',
    LAG: 'LAG',
    GAMEOVER: 'GAMEOVER',
}

let jumpSnd, pointSnd, gameOverSnd;

function preload() {
    pipeImg = loadImage('assets/pipe.png');
    pipeFImg = loadImage('assets/pipeF.png');
    birdImg = loadImage('assets/bird.png');
    pixFont = loadFont('assets/Pixellari.ttf');
    bgImg = loadImage('assets/background.png');
    jumpSnd = loadSound('assets/jump.mp3');
    pointSnd = loadSound('assets/point.mp3');
    gameOverSnd = loadSound('assets/gameover.mp3');
    pointSnd.setVolume(0.2);
}

function setup() {
    createCanvas(canvasW, canvasH);
    noStroke();
    rectMode(CENTER);
    imageMode(CENTER);
    frameRate(30);
    textFont(pixFont);
    textSize(titleSize);
    textAlign(CENTER, CENTER);
    fill(255);

    bird = new Bird();
    nextLag = genNextLag();
    lagDur = genLagDur();
    lagStart = 0;
    mode = Mode.START;
    score = 0;
    highScore = 0;
}

function draw() {
    image(bgImg, canvasW / 2, canvasH / 2, canvasW, canvasH);

    // Draw start screen
    if (mode == Mode.START) {
        image(birdImg, canvasW / 2, canvasH / 2 - 50, 50, 40);
        textSize(titleSize);
        fill(255);
        text('LAGGY BIRD', canvasW / 2, canvasH / 2);
        textSize(subtitleSize);
        fill(0, 22, 102);
        text(`High Score: ${highScore}\nSPACE to jump`, canvasW / 2, canvasH / 2 + 60);
    }

    // If time for next lag, switch to Lad mode and freeze screen
    if (mode == Mode.PLAY) {
        if (frameCount >= lagStart + nextLag) {
            mode = Mode.LAG;
            lagStart = frameCount;
            saveScene();
        }
    }

    // If Play/Lag mode, progress game
    if (mode == Mode.PLAY || mode == Mode.LAG) {
        // Remove pipes that moved offscreen
        if (pipes.length > 0 && pipes[0].x <= -pipeW / 2) {
            pipes.splice(0, 1);
        }
        // Display and move all pipes
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].display();
            pipes[i].move();
        }
        // Every 2 seconds, make new set of pipes
        if (frameCount % 60 == 0) {
            makePipes();
        }
        // Display and move bird
        bird.display();
        bird.move();
        // Check collisions with pipes, lose if collision
        if (bird.checkCollide()) {
            mode = Mode.GAMEOVER;
            if (score > highScore) highScore = score;
            gameOverSnd.play();
        }
        // Display score
        fill(255);
        textSize(titleSize);
        text(score, 50, 70);
    }

    // If Lag mode
    if (mode == Mode.LAG) {
        // If lag duration expires, switch to Play mode
        if (frameCount >= lagStart + lagDur) {
            mode = Mode.PLAY;
            nextLag = genNextLag();
            lagDur = genLagDur();
            lagStart = frameCount;
        } else {
            // Overlay frozen screen over the actual business
            image(bgImg, canvasW / 2, canvasH / 2, canvasW, canvasH);
            image(birdImg, fakeBirdPos[0], fakeBirdPos[1], bird.w, bird.h);
            for (let i = 0; i < fakePipes.length; i++) {
                let p = fakePipes[i];
                if (p[4]) {
                    image(pipeFImg, p[0], p[1], p[2], p[3]);
                } else {
                    image(pipeImg, p[0], p[1], p[2], p[3]);
                }
            }
        }
        text(score, 50, 70);
    }

    // Draw Game Over Screen
    if (mode == Mode.GAMEOVER) {
        bird.display();
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].display();
        }
        textSize(titleSize);
        fill(255);
        text(`GAME OVER\nScore: ${score}`, canvasW / 2, canvasH / 2 - 50);
        textSize(subtitleSize);
        fill(0, 22, 102);
        text(`High Score: ${highScore}\nR to Restart`, canvasW / 2, canvasH / 2 + 100);
    }
}

// Spawns a random set of pipes
function makePipes() {
    let setX = canvasW + pipeW / 2;
    let setY = random(250, canvasW - 250);
    let topY = setY / 2 - pipeH / 2;
    let botY = setY + (canvasH - setY + pipeH / 2) / 2;
    let pipeTop = new Pipe(setX, topY, pipeW, topY * 2, true);
    let pipeBot = new Pipe(setX, botY, pipeW, (canvasH - setY + pipeH / 2), false);
    pipes.push(pipeTop);
    pipes.push(pipeBot);
}

function keyPressed() {
    // SPACEBAR
    if (keyCode == 32 && mode == Mode.START) {
        mode = Mode.PLAY;
        lagStart = frameCount;
    }
    // SPACEBAR
    if (keyCode == 32 && (mode != Mode.GAMEOVER && mode != Mode.START)) {
        bird.jump();
        jumpSnd.play();
    }
    // R
    if (keyCode == 82) {
        reset();
        mode = Mode.START;
    }
}

// Generate random time 3-5 seconds til next lag starts
function genNextLag() {
    return random(3, 5) * 30;
}

// Generate random time 0.5-1.5 seconds for lag duration
function genLagDur() {
    return random(0.5, 1.5) * 30;
}

// Save current bird and pipe locations
function saveScene() {
    fakeBirdPos = [bird.x, bird.y];
    let newFakePipes = [];
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        newFakePipes.push([p.x, p.y, p.w, p.h, p.isFlip]);
    }
    fakePipes = newFakePipes;
}

function reset() {
    pipes = [];
    bird = new Bird();
    nextLag = genNextLag();
    lagDur = genLagDur();
    lagStart = frameCount;
    score = 0;
}