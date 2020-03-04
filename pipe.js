class Pipe {

    constructor(x, y, w, h, isFlip) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.isFlip = isFlip;    // is this pipe upside down
        this.ptAdded = false;    // has a point been added for this pipe
    }

    display() {
        // Draw upside down or regular pipe
        if (this.isFlip) {
            image(pipeFImg, this.x, this.y, this.w, this.h);
        } else {
            image(pipeImg, this.x, this.y, this.w, this.h);
        }
    }

    // move pipe left
    move() {
        this.x -= 4;
    }

}