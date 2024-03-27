// audio example

// create a scene
var scene1 = {
  key: 'scene1',
  active: true,
  preload: scene1Preload,
  create: scene1Create,
  update: scene1Update
};
// establish config settings
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade"
  },
  scene: [scene1]
};

let game = new Phaser.Game(config);

//
// scene 1 (only scene in this example)
//
let scene1image;
let sound1;

// scene 1 preload
function scene1Preload() {
  this.load.image('title','title.png');
  console.log('scene1');
  // load audio file
  this.load.audio('music','overture.mp3');
}
// scene 1 create
function scene1Create() {
  scene1image = this.add.image( 400, 300, 'title' );
  sound1 = this.sound.add('music');
  sound1.play(
  	{
  		volume: 0.5,
  		loop: true
  	}
  );
}
// scene 1 update
function scene1Update() {
}