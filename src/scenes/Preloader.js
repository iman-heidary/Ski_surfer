/*
* The game asset are taken from: https://taftcreates.itch.io/2048-assets
*
*/

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    
    

    preload() {
        //  Load the assets for the game
        this.load.setPath('assets');

        this.load.image('start_scene','start_scene.png') 
        this.load.image('Texture', 'Texture.png');

        this.load.image('trail_1','trail_1.png')
        this.load.image('trail_2','trail_2.png')

        this.load.spritesheet('play_btn', 
            'play.png',
            { frameWidth: 363, frameHeight: 227 }
        )
        this.load.spritesheet('gameover_btn', 
            'gameover.png',
            { frameWidth: 580, frameHeight: 227 }
        )
        this.load.image('gameover_text', 'gameover_text.png');

        this.load.spritesheet('snow', 
            'snow.png',
            { frameWidth: 1920, frameHeight: 1080 }
        )
        
        this.load.image('cloud_1', 'Cloud_1.png');
        this.load.image('cloud_2', 'Cloud_2.png');

        this.load.image('pack_b_horizon_1', 'pack_b_horizon_1.png');
        this.load.image('pack_b_horizon_2', 'pack_b_horizon_2.png');
        this.load.image('pack_b_horizon_3', 'pack_b_horizon_3.png');

        this.load.image('pack_b_vertical_1', 'pack_b_vertical_1.png');
        this.load.image('pack_b_vertical_2', 'pack_b_vertical_2.png');
        this.load.image('pack_b_vertical_3', 'pack_b_vertical_3.png');
        this.load.image('pack_b_vertical_4', 'pack_b_vertical_4.png');
        
        this.load.image('pack_l_1','pack_l_1.png')
        this.load.image('pack_l_2','pack_l_2.png')
        this.load.image('pack_l_3','pack_l_3.png')
        this.load.image('pack_l_4','pack_l_4.png')
        this.load.image('pack_l_5','pack_l_5.png')
        this.load.image('pack_l_6','pack_l_6.png')
        this.load.image('pack_l_7','pack_l_7.png')
        this.load.image('pack_l_8','pack_l_8.png')
        this.load.image('pack_l_9','pack_l_9.png')
        this.load.image('pack_l_10','pack_l_10.png')
        this.load.image('pack_l_11','pack_l_11.png')

        

        this.load.image('rock_1','rock_1.png')
        this.load.image('rock_2','rock_2.png')
        this.load.image('rock_3','rock_3.png')
        this.load.image('rock_4','rock_4.png') 
        this.load.image('rock','rock.png') 
        this.load.spritesheet('Player', 
            'Player.png',
            { frameWidth: 83, frameHeight: 118 }
        )



        

        


    }

    create_animations(){
        this.anims.create({
            key: 'play_btn_state_click',
            frames: this.anims.generateFrameNumbers('play_btn', { start: 0, end: 1 }),
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

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        let main_image = this.add.image(0, 0, 'start_scene').setDepth(0).setOrigin(0,0);
        let play_btn = this.add.sprite(1920/5+50, 950, 'play_btn',0).setScale(0.8).setInteractive().setDepth(2);
        let snow = this.add.sprite(0, 0, 'snow',0).setDepth(1).setOrigin(0,0)

        this.create_animations()
        snow.play('snowing');
        

        play_btn.on('pointerdown',() => {
            play_btn.play('play_btn_state_click');
            this.time.delayedCall(300, () => { // Adjust delay as needed
                this.scene.start('Game'); // Replace 'GameScene' with your actual scene name
            });
        })
        
        
        
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        
    }
}
