class Ship extends PIXI.Sprite {
    constructor( x = 0, y = 0 ) {
        super(app.loader.resources["images/spaceship.png"].texture);
        this.anchor.set(.5, .5); // set object origin to center of sprite
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}

/*
class Enemy extends PIXI.Sprite {
    constructor( x = 0, y = 0 ) {
        super(app.loader.resources["images/enemy.png"].texture);
        this.anchor.set(.5, .5); // set object origin to center of sprite
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.rotation = 180;
        this.speed = 50;
        this.isAlive = true;
    }

    move(deltaTime = 1/60) {
        this.x += this.fwd.x * this.speed * deltaTime;
        this.y += this.fwd.y * this.speed * deltaTime;
    }

    reflectX() {
        this.fwd.x *= -1;
    }

    reflectY() {
        this.fwd.y *= -1;
    }
}
*/

class Circle extends PIXI.Graphics {
    constructor(radius, color = 0xff0000, x = 0, y = 0) {
        super();
        this.beginFill(color);
        this.drawCircle(
            0,
            0,
            radius
        );
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;
        // Variables
        this.fwd = getRandomUnitVector();
        this.speed = 50;
        this.isAlive = true;
    }

    move(deltaTime = 1/60) {
        this.x += this.fwd.x * this.speed * deltaTime;
        this.y += this.fwd.y * this.speed * deltaTime;
    }

    reflectX() {
        this.fwd.x *= -1;
    }

    reflectY() {
        this.fwd.y *= -1;
    }
}

class Bullet extends PIXI.Graphics {
    constructor(color = 0xffffff, x = 0, y = 0) {
        super();
        this.beginFill(color);
        this.drawRect(
            -2,
            -3,
            4,
            6
        );
        this.endFill();
        this.x = x;
        this.y = y;
        //variables
        this.fwd = { x:0, y:-1 };
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(deltaTime = 1/60) {
        this.x += this.fwd.x * this.speed * deltaTime;
        this.y += this.fwd.y * this.speed * deltaTime;
    }
}

class EBullet extends PIXI.Graphics {
    constructor(color = 0x576862, x = 0, y = 0) {
        super();
        this.beginFill(color);
        this.drawRect(
            -2,
            -3,
            4,
            6
        );
        this.endFill();
        this.x = x;
        this.y = y;
        //variables
        this.fwd = { x:0, y:-1 };
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(deltaTime = 1/60) {
        this.x +- this.fwd.x * this.speed * deltaTime;
        this.y +- this.fwd.y * this.speed * deltaTime;
    }
}