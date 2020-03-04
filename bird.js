class Bird {

    constructor() {
        this.x = 100;
        this.y = canvasH / 2;
        this.w = 50;
        this.h = 40;
        this.vel = 0;
        this.acc = 0.4;
        this.jumpForce = -5;
    }

    display() {
        image(birdImg, this.x, this.y, this.w, this.h);
    }

    move() {
        this.y += this.vel;    // Add velocity to position y
        this.vel += this.acc;  // Add acceleration to velocity
    }

    jump() {
        this.vel = this.jumpForce;  // Set velocity to jump force
    }

    // Checks for collisions with walls/pipes
    // Also increments score if passed between pipes
    checkCollide() {
        // Checks for collision with top/bottom wall
        if (this.y >= canvasH - this.w / 2 || this.y <= this.w / 2) {
            return true;
        }

        for (let i = 0; i < pipes.length; i++) {
            let other = pipes[i];
            // Checks for passing between pipes
            // If this is a top pipe and pt available
            // Increment score if yes
            if (i % 2 == 0 && !other.ptAdded) {
                if (
                    (this.x > other.x - other.w / 2 && this.x < other.x + other.w / 2) &&
                    (this.y > other.y + other.h / 2 && this.y < other.y + other.h / 2 + pipeH)) {
                    score++;
                    other.ptAdded = true;
                    pointSnd.play();
                }
            }

            // Checks for collision with pipe
            if (
                // A-top < B-bot
                (this.y - this.h / 2 < other.y + other.h / 2) &&
                // A-bot > B-top
                (this.y + this.h / 2 > other.y - other.h / 2) &&
                // A-right > B-left
                (this.x + this.w / 2 > other.x - other.w / 2) &&
                // A-left < B-right
                (this.x - this.w / 2 < other.x + other.w / 2))
                return true;
        }
        return false;
    }

}