  let mainMenu = {
    key: 'mainMenu',
    active: true,
    preload: mainMenuPreload,
    create: mainMenuCreate,
    update: mainMenuUpdate
  };

  let gameScene = {
    key: 'gameScene',
    active: false,
    preload: gameScenePreload,
    create: gameSceneCreate,
    update: gameSceneUpdate
  };

  let gameOver = {
    key: 'gameOver',
    active: false,
    preload: gameOverPreload,
    create: gameOverCreate,
    update: gameOverUpdate
  };

const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 750 },
      debug: false
    }
  },
  scene: [mainMenu, gameScene, gameOver]
};

// create game instance
const game = new Phaser.Game(config);

//
// scene 1 functions follow
//

// global vars for scene1 or all scenes
let mainMenuImage;
let mainMenuMusic;

function mainMenuPreload() {
  // preload our image and audio file
  this.load.image('title', 'title.png');
  // load audio asset files use this.load.audio()
  this.load.audio('mainMenuMusic', 'sound/TypeCastTheme_Loopable.wav');
}

function mainMenuCreate() {
  // make a image game object to show our bkgnd image
  mainMenuImage = this.add.image(430, 300, 'title');
  // make a sound audio object (not shown but heard when played)
  mainMenuMusic = this.sound.add('mainMenuMusic');
  // to play an audio object, we have to call the play() method
  mainMenuMusic.play(
    {
      volume: 0.5, // set to 50% of volume level
      loop: true // make audio play repeat over and over
    }
  );
  // add detection for user-generate pointer click event
  // args: 1) string for event to detect, 2) name of function to trigger, 3) this for ref to current scene
  this.input.on('pointerup', mainMenuTransition, this);
}

function mainMenuUpdate() { }

function mainMenuTransition() {
  // to move from the current active scene to a diff one, use either this.scene.start() or
  // this.scene.transition()
  // this.scene.start('scene2');
  this.scene.transition(
    {
      target: 'gameScene',
      duration: 1500,
      moveBelow: true,
      allowInput: false,
      onUpdate: function (progress) {
        scene1image.alpha = 1 - progress; // progress is set by Phaser each update starts @ 0
      }
    }
  );
}

//
// scene 2
//

let gameSceneImage;
let effect2;

function gameScenePreload() {
  this.load.image('game', 'game.png');
  this.load.audio('gameMusic', 'sound/HaroldParanormalInstigatorTheme_Loopable.wav');
}

function gameSceneCreate() {
  scene2image = this.add.image(400, 300, 'game');
  effect2 = this.sound.add('gameMusic');
  this.input.on('pointerup', gameSceneTransition, this);
}

function gameSceneUpdate() {

}

function gameSceneTransition() {
  effect2.play(
    {
      volume: 0.8,
      loop: false
    }
  );
  this.scene.start('gameOver');
}

//
// scene 3
//

let gameOverImage;

function gameOverPreload() {
  this.load.image('gameOver', 'death.png');
  this.load.audio('gameOverMusic', 'sound/menu.wav')
}

function gameOverCreate() {
  scene3image = this.add.image(400, 300, 'gameOver');
  gameOverMusic.pause();
  this.input.on('pointerup', gameOverTransition, this);
}

function gameOverUpdate() {

}

function gameOverTransition() {
  this.scene.start('mainMenu');
}