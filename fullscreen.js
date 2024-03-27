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

// define scene 3 (game over screen) configuration in its own variable
let gameOver = {
  key: 'gameOver',
  active: false,
  preload: gameOverPreload,
  create: gameOverCreate,
  update: gameOverUpdate
};

// define game config settings
let config = {
  type: Phaser.AUTO,
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [mainMenu, gameScene, gameOver] // square brackets let us create a list/array of scenes for our game (1 only for now)
};

// create game instance
let game = new Phaser.Game(config);

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
  this.load.audio('music', 'overture.mp3');
}

function mainMenuCreate() {
  // make a image game object to show our bkgnd image
  mainMenuImage = this.add.image(400, 300, 'title');
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
      duration: 2000,
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
  this.load.audio('zap', 'blaster.mp3');
}

function gameSceneCreate() {
  scene2image = this.add.image(400, 300, 'game');
  effect2 = this.sound.add('zap');
  this.input.on('pointerup', scene2Transition, this);
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
  this.load.image('gameOver', 'end.png');
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