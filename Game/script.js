$(document).ready(function() {
Physics(function(world){
  var viewWidth = 800;
  var viewHeight = 550;


var gameState = false;
var player;
var start = window.addEventListener('keyup', function(event){
	//start game
	if (event.keyCode === 32){
		if(gameState === false){
		game();
        var startSound = new Audio("Sounds/warble.mp3");
        startSound.play();
		gameState = true;
		}
		else{
			return;
		}
	}
});
  var renderer = Physics.renderer('canvas', {
    el: 'viewport',
    width: viewWidth,
    height: viewHeight,
    meta: false, // don't display meta data
    styles: {
        // set colors for the circle bodies
        'circle' : {
            strokeStyle: '#351024',
            lineWidth: 1,
            fillStyle: '#FFFFFF',
            angleIndicator: '#FFFFFF'
        }
        //set colors for the Player
    }
  });

window.addEventListener('keydown', function(event) {
    // if the user presses the left arrow key
        // advance the player left
      if (event.keyCode === 37) {
        world.emit('move', 'left');
        } 
   // if the user presses the right arrow key
        // advance the player right
      else if (event.keyCode === 39){
          world.emit('move', 'right');

        }   
    });

window.addEventListener('keyup', function(event) {
// stop movement!
  if (event.keyCode === 37 || event.keyCode === 39) {
    world.emit('stop');
    }   
}); 

world.on('move', function(data, e) {
  // wake up the player
    player.sleep(false);
    // Change the velocity when key pressed
    var vel = player.state.vel;
    if (data === 'left') {
      vel.set(-0.5, 0);
    } else if  (data === 'right'){
      vel.set(0.5, 0);
    }
  });

world.on('stop', function(data,e){
  //stops the player
  player.state.vel.set(0,0);
});

world.add( renderer );
// render on each step
world.on('step', function(){
  world.render();
});

//Connect lives to HTML
//lives set to three
var currentLives = 0;
totalLives = document.getElementById('lives');
totalLives.innerHTML = "Lives: "+ currentLives;

// bounds of the window
var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);


// constrain objects to these bounds
world.add(Physics.behavior('edge-collision-detection', {
    aabb: viewportBounds,
    restitution: 1,
    cof: 0
}));

// ensure objects bounce when edge collision is detected
world.add( Physics.behavior('body-impulse-response') );


// ensure objects collide off each other
world.add(Physics.behavior('body-collision-detection') );
world.add(Physics.behavior('sweep-prune') );

Physics.util.ticker.on(function( time, dt ){
  if (player) {
    world.step( time );
    if (player.state.pos.x + 50 >= viewWidth ){
      console.log("Right impact!");
      player.state.pos.x = viewWidth - 50;
      player.state.vel.set(0,0);
    }
    if (player.state.pos.x - 50 <= 0 ){
      console.log("Left impact!");
      player.state.pos.x = 50;
      player.state.vel.set(0,0);
    }
  }
});

// start the ticker
Physics.util.ticker.start();


//level starts at 1
level= 1;
var brick = [];
bricks = 0;

//Level Advance


  // add a circle  
var ball= Physics.body('circle', {
        x: viewWidth / 2, // x-coordinate
        y: 520, // y-coordinate
        vx: 0.2, // velocity in x-direction
        vy: 0.2, // velocity in y-direction
        radius: 15,
        cof: 0,
        restitution: 1,
        objType: 'ball'
      });

var collisionHandlers = function(data){
  for (var i=0; i<data.collisions.length; i++){
    // find the first collision that matches the query
    var impact = data.collisions[i];
            // check if the totem touched the ground
      if (impact.bodyA.objType=='ball' && impact.bodyB.objType=='brick' ||
        impact.bodyB.objType=='ball' && impact.bodyA.objType=='brick'){
                console.log("BodyA: " + impact.bodyA.objType + " BodyB: " + impact.bodyB.objType);
                if(impact.bodyA.objType =='ball'){
                world.removeBody(impact.bodyB);
                bricks -= 1;
                console.log(bricks - 1);
                var brickSound = new Audio("Sounds/clink.mp3");
                brickSound.play();
                } 
                else{
                  world.removeBody(impact.bodyA);
                  bricks -= 1;
                  console.log(bricks - 1);
                  var brickSound = new Audio("Sounds/clink.mp3");
                  brickSound.play();
                } 
            }
      }
      if(ball.state.pos.y >= 535){
        console.log("DEAD!");
        var deadSound= new Audio("Sounds/beep_2.mp3");
        deadSound.play();
        // ball.restitution= 1;
        // ball.cof= 0;
        ball.state.pos.set(player.state.pos.x, 500);
        ball.state.vel.set(0.3, 0.3);
        currentLives--;
        console.log(currentLives);
        totalLives.innerHTML = "Lives: " + currentLives;
        if (currentLives === 0){
          totalLives.innerHTML = "GAME OVER!"
          world.remove(brick);
          bricks= 0;  
          world.removeBody(ball);
          world.removeBody(player);
          world.off('collision:detected', collisionHandlers)
          gameState = false;
          // var gameBoard = document.getElementById('viewport')
          // gameBoard.style.visibility = "hidden";
          }
        }  
        if(brick === [] && gameState === true){
          level++;
        }
        if (bricks === 1){
          world.removeBody(ball);
          world.removeBody(player);
          world.off('collision:detected', collisionHandlers);
          var winSound = new Audio("Sound/win.mp3");
          winSound.play();
          gameState = false;
          currentLives = 3;
          level ++;
          totalLives.innerHTML = "CONGRATS! Press SPACEBAR for the next level.";

        }
};
world.on('collisions:detected', collisionHandlers); 


//Game Activated!
var game = function(){

  //lives set to three
  currentLives = 3;
  totalLives.innerHTML = "Lives: "+ currentLives;
  // if (currentLives === 0){
  //   gameState = false;
  // }
  // add the renderer



  world.add(ball);

  //adding Player
  player = Physics.body('rectangle', {
  	  	treatment: 'kinematic',
  	  	x: viewWidth / 2,
  	  	y: 530,
  	  	vx: 0,
  	  	vy: 0,
  	  	width: 100,
  	  	height: 10,
        cof: 0,
        restitution: 1,
        objType: 'player'
  	  });
  world.add(player);

 console.log(player); 	

//LEVEL 1 PROPERTIES

if (level ===1){
bricks = 61;
brick = [];

    for ( var i = 0, l = 20; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 20 + (i * 40)
            ,y: 100
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
			,objType: 'brick'
            ,styles: {
                fillStyle: '#F50A16'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 10; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 40 + (i * 80)
            ,y: 150
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
			,objType: 'brick'
            ,styles: {
                fillStyle: '#FFFF59'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
                ,border: 'white'
            }
        }));
    }

	for ( var i = 0, l = 20; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 20 + (i * 40)
            ,y: 200
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
			,objType: 'brick'
            ,styles: {
                fillStyle: '#19E0FF'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 10; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 40 + (i * 80)
            ,y: 250
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
			,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
                ,border: 'white'
            }
        }));
    }
};


//LEVEL 2 PROPERTIES
if (level ===2){
brick = [];
bricks = 94;
    for ( var i = 0, l = 1; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 390
            ,y: 50
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 3; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 350 + (i * 40)
            ,y: 70
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 5; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 300 + (i * 40)
            ,y: 90
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 5; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 300 + (i * 40)
            ,y: 110
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 4; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 300 + (i * 40)
            ,y: 130
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 2; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 260
            ,y: 110 + (i* 20)
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'orange'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 2; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 380 + (i * 40)
            ,y: 151
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 2; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 380 + (i * 40)
            ,y: 171
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }


   for ( var i = 0, l = 10; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 280 + (i * 40)
            ,y: 191
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    } 

    for ( var i = 0, l = 10; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 280 + (i * 40)
            ,y: 211
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 11; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 240 + (i * 40)
            ,y: 231
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 11; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 240 + (i * 40)
            ,y: 251
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 10; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 240 + (i * 40)
            ,y: 271
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 9; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 240 + (i * 40)
            ,y: 291
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 8; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 280 + (i * 40)
            ,y: 311
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: '#FC0AF4'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

};

//LEVEL 3 PROPERTIES
if (level ===3){
brick = [];
bricks = 168;
    for ( var i = 0, l = 3; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 380 + (i*40)
            ,y: 50
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'white'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 5; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 340 + (i*40)
            ,y: 71
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 7; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 300 + (i*40)
            ,y: 91
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 9; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 260 + (i*40)
            ,y: 111
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 11; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 220 + (i*40)
            ,y: 131
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
      } 
        for ( var i = 0, l = 13; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 180 + (i*40)
            ,y: 151
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 13; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 180 + (i*40)
            ,y: 171
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 15; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 140 + (i*40)
            ,y: 191
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 15; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 140 + (i*40)
            ,y: 211
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }
    for ( var i = 0, l = 15; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 140 + (i*40)
            ,y: 231
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 13; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 180 + (i*40)
            ,y: 251
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 13; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 180 + (i*40)
            ,y: 271
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }
    for ( var i = 0, l = 11; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 220 + (i*40)
            ,y: 291
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 9; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 260 + (i*40)
            ,y: 311
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 7; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 300 + (i*40)
            ,y: 331
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'lime'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 5; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 340 + (i*40)
            ,y: 351
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    for ( var i = 0, l = 3; i < l; ++i ){

        brick.push( Physics.body('rectangle', {
            width: 40
            ,height: 20
            ,treatment: 'static'
            ,x: 380 + (i*40)
            ,y: 371
            ,vx: 0
            ,vy: 0
            ,cof: 0
            ,restitution: 1
      ,objType: 'brick'
            ,styles: {
                fillStyle: 'white'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }

    }



    world.add(brick);


// monitor collisions


console.log("adding collision handlers")

  
  // // add some gravity
  // world.add( Physics.behavior('constant-acceleration') );

  // subscribe to ticker to advance the simulation
  



};
// game();
});

});