export class Game extends Phaser.Scene{
    
    constructor() {
        super('Game')
        
        this.speedDownX = 0;
        this.speedLeftX = -5;
        this.speedRightX = 5;
        this.speedY = 5;




        this.bgSpeedX = this.speedDownX
        this.bgSpeedY = this.speedY

        this.speedMultiplier = 100
        this.trailIndex = 0
        this.obstacleDelay = 3000
        this.spawnNumber = 3


        
    }

    trailPath() {
        // Create a trail at the player's current position
        let trailTypes = ['trail_1', 'trail_2']; 
        let trail = null
        // Select the next trail type based on the index
        let trailType = trailTypes[this.trailIndex];

        // Toggle the index between 0 and 1
        this.trailIndex = (this.trailIndex + 1) % trailTypes.length;

        

        // Set the speed for the trail
        

        // Store the direction in which the player was moving when this trail was created
        if(this.lastPressedKey == 'left'){trail = this.add.image(this.player.x +40, this.player.y+30, trailType);trail.setAngle(45);}
        else if(this.lastPressedKey == 'right'){trail = this.add.image(this.player.x+40, this.player.y+30, trailType);trail.setAngle(-45);}
        else {trail = this.add.image(this.player.x+40, this.player.y+30, trailType);trail.setAngle(0);}
        
        trail.direction = this.lastPressedKey;
        trail.speed = this.speedY;

        //  //right
          //dowm
        this.trails.add(trail); // Add it to the trails group
        trail.setDepth(1);
        trail.setAlpha(0.8)

        // Add the trail movement logic
        trail.update = () => {
            // Move the trail upwards (default behavior)
            trail.y -= trail.speed;

            // If the trail goes off the screen, destroy it
            if (trail.y > 1250) {
                trail.destroy();
            }

            // Move the trail based on the player's movement direction


            if (trail.direction == this.lastPressedKey){
                if(trail.direction == 'left'){trail.x += 6;}
                else if(trail.direction == 'right'){trail.x -= 6;}
                else if(trail.direction == 'down'){trail.x = trail.x;}
            }
            
            else{
                if(this.lastPressedKey == 'left'){trail.x += 6;}
                else if(this.lastPressedKey == 'right'){trail.x -= 6;}
                else{trail.x = trail.x;}
                
            }
        };
    }






    



    
    create() {
        this.bg = this.add.tileSprite(0, 0, 1920, 1080, 'Texture')
        this.bg.setDepth(0);
        let bgScaleX = this.scale.width / this.bg.width;
        let bgScaleY = this.scale.height / this.bg.height;
        let bgScale = Math.max(bgScaleX, bgScaleY);
        this.bg.setScale(bgScale)
        this.bg.setOrigin(0,0)
        

        



        this.player = this.physics.add.sprite(930, 340, 'Player',3);
        this.player.setScale(0.85)

        let playerHitboxHeight = this.player.height * 0.4;
        let playerHitboxWidth = this.player.width * 0.3;
        let playerHitboxYOffset = this.player.height - playerHitboxHeight;

        this.player.setSize(playerHitboxWidth, playerHitboxHeight);
        this.player.setOffset(
            (this.player.width - playerHitboxWidth) / 2,
            playerHitboxYOffset
        );



        this.player.setOrigin(0,0)
        this.player.setDepth(2);
        this.player.setCollideWorldBounds(true)



        this.cursors = this.input.keyboard.createCursorKeys();
        this.createAnimations()
        let snow = this.add.sprite(0, 0, 'snow',0).setDepth(20).setOrigin(0,0).setAlpha(0.7)

        snow.play('snowing');
        this.makeDistance()


        
        this.trails = this.physics.add.group()
        this.trailPath()


        this.getTrailDelay = () => {
            let baseSpeed = 4;  // Adjust based on initial game speed
            let baseDelay = 30;  // Default delay at normal speed
            return Math.max(baseDelay * (baseSpeed / this.speedY), 10);
            }


        

        this.trailEvent = this.time.addEvent({
                delay: this.getTrailDelay(), // Dynamic delay
                callback: this.trailPath,
                callbackScope: this,
                loop: true
            });

        this.time.addEvent({
            delay: 5000, // Every 5 seconds
            callback: this.increaseSpeed,
            callbackScope: this,
            loop: true
        });


        

        // Timer to spawn clouds every 2 seconds
        this.clouds = this.physics.add.group();
        

        this.time.addEvent({
            delay: 8000, // Every 5 seconds
            callback: this.spawnCloud,
            callbackScope: this,
            loop: true
        });

        this.obstacles = this.physics.add.group()
        
        this.spawner = this.time.addEvent({
            delay: this.obstacleDelay,
            callback: () => this.spawnTreeAndStoneGroups(this.spawnNumber),
            callbackScope: this,
            loop: true
        });


        this.physics.add.collider(this.player, this.obstacles, this.gameOver, null, this);
        this.updateTrailDelay()
        

        // Initial background scroll speed
        
    }

    addObstaclesTime(){
        this.obstacleDelay = this.obstacleDelay - this.speedMultiplier
        this.spawnNumber = parseFloat(this.spawnNumber+0.1)

        let spn = parseInt(this.spawnNumber)

        if(spn >= 5) {spn = 5}
        console.log(`${this.spawnNumber} /// ${spn}`)
        this.spawner.remove()

        this.spawner = this.time.addEvent({
            delay: this.obstacleDelay,
            callback: () => this.spawnTreeAndStoneGroups(spn),
            callbackScope: this,
            loop: true
        });

    }

    updateTrailDelay() {
                    this.trailEvent.remove(); // Remove the old timer

                    this.trailEvent = this.time.addEvent({
                        delay: this.getTrailDelay(), // New delay based on speed
                        callback: this.trailPath,
                        callbackScope: this,
                        loop: true
                    });
                }

    increaseSpeed(){
        this.speedY = 6 +0.2; // Scale the downward speed.

        this.speedLeftX = -5 +0.2; // Scale the downward speed
        this.speedRightX = 5 +0.2; // Scale the downward speed

        this.addObstaclesTime()
        this.updateTrailDelay()
    }


    makeDistance() {
        this.distance = 0; // Track distance

        // Create a graphics object for the rounded rectangle background
        this.distanceBg = this.add.graphics();
        
        // Set fill color and draw a rounded rectangle
        this.distanceBg.fillStyle(0xFFFFFF, 0.6); // White color with 80% opacity
        this.distanceBg.fillRoundedRect(860, 20, 200, 60, 25); // (x, y, width, height, cornerRadius)

        // Create the text
        this.distanceText = this.add.text(960, 55, "0m", {
            fontSize: '28px',
            fill: '#1A1930',
            fontFamily: 'Minecraft'
        }).setOrigin(0.5); // Center the text

        // Ensure text is on top of the background
        this.distanceBg.setDepth(9);
        this.distanceText.setDepth(10);
        
}



    spawnTreeAndStoneGroups(maxGroups) {
    const lil_obs_trees = ['pack_l_5', 'pack_l_4'];
    const lil_obs_stones = ['rock_1', 'rock_2', 'rock_3', 'rock_4'];

    // Define depth layers
    const DEPTH_LAYERS = {
        STONES: 3,
        TREES: 4,    // Higher than stones
        SHADOWS: 2   // Lower than both objects
    };

    for (let i = 0; i < maxGroups; i++) {
        // Base position for this group
        let groupX = Phaser.Math.Between(100, 1800);
        let groupY = 1300; // Start offscreen

        // Spawn stones first (they'll be behind trees)
        const stoneCount = Phaser.Math.Between(1, 2);
        for (let s = 0; s < stoneCount; s++) {
            let offsetX = Phaser.Math.Between(-300, 300);
            let offsetY = Phaser.Math.Between(-250, 200)+500;
            let obs_key = Phaser.Utils.Array.GetRandom(lil_obs_stones);
            this.createStone(groupX + offsetX, groupY + offsetY, obs_key, DEPTH_LAYERS.STONES, DEPTH_LAYERS.SHADOWS);
        }

        // Spawn trees last (they'll be in front)
        const treeCount = Phaser.Math.Between(1, 3);
        for (let t = 0; t < treeCount; t++) {
            let offsetX = Phaser.Math.Between(-450, 450);
            let offsetY = Phaser.Math.Between(-300, 300)+500;
            let obs_key = Phaser.Utils.Array.GetRandom(lil_obs_trees);
            this.createTree(groupX + offsetX, groupY + offsetY, obs_key, DEPTH_LAYERS.TREES, DEPTH_LAYERS.SHADOWS);
        }
        }
    }

    createTree(x, y, obs_key, depth = 4, shadowDepth = 2) {
        let obstacle = this.physics.add.image(x, y, obs_key);
        obstacle.setDepth(depth);
        
        let hitboxHeight = obstacle.height * 0.1;
        let hitboxWidth = obstacle.width * 0.2;
        let hitboxYOffset = obstacle.height - hitboxHeight;

        obstacle.setSize(hitboxWidth, hitboxHeight);
        obstacle.setOffset(
            (obstacle.width - hitboxWidth) / 2,
            hitboxYOffset
        );

        let shadow = this.add.image(x + 25, y + 25, obs_key);
        shadow.setTint(0x888888);
        shadow.setAlpha(0.1);
        shadow.setDepth(shadowDepth);

        this.obstacles.add(obstacle);
        obstacle.checkWorldBounds = true;
        obstacle.outOfBoundsKill = true;
        obstacle.shadow = shadow;
    }

    createStone(x, y, obs_key, depth = 3, shadowDepth = 2) {
        let obstacle = this.physics.add.image(x, y, obs_key);
        obstacle.setDepth(depth);

        let shadow = this.add.image(x + 25, y + 25, obs_key);
        shadow.setTint(0x888888);
        shadow.setAlpha(0.1);
        shadow.setDepth(shadowDepth);

        let hitboxHeight = obstacle.height * 0.6;
        let hitboxWidth = obstacle.width * 0.6;
        let hitboxYOffset = obstacle.height - hitboxHeight;

        obstacle.setSize(hitboxWidth, hitboxHeight);
        obstacle.setOffset(
            (obstacle.width - hitboxWidth) / 2,
            hitboxYOffset - 20
        );

        this.obstacles.add(obstacle);
        obstacle.checkWorldBounds = true;
        obstacle.outOfBoundsKill = true;
        obstacle.shadow = shadow;
    }

    spawnCloud() {
        let cloudTypes = ['cloud_1', 'cloud_2']; // Different cloud types
        var cloudKey = null
        var allX = null
        var allY = null
        var x = 0
        var y = 0
        for (let i = 0; i < 2; i++) {
            cloudKey = Phaser.Utils.Array.GetRandom(cloudTypes); // Pick a random cloud
            allX = [Phaser.Math.Between(-100, 300),Phaser.Math.Between(1700, 2000)]; // Random X position
            x = allX[i];
            allY = [Phaser.Math.Between(1100,1500),Phaser.Math.Between(1100,1500)+200]; // Start above screen
            y = allY[i];
            let cloud = this.add.image(x, y, cloudKey);
            this.clouds.add(cloud);
            cloud.setAlpha(0.8); // Slightly transparent
            cloud.setScale(Phaser.Math.FloatBetween(1, 1.1)); // Random size
            cloud.setDepth(10);

            let shadow = this.add.image(x + 150, y - 300, cloudKey); // Offset for light effect
            shadow.setTint(0x888888); // Make it black
            shadow.setAlpha(0.1); // Make it semi-transparent
            shadow.setDepth(1); // Behind the obstacle
            shadow.setScale(1.2)


            // Parallax effect: Slower clouds move slower
            cloud.speed = this.speedY/4;
            cloud.update = () => {
                    cloud.y -= cloud.speed;
                    shadow.y = cloud.y - 300
                    shadow.x = cloud.x + 150
                    if (cloud.y < -150) { // If cloud moves off-screen, remove it
                        cloud.destroy();
                        // Spawn new cloud only when old one is gone
                    }
                    // Move obstacles in the opposite direction of player's movement
                    if (this.cursors.left.isDown || this.lastPressedKey == 'left') {
                        cloud.x += 1; // Move right if player moves left
                    } else if (this.cursors.right.isDown || this.lastPressedKey == 'right') {
                        cloud.x -= 1; // Move left if player moves right
                    }
                };
        }
 


        

        

        
        
         // Random speed for parallax effect

        // Add cloud movement to update loop
        


        
    }


    


    createAnimations(){
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('Player', { start: 2, end: 1 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'turnFromLeft',
            frames: this.anims.generateFrameNumbers('Player', { start: 1, end: 3 }),
            frameRate: 20
        });

        this.anims.create({
            key: 'turnFromRight',
            frames: this.anims.generateFrameNumbers('Player', { start: 5, end: 3 }),
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('Player', { start: 2, end: 5 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'gameover_btn_state_click',
            frames: this.anims.generateFrameNumbers('gameover_btn', { start: 0, end: 1 }),
            frameRate: 20,
            repeat:0
        });

        this.anims.create({
            key: 'gameover',
            frames: this.anims.generateFrameNumbers('Player', { start: 0, end: 0 }),
            frameRate: 20,
            repeat:0
        });

        this.anims.create({
            key: 'snowing',
            frames: this.anims.generateFrameNumbers('snow', { start: 0, end: 3 }),
            frameRate: 5,
            repeat:-1
        });
    }


    handleMovement(){
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.bgSpeedX = this.speedLeftX;
            this.bgSpeedY = this.speedY;

            // this.player.setVelocityX(-speed);
            // this.player.setVelocityY(speed);

            this.lastPressedKey == 'left' ?  null:this.player.anims.play('left', true)
            
            this.lastPressedKey = 'left'
        } 
        
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.bgSpeedX = this.speedRightX;
            this.bgSpeedY = this.speedY;
            // this.player.setVelocityX(speed);
            // this.player.setVelocityY(speed);
            

            this.lastPressedKey == 'right' ?  null:this.player.anims.play('right', true)
            this.lastPressedKey = 'right'
        } 

        else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.bgSpeedX = this.speedDownX;
            this.bgSpeedY = this.speedY;
            // this.player.setVelocityY(speed);

            if (this.lastPressedKey != 'down') {
                this.lastPressedKey == 'right' ? this.player.anims.play('turnFromRight', true) : this.player.anims.play('turnFromLeft', true)
            }
            
            
            
            this.lastPressedKey = 'down'
        } 
    }



    
    update() {
        
        if (this.physics.world.isPaused) return;

        

        // this.player.setVelocity(0);

        this.handleMovement()
        

        
        

        // Scroll the background based on speed
        this.bg.tilePositionX += this.bgSpeedX;
        this.bg.tilePositionY += this.bgSpeedY;

        

        this.clouds.children.iterate((cloud) => {
            if (cloud && cloud.update)
            if (cloud && cloud.update) {
                cloud.update();
            }
        });

        this.trails.children.iterate((trail) => {
            trail.update();
        });




        this.obstacles.children.iterate((obstacle) => {
            if(obstacle){
                obstacle.y -= this.speedY*0.8; // Move obstacle up normally
                obstacle.shadow.y = obstacle.y -25
                // Move obstacles in the opposite direction of player's movement
                if (this.cursors.left.isDown || this.lastPressedKey == 'left') {
                    obstacle.x += Math.abs(this.speedLeftX)*0.8; // Move right if player moves left
                    obstacle.shadow.x = obstacle.x+25
                } else if (this.cursors.right.isDown || this.lastPressedKey == 'right') {
                    obstacle.x -= Math.abs(this.speedRightX)*0.8; // Move left if player moves right
                    obstacle.shadow.x = obstacle.x + 25
                }

                if (obstacle.y < -500) { // 50px buffer below the screen
                    console.log('kill')
                    obstacle.destroy();
                }
            }
            
            
        });


        this.distance += 0.1; // Adjust speed of counting
        this.distanceText.setText(`${Math.floor(this.distance)}m`);
        

    }
    

    gameOver() {
            // Stop all physics objects
            this.player.play('gameover')
            this.physics.pause();
            this.bgSpeedX = 0;
            this.bgSpeedY = 0;
            
            // Get game width and height
            let { width, height } = this.sys.game.config;

            // Semi-transparent gray overlay
            let overlay = this.add.graphics();
            overlay.fillStyle(0x000000, 0.5); // Black with 50% opacity
            overlay.fillRect(0, 0, width, height);

            // "Game Over" text
            let gameOverText = this.add.image(width / 2, height / 3,'gameover_text')

            gameOverText.setOrigin(0.5);
            gameOverText.setDepth(100)

            // Final Distance Text
            let finalDistanceText = this.add.text(width / 2, height / 2.2, `Distance: ${parseInt(this.distance)}m`, {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Minecraft'
            });
            finalDistanceText.setOrigin(0.5);
            finalDistanceText.setDepth(100)

            // Retry button
            let retryButton = this.add.text(width / 2, height / 1.8, 'Retry', {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                backgroundColor: '#ff0000',
                padding: { left: 20, right: 20, top: 10, bottom: 10 }
            });
            retryButton.setOrigin(0.5);
            retryButton.setInteractive();
            retryButton.setDepth(100)

            // Restart the game when retry is clicked
            retryButton.on('pointerdown', () => {
                this.scene.restart();
                this.speedDownX = 0;
                this.speedLeftX = -5;
                this.speedRightX = 5;
                this.speedY = 5;

                this.lastPressedKey = 'down'
                this.distance = 0

                this.bgSpeedX = this.speedDownX
                this.bgSpeedY = this.speedY

                this.speedMultiplier = 1
                this.trailIndex = 0
                this.obstacleDelay = 3000
                this.physics.resume()
                this.spawnNumber = 3


            });

            // Hover effect for the retry button
            retryButton.on('pointerover', () => {
                retryButton.setStyle({ backgroundColor: '#cc0000' });
            });
            retryButton.on('pointerout', () => {
                retryButton.setStyle({ backgroundColor: '#ff0000' });
            });

            // Make sure everything is on top
            overlay.setDepth(10);
            gameOverText.setDepth(11);
            finalDistanceText.setDepth(11);
            retryButton.setDepth(11);
        }
}