let scene1 = {
  key: 'scene1',
  active: true,
  preload: scene1Preload,
  create: scene1Create,
  update: scene1Update
};

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade"
  },
  scene: [scene1]
};

// create game instance
let game = new Phaser.Game(config);

//
// scene 1 functions follow
//

// global vars for scene1 or all scenes
let scene1image;
let sound1;

function scene1Preload() {
  // preload our image and audio file
  this.load.image('title', 'title.png');
  // load audio asset files use this.load.audio()
  this.load.audio('music', 'sound/HaroldParanormalInstigatorTheme_Loopable.wav');
}

function scene1Create() {
  // make a image game object to show our bkgnd image
  scene1image = this.add.image(430, 300, 'title');
  // make a sound audio object (not shown but heard when played)
  sound1 = this.sound.add('music');
  // to play an audio object, we have to call the play() method
  sound1.play(
    {
      volume: 0.5, // set to 50% of volume level
      loop: true // make audio play repeat over and over
    }
  );
}

function scene1Update() {

}