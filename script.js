"use strict";

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

const config = {
  type: Phaser.WEBGL,
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 750 },
      debug: false
    }
  },
  scene: [mainMenu, gameScene]
}

let mainMenuImage;
let mainMenuMusic;

function mainMenuPreload() {
  this.load.image('title', 'title.png');
  this.load.audio('mainMenuMusic', 'sound/HaroldParanormalInstigatorTheme_Loopable.wav');
}

function mainMenuCreate() {
  mainMenuImage = this.add.image(430, 300, 'title');
  mainMenuMusic = this.sound.add('mainMenuMusic');
  mainMenuMusic.play(
    {
      volume: 0.5, // set to 50% of volume level
      loop: true // make audio play repeat over and over
    }
  );

  cursors = this.input.keyboard.createCursorKeys();

}

function mainMenuUpdate() {
  if (cursors.space.isDown) {
    mainMenuMusic.stop();

    game.scene.stop('mainMenu');
    game.scene.start('gameScene');
  }
}

let player;
let smallPlatform;
let bigPlatform;
let cursors;
let enemy;
let newEnemy;
let enemySpeed = 70;
let enemyTimer;
let spike;
let lives = 9;
let gameOver = false;
let hearts = [];
let index;
let bgmusic;
let menumusic;
let jumpsound;
let gameOverText;
let score = 0;
let scoreText;
    
const game = new Phaser.Game(config);

function gameScenePreload() {
  this.load.image('platform', 'sprites/platform.png');
  this.load.image('upperplatform', 'sprites/upperplatform.png');
  this.load.image('spikes', 'sprites/spikes.png')
  this.load.spritesheet('hero', 'sprites/monochrome_tilemap_packed.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('baddie', 'sprites/monochrome_tilemap_enemy.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('hearts', 'sprites/monochrome_tilemap_packed.png', { frameWidth: 16, frameHeight: 16 });
  this.load.audio('bgmusic', 'sound/TypeCastTheme_Loopable.wav')
  this.load.audio('menumusic', 'sound/HaroldParanormalInstigatorTheme_Loopable.wav')
  this.load.audio('jump', 'sound/jump.mp3')
}

function gameSceneCreate() {
  this.add.image(400, 440, 'platform');

  this.physics.world.setBounds(0, 0, 800, 800);

  player = this.physics.add.sprite(255, 390, 'hero');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, 800, 800);

  enemy = this.physics.add.sprite(500, 390, 'baddie');
  enemy.setBounce(0.2);
  enemy.setCollideWorldBounds(true);
  enemy.body.gravity.y = 1000;
  enemy.body.gravity.x = 0;

  enemyTimer = this.time.addEvent({
    delay: 8000,
    callback: addEnemy,
    callbackScope: this,
    loop: true
  });

  bigPlatform = this.physics.add.staticGroup();
  bigPlatform.create(400, 440, 'platform');
  smallPlatform = this.physics.add.staticGroup();
  smallPlatform.create(300, 350, 'upperplatform');
  smallPlatform.create(500, 350, 'upperplatform');
  smallPlatform.create(400, 300, 'upperplatform');

  spike = this.physics.add.staticGroup();
  spike.create(400, 868, 'spikes');

  scoreText = this.add.text(650, 30, 'score: 0', { fontSize: '200', fill: '#4CBB17', fontFamily: 'Archivo Black' });
  scoreText.setScrollFactor(0);

  this.time.addEvent({ delay: 4000, callback: addScore, callbackScope: this, loop: true })

  function addScore() {
    if (!gameOver) {
      score += 5;
      scoreText.setText('score: ' + score);
    }
  }

  for (let i = 0; i < lives; i++) {
    let heart = this.add.sprite(30 + i * 25, 20, 'hearts', 40);
    hearts.push(heart);
  }

  hearts.forEach((heart, index) => {
    heart.setScrollFactor(0);
    heart.setDepth(1);
    heart.setTint(0x4cbb17);
    heart.setScale(1);
  })

  bgmusic = this.sound.add('bgmusic', { loop: true });
  bgmusic.play();

  this.physics.add.collider(player, bigPlatform);
  this.physics.add.collider(player, smallPlatform);
  this.physics.add.collider(enemy, bigPlatform);
  this.physics.add.collider(enemy, smallPlatform);
  this.physics.add.collider(enemy, newEnemy);
  this.physics.add.overlap(player, enemy, enemyTouch, null, this);
  this.physics.add.overlap(player, spike, spikeTouch, null, this);

  cursors = this.input.keyboard.createCursorKeys();

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('hero', { start: 240, end: 241 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('hero', { start: 260, end: 265 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('hero', { start: 242, end: 246 }),
    frameRate: 15,
    repeat: -1
  });

  this.anims.create({
    key: 'crouch',
    frames: this.anims.generateFrameNumbers('hero', { start: 246, end: 247 }),
    frameRate: 15,
    repeat: -1
  })

  this.anims.create({
    key: 'death',
    frames: this.anims.generateFrameNumbers('hero', { start: 366, end: 366 }),
    frameRate: 15,
    repeat: -1
  })

  this.anims.create({
    key: 'enemy',
    frames: this.anims.generateFrameNumbers('baddie', { start: 340, end: 345 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'newenemy',
    frames: this.anims.generateFrameNumbers('baddie', { start: 340, end: 345 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'heart',
    frames: this.anims.generateFrameNumbers('hearts', { start: 40, end: 42 }),
    frameRate: 2,
    repeat: -1
  });

  gameOverText = this.add.text(400, 400, 'YOU DIED!', { fontSize: '150px', fill: '#ff2400' });
  gameOverText.setOrigin(0.5);
  gameOverText.setVisible(false);
}

function createNewEnemy(x, y, texture) {
  x = Phaser.Math.Between(100, 700);
  y = Phaser.Math.Between(100, 500);

  while (y > 390 && y < 440) {
    y = Phaser.Math.Between(100, 500);
  }


  let newEnemy = this.physics.add.sprite(x, y, texture);
  newEnemy.setBounce(0.2);
  newEnemy.setCollideWorldBounds(true);
  newEnemy.body.gravity.y = 1000;
  newEnemy.body.gravity.x = 0;
  newEnemy.anims.play('enemy', true);

  return newEnemy;
}

function addEnemy() {
  newEnemy = createNewEnemy.call(this, 'baddie');
  this.physics.add.collider(newEnemy, bigPlatform);
  this.physics.add.collider(newEnemy, smallPlatform);
  this.physics.add.overlap(player, newEnemy, enemyTouch, null, this);
  enemySpeed += 5;
}

function gameSceneUpdate() {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-150);
    player.anims.play('run', true);
    player.flipX = true;
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(150);
    player.anims.play('run', true);
    player.flipX = false;
  }
  else {
    player.setVelocityX(0);
    player.anims.play('idle');
  }
  if (cursors.up.isDown || cursors.space.isDown) {
    player.anims.play('jump');

  }
  if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
    player.setVelocityY(-300);
    player.anims.play('jump', true);
    jumpsound = this.sound.add('jump', { loop: false, delay: 5000 });
    jumpsound.play();

  } else if (cursors.down.isDown) {
    player.anims.play('crouch', true);
  }

  hearts.forEach((heart, index) => {
    heart.anims.play('heart', true);
  })

  enemy.anims.play('enemy', true);
  enemy.setTint(0xCC0000);
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const angle = Math.atan2(dy, dx);
  const speed = 70;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  enemy.setVelocity(vx, vy);

  if (newEnemy) {
    newEnemy.anims.play('newenemy', true);
    newEnemy.setTint(0xCC0000);
    const newDx = player.x - newEnemy.x;
    const newDy = player.y - newEnemy.y;
    const newAngle = Math.atan2(newDy, newDx);
    const newSpeed = 90;
    const newVx = Math.cos(newAngle) * newSpeed;
    const newVy = Math.sin(newAngle) * newSpeed;
    newEnemy.setVelocity(newVx, newVy);
  }

}

for (let i = 0; i < hearts.length; i++) {
  if (i < lives) {
    hearts[i].setVisible(true);
  } else {
    hearts[i].setVisible(false);
  }
}

function enemyTouch(player, enemy) {
  lives--;
  for (let i = 0; i < hearts.length; i++) {
    if (i < lives) {
      hearts[i].setVisible(true);
    } else {
      hearts[i].setVisible(false);
    }
  }

  if (lives === 0) {
    player.setTint(0xED7014);
    player.anims.play('death', true);
    this.physics.pause();
    gameOver = true;
    gameOverText.setVisible(true);
    bgmusic.stop();
    menumusic = this.sound.add('menumusic', { loop: false });
    menumusic.play();
    enemyTimer.remove();
  }
}

function spikeTouch(player, spike) {
  lives--;
  for (let i = 0; i < hearts.length; i++) {
    if (i < lives) {
      hearts[i].setVisible(true);
    } else {
      hearts[i].setVisible(false);
    }
  }
  if (lives === 0) {
    player.setTint(0xED7014);
    player.anims.play('death', true);
    this.physics.pause();
    gameOverText.setVisible(true);
    gameOver = true;
    bgmusic.stop();
    menumusic = this.sound.add('menumusic', { loop: false });
    menumusic.play();
    enemyTimer.remove();
  }
}

