// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	
const containerSize = {x:sceneWidth,y:sceneHeight};

// pre-load the images (this code works with PIXI v6)
app.loader.
    add([
        "images/spaceship.png",
        "images/explosions.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// pre-load the images (this code works with PIXI v7)
// let assets;
// loadImages();
// async function loadImages(){
// // https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide#-replaces-loader-with-assets
// // https://pixijs.io/guides/basics/assets.html
// PIXI.Assets.addBundle('sprites', {
//   spaceship: 'images/spaceship.png',
//   explosions: 'images/explosions.png',
//   move: 'images/move.png'
// });
//
// assets = await PIXI.Assets.loadBundle('sprites');
// setup();
// }

// aliases
let stage;

// game variables
let startScene;
let gameScene,ship,scoreLabel,lifeLabel,shootSound,hitSound,fireballSound;
let gameOverScene;
let upgradeScene;
let background;

let circles = [];
let enemies = [];
let bullets = [];
let eBullets = [];
let aliens = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let upgradeNum = 1;
let paused = true;
let upgradeChosen = false;
let pierce = false;

// Upgrade array 
let upgradeArr = [];
//upX is a placeholder name
let up1 = false; let up2 = false; let up3 = false; let up4 = false; let up5 = false; let up6 = false;
upgradeArr.push(up1, up2, up3, up4, up5, up6);

function setup() {
	stage = app.stage;
	// 1 - Create the `start` scene
	startScene = new PIXI.Container();
    stage.addChild(startScene);

	// 2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

	// 3 - Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
    
    // Create the upgradeScene and make it invisible
    upgradeScene = new PIXI.Container();
    upgradeScene.visible = false;
    stage.addChild(upgradeScene);

	// 4 - Create labels for all 3 scenes
	createLabelsAndButtons();

	// 5 - Create ship
    ship = new Ship();
    gameScene.addChild(ship);
	
	// 6 - Load Sounds
    shootSound = new Howl( {
        src: ['sounds/shoot.wav']
    } );
    
    hitSound = new Howl( {
        src: ['sounds/hit.mp3']
    } );

    fireballSound = new Howl( {
        src: ['sounds/fireball.mp3']
    } );
	
	// 7 - Load sprite sheet
    explosionTextures = loadSpriteSheet();
		
	// 8 - Start update loop
    app.ticker.add(gameLoop);
	
	// 9 - Start listening for click events on the canvas
    app.view.onclick = fireBullet;

	// Now our `startScene` is visible
	// Clicking the button calls startGame()
}

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle( {
        fill: 0xE69830,
        fontSize: 48,
        fontFamily: "Morgana Personal Use"
    } );

    // 1 - Setup 'startScene'
    // 1A - Make top start label
    let startLabel1 = new PIXI.Text(" DUSTSTORM");
    startLabel1.style = new PIXI.TextStyle( {
        fill: 0xA67F4C,
        fontSize: 128,
        fontFamily: "Morgana Personal Use",
        stroke: 0xE69830,
        strokeThickness: 6
    } );
    startLabel1.x = 50;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    // 1B - Make middle start label
    let startLabel2 = new PIXI.Text("");
    startLabel2.style = new PIXI.TextStyle( {
        fill: 0xffffff,
        fontSize: 32,
        fontFamily: "Morgana Personal Use",
        stroke: 0xE69830,
        strokeThickness: 6
    } );
    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    // 1C - Make start game button 
    let startButton = new PIXI.Text("Dump the clutch");
    startButton.style = buttonStyle;
    startButton.x = 80;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame); // startGame function reference
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    // 2 - Setup 'gameScene'
    let textStyle = new PIXI.TextStyle( {
        fill: 0xA67F4C,
        fontSize: 18,
        fontFamily: "Futura",
        stroke: 0xE69830,
        strokeThickness: 4
    });

    // 2A - Make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    // 2B - Make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    // 3 - Setup 'gameOverScene'
    // 3A - Make game over text
    let gameOverText = new PIXI.Text("\t     Game Over!");
    textStyle = new PIXI.TextStyle( {
        fill: 0xA67F4C,
        fontSize: 64,
        fontFamily: "Morgana Personal Use",
        stroke: 0xE69830,
        strokeThickness: 6
    } );
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    // 3B - Make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 150;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame);
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7);
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainButton);

    // Setup persistant upgrade scene elements 

}

function loadSpriteSheet() {
    // 16 enimation frames in each row are 64x64px
    // Using the second row
    // https:/pixijs.download/release/docs/PIXI.BaseTexture.html
    let spriteSheet = PIXI.BaseTexture.from("images/explosions.png");
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];
    for (let i=0; i<numFrames; i++){
        // https://pixijs.download/release/docs/PIXI.texture.html
        let frame = new PIXI.Texture(
            spriteSheet,
            new PIXI.Rectangle(
                i*width,
                64,
                width,
                height
            ));
        textures.push(frame);
    }
    return textures;
}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    levelNum = 1;
    score = 0;
    life = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    ship.x = 300;
    ship.y = 550;
    loadLevel();
}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = 'Score    ' + score;
}

function decreaseLifeBy(value) {
    life -= value;
    life = parseInt(life);
    lifeLabel.text = 'Life    ' + life + '%';
}

function gameLoop() {
    if (paused) { return; } 

    // 1 - Calculate "deltaTime"
    let deltaTime = 1/app.ticker.FPS;
    if (deltaTime > 1/12) { deltaTime = 1/12; }

    // 2 - Move Ship
    let mousePosition = app.renderer.plugins.interaction.mouse.global;
    let amt = 6 * deltaTime;

    // Lerp the x and y values
    let newX = lerp(ship.x, mousePosition.x, amt);
    let newY = lerp(ship.y, mousePosition.y, amt);

    // keep the ship on the screen 
    let w2 = ship.width/2;
    let h2 = ship.height/2;
    ship.x = clamp(newX, 0 + w2, sceneWidth - w2);
    ship.y = clamp(newY, 0 + h2, sceneHeight - h2);

    // 3 - Move Circles
    for (let c of circles) {
        c.move(deltaTime);
        if (c.x <= c.radius || c.x >= sceneWidth - c.radius) {
            c.reflectX();
            c.move(deltaTime);
        }
        if (c.y < c.radius || c.y >= sceneHeight - c.radius) {
            c.reflectY();
            c.move(deltaTime);
        } 
    }

    // Move enemies
    for (let e of enemies) {
        e.move(deltaTime);
        if (e.x <= e.radius || e.x >= sceneWidth - 32) {
            e.reflectX();
            e.move(deltaTime);
        }
        if (e.y < e.radius || e.y >= sceneHeight - 32) {
            e.reflectY();
            e.move(deltaTime);
        } 
    }

    /*
    for (let e of enemies) {
        let random = getRandomInt(1, 11);
        if (random == 1) {
            let eB = new EBullet(
                0x576862,
                e.x,
                e.y
            );
            eBullets.push(eB);
            gameScene.addChild(eB);
        }
    }
    */

    // 4 - Move Bullets
    for (let b of bullets) {
        b.move(deltaTime);

        // if a bullet is of type x, then call another move 
    }

    /*
    for (let eB of eBullets) {
        eB.move(deltaTime);
    }
    */

    // 5 - Check for collisions
    for (let c of circles) {
        // 5A - circles and bullets
        for (let b of bullets) {
            if (rectsIntersect(c, b)) {
                fireballSound.play();
                createExplosion(c.x, c.y, 64, 64); 
                if (!pierce) {
                    gameScene.removeChild(b);
                    b.isAlive = false;
                }
                gameScene.removeChild(c);
                c.isAlive = false;
                increaseScoreBy(1);
            }
            if (b.y < -10) { b.isAlive.false; }
        }

        // 5B - circles and ship
        if (c.isAlive && rectsIntersect(c, ship)) {
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(20);
        }
    }

    /*
    // Enemy and player
    for (let e of enemies) {
        if (e.isAlive && rectsIntersect(e, ship)) {
            hitSound.play();
            gameScene.removeChild(e);
            e.isAlive = false;
            decreaseLifeBy(50);
        }
    }

    // Enemy bullets and player
    for (let eB of eBullets) {
        if (rectsIntersect(eB, ship)) {
            fireballSound.play();
            createExplosion(eB.x, eB.y, 64, 64);
            gameScene.removeChild(eB);
            eB.isAlive = false;
            decreaseLifeBy(30);
        }
    }
    */

    // 6 - Clean up
    bullets = bullets.filter(b => b.isAlive);
    //eBullets = eBullets.filter(eB => eB.isAlive);
    circles = circles.filter(c => c.isAlive);
    //enemies = enemies.filter(e => e.isAlive);
    explosions = explosions.filter(e => e.playing);

    // 7 - Is game over?
    if (life <= 0) {
        life = 0;
        end();
        return; // Skip 8
    }

    // 8 - Load next level
    if (circles == 0) {
        levelNum += 1;
        loadLevel();
    }
}

function createCircles(numCircles) {
    for (let i=0; i < numCircles; i++) {
        /*
        let random = getRandomInt(1, 4);
        if (random == 1) {
            createEnemy();
        } else {
            let c = new Circle(
                10,
                0xffff00
            );
            c.x = Math.random() * (sceneWidth - 50) + 25;
            c.y = Math.random() * (sceneHeight - 400) + 25;
            circles.push(c);
            gameScene.addChild(c);c
        }
        */

        let c = new Circle(
            10,
            0x734319
        );
        c.x = Math.random() * (sceneWidth - 50) + 25;
        c.y = Math.random() * (sceneHeight - 400) + 25;
        circles.push(c);
        gameScene.addChild(c);c
    }
}

function createEnemy() {
    let e = new Enemy();
    e.x = Math.random() * (sceneWidth - 50) + 25;
    e.y = Math.random() * (sceneHeight - 400) + 25;
    enemies.push(e);
    gameScene.addChild(e);
}

function loadLevel() {
    /*
    ---- Level Plan ----
    - every 5 levels allow for an upgrade 
        - this pulls up a screen that shows two choices of upgrades
    - Load Sequence each new level:
        - Check if the modulus of the level number is equal to 0
        - If it is, hide the game scene(or pause), and display the upgrade menu 
        - Once an option is selected load the next level and initialize variables for the upgrade
            - Section each of the conditionals for the upgrades  
    */
    
    // Call to the upgrade screen if the level milestone hit
    if (levelNum == 5) {
        upgradeScreen();
    } else if (levelNum == 10) {
        upgradeScreen();
    } else if (levelNum == 15) {
        upgradeScreen();
    }
    
    createCircles(levelNum * 3);
    //if (levelNum == 5) { tripleShot = true; }
    paused = false;
}

function fireBullet(e) {
    // let rect = app.view.getBoundingClientRect();
    // let mouseX = e.clientX - rect.x;
    // let mouseY = e.clientY - rect.y;
    // console.log(mouseX + "," + mouseY);
    let timer = 0;
    let timeUntilShot = 0.5;

    if (paused) { return; }
    
    if (upgradeArr[1]) { // Triple Shot fire mode 
        tripleShotMode(); 
    }
    else if (upgradeArr[0]) { // Split Shot fire mode
        splitShot();
    }
    else if (upgradeArr[2]) { // Big Shot
        bigShot();
    }
    else if (upgradeArr[3]) { // Bullet Storm 
        bulletStorm();
    }
    else if (upgradeArr[4]) { // Piercing Shot
        if (upgradeArr[1]) { // Triple Shot fire mode 
            tripleShot();
        }
        else if (upgradeArr[0]) { // Split Shot fire mode
            splitShot();
        }
        else if (upgradeArr[2]) { // Big Shot
            bigShot();
        }
        else if (upgradeArr[3]) { // Bullet Storm 
            bulletStorm();
        }
        else {
            // Create bullet 
            let b = new Bullet(
                0xffffff,
                ship.x,
                ship.y
            );
            bullets.push(b);
            gameScene.addChild(b);
        }
        // Piercing shot isnt going to have any code itself
        // its just a bool that stops the bullet from being deleted 
        // might have to tune it to only go through a capped number of enemies
    }
    else if (upgradeArr[5]) { // Wave Shot
        waveShot();
    }
    else {
        // Create bullet 
        let b = new Bullet(
            0xffffff,
            ship.x,
            ship.y
        );
        bullets.push(b);
        gameScene.addChild(b);
    }
    shootSound.play();
}

// Bullet Functions
function splitShot() {
    let offX = -25;
    for (let i=0; i < 4; i++) {
        // Create bullet
        let b = new Bullet(
            0xffffff,
            ship.x + offX,
            ship.y
        );
        bullets.push(b);
        gameScene.addChild(b);
        
        // Update the offset 
        if (i == 1) {
            offX += 35;
        }
        else { offX += 5; }
    }
    // Reset the offset at the end of the volley 
    offX = -10;
}

function tripleShotMode() {
    let offX = -10;
    for (let i=0; i < 3; i++)
    {
        // Create bullet
        let b = new Bullet(
            0xffffff,
            ship.x + offX,
            ship.y
        );
        bullets.push(b);
        gameScene.addChild(b);

        // Update the offset 
        offX += 10;
    }
    // Reset the offset
    offX = -10;
}

function bigShot() {
    let offX = -15;
    for (let i=0; i < 12; i++) {
        let b = new Bullet(
            0xF02600,
            ship.x + offX,
            ship.y 
        );
        bullets.push(b);
        gameScene.addChild(b);

        offX += 3;
    }
    offX = -6;
}

function bulletStorm() {
    let offX, offY;
    for (let i=0; i < 7; i++) {
        offX = getRandomInt(-80, 81);
        offY = getRandomInt(0, 25);

        let b = new Bullet(
            0xffffff,
            ship.x + offX,
            ship.y + offY
        );
        bullets.push(b);
        gameScene.addChild(b);
    }
}

function waveShot() {
    let offX = -80, offY = 0, lastY;
    for (let i=0; i < 18; i++) {
        let b = new Bullet(
            0x59A2F0,
            ship.x + offX,
            ship.y + offY
        )
        bullets.push(b);
        gameScene.addChild(b);

        offX += 10;
        if (offY == 0) {
            offY = 10;
            lastY = 0;
        } else if (offY == 10 && lastY == 0) {
            offY = 20;
            lastY = 10;
        } else if (offY == 20) {
            offY = 10;
            lastY = 20;
        } else if (offY == 10 && lastY == 20) {
            offY = 0;
        }
    }
    offX = -40; offY = 0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
  

function createExplosion(x, y, frameWidth, frameHeight) {
    let w2 = frameWidth / 2;
    let h2 = frameHeight / 2;
    let explosion = new PIXI.AnimatedSprite(explosionTextures);
    explosion.x = x - w2;
    explosion.y = y - h2;
    explosion.animationSpeed = 1 / 7;
    explosion.loop = false;
    explosion.onComplete = e => gameScene.removeChild(explosion);
    explosions.push(explosion);
    gameScene.addChild(explosion);
    explosion.play();
}

function upgradeScreen() {
    // Determine what upgrades to show 
    let upText1, upText2;
    let u1, u2;
    if (levelNum == 5) {upText1 = "Split shot"; u1 = 0; upText2 = "Triple Shot"; u2 = 5;}
    if (levelNum == 10) {upText1 = "Big Shot"; u1 = 2; upText2 = "Bullet storm"; u2 = 3;}
    if (levelNum == 15) {upText1 = "Pierce"; u1 = 4; upText2 = "Wave Shot"; u2 = 5;}

    // Create the proper button style
    let buttonStyle = new PIXI.TextStyle( {
        fill: 0xE69830,
        fontSize: 48,
        fontFamily: "Morgana Personal Use"
    } );

    // Header label
    let upgradeLabel = new PIXI.Text(" Choose an upgrade");
    upgradeLabel.style = new PIXI.TextStyle( {
        fill: 0xA67F4C,
        fontSize: 84,
        fontFamily: "Morgana Personal Use",
        stroke: 0xE69830,
        strokeThickness: 6
    } );
    upgradeLabel.x = 50;
    upgradeLabel.y = 120;
    upgradeScene.addChild(upgradeLabel);

    // Create the lables and buttons for upgrades
    let upgrade1 = new PIXI.Text(upText1);
    upgrade1.style = buttonStyle;
    upgrade1.x = sceneWidth / 4 - 50;
    upgrade1.y = sceneHeight - (sceneWidth / 2 - 25);
    upgrade1.interactive = true;
    upgrade1.buttonMode = true;
    upgrade1.on("pointerup", () => {
        upgradeArr[u1] = true;
        if (u1 == 4) { pierce = true; }
        backToGame();
    }); // change the bool
    upgrade1.on('pointerover', e => e.target.alpha = 0.7);
    upgrade1.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(upgrade1); 

    let upgrade2 = new PIXI.Text(upText2);
    upgrade2.style = buttonStyle;
    upgrade2.x = sceneWidth * 0.75 - 75;
    upgrade2.y = sceneHeight - (sceneWidth / 2 - 25);
    upgrade2.interactive = true;
    upgrade2.buttonMode = true;
    upgrade2.on("pointerup", () => {
        upgradeArr[u2] = true;
        backToGame();
    }); // change the bool
    upgrade2.on('pointerover', e => e.target.alpha = 0.7);
    upgrade2.on('pointerout', e => e.currentTarget.alpha = 1.0);
    upgradeScene.addChild(upgrade2);

    // Hide the game scene and set the upgrade scene to visible
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = false;
    upgradeScene.visible = true;
    
    // Once an upgrade is selected, reverse the second step
    function backToGame() {
        upgradeScene.visible = false;
        upgradeScene.removeChild(upgrade1);
        upgradeScene.removeChild(upgrade2);
        gameScene.visible = true;
    }
}

function end() {
    paused = false;

    // Clear out the level
    circles.forEach(c => gameScene.removeChild(c));
    circles = [];

    bullets.forEach(b => gameScene.removeChild(b));
    bullets = [];

    explosions.forEach(e => gameScene.removeChild(e));
    explosions = [];

    gameOverScene.visible = true;
    gameScene.visible = false;

    let finalScore = new PIXI.Text(" Your final score: " + score);
    let textStyle = new PIXI.TextStyle( {
        fill: 0xA67F4C,
        fontSize: 36,
        fontFamily: "Futura",
        stroke: 0xE69830,
        strokeThickness: 5
    } );
    finalScore.style = textStyle;
    finalScore.x = 130;
    finalScore.y = sceneHeight/2 + 50;
    gameOverScene.addChild(finalScore);
}