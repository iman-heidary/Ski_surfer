
import { Preloader } from './scenes/Preloader.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig




const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#2d3436',
    physics: { default: 'arcade' ,arcade: {
            gravity: { y: 0 },
            debug: false,
        }
        },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        
        Preloader,
        Game,
        GameOver,





        

    ],

    // fps: {
        // target: 120, // Limit to 30 FPS (you can adjust this value)
        // forceSetTimeOut: false // This helps to reduce CPU usage and set a lower frame rate
    // }
};

new Phaser.Game(config);
