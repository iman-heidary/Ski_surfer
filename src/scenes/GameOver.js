export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        // Get game width and height
        let { width, height } = this.sys.game.config;

        // Semi-transparent gray overlay
        let overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5);
        overlay.setOrigin(0, 0);

        // "Game Over" text
        let gameOverText = this.add.text(width / 2, height / 3, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        gameOverText.setOrigin(0.5);

        // Retry button
        let retryButton = this.add.text(width / 2, height / 2, 'Retry', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#ff0000',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        });
        retryButton.setOrigin(0.5);
        retryButton.setInteractive();

        // Restart game on button click
        retryButton.on('pointerdown', () => {
            this.scene.start('Game'); // Restart the game scene
        });

        // Hover effect
        retryButton.on('pointerover', () => {
            retryButton.setStyle({ backgroundColor: '#cc0000' });
        });
        retryButton.on('pointerout', () => {
            retryButton.setStyle({ backgroundColor: '#ff0000' });
        });
    }
}