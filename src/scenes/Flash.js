export class FlashLight extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
    }

    preload() {
        this.load.image('background', 'assets/Texture.png');
        this.load.image('player', 'assets/player.png');
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background').setScale(2);

        // Create player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        //

        // Create a flashlight effect texture
        this.flashlight = this.make.graphics();
        this.flashlight.fillStyle(0xffffff, 1);
        this.flashlight.fillCircle(100, 100, 100); // Adjust flashlight size
        this.flashlight.generateTexture('flashlight', 200, 200);
        this.flashlight.destroy();

        // Flashlight sprite (invisible, used only for positioning)
        this.flashlightSprite = this.add.sprite(this.player.x, this.player.y, 'flashlight');
        this.flashlightSprite.setDepth(11);
    }

    update() {
        const speed = 200;
        let cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (cursors.right.isDown) this.player.setVelocityX(speed);
        else this.player.setVelocityX(0);

        if (cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (cursors.down.isDown) this.player.setVelocityY(speed);
        else this.player.setVelocityY(0);

        // Update flashlight position
        this.flashlightSprite.x = this.player.x;
        this.flashlightSprite.y = this.player.y;

        // Clear previous darkness and redraw it
        
    }
}