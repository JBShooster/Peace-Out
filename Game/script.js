$(document).ready(function() {
Physics(function(world){
  var viewWidth = 800;
  var viewHeight = 550;

var state = false;
var start = window.addEventListener('keyup', function(event){
	//start game
	if (event.keyCode === 32){
		if(state === false){
		game();
		state = true;
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

level= 1;

var game = function(){
var lives = 3;
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

  // add the renderer
  world.add( renderer );
  // render on each step
  world.on('step', function(){
    world.render();
  });

  // bounds of the window
  var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);

  // constrain objects to these bounds
  world.add(Physics.behavior('edge-collision-detection', {
      aabb: viewportBounds,
      restitution: 1,
      cof: 0
  }));

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

  world.add(ball);

  //adding Player
  var player= Physics.body('rectangle', {
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

  // var brick= Physics.body('rectangle', {
  // 		x: 400,
  // 		y: 300,
  // 		treatment: 'static',
  // 		width: 40,
  // 		height: 20,
  // 		vx: 0,
  // 		vy: 0,
  //       cof: 0,
  //       restitution: 1,
  //       styles: {
  // 		fillStyle : '#F50A16'},
  // 		objType: 'brick'
  // });
var brick = [];
var bricks = 60;
var levelBricks = 0;

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

    world.add(brick);

  // ensure objects bounce when edge collision is detected
  world.add( Physics.behavior('body-impulse-response') );


  // ensure objects collide off each other
  world.add(Physics.behavior('body-collision-detection') );
  world.add(Physics.behavior('sweep-prune') );




// monitor collisions
world.on('collisions:detected', function(data){
	for (var i=0; i<data.collisions.length; i++){
    // find the first collision that matches the query
    ballHit = data.collisions[i];
            // check if the totem touched the ground
			if (ballHit.bodyA.objType=='ball' && ballHit.bodyB.objType=='brick' ||
				ballHit.bodyB.objType=='ball' && ballHit.bodyA.objType=='brick'){
                console.log("BodyA: " + ballHit.bodyA.objType + " BodyB: " + ballHit.bodyB.objType);
                if(ballHit.bodyA.objType =='ball'){
                world.removeBody(ballHit.bodyB);
                bricks -= 1;
                console.log(bricks);
              	} 
              	else{
              		world.removeBody(ballHit.bodyA);
              		bricks -= 1;
              		console.log(bricks);
              	} 
            }
           }
        });

  
  // // add some gravity
  // world.add( Physics.behavior('constant-acceleration') );

  // subscribe to ticker to advance the simulation
  Physics.util.ticker.on(function( time, dt ){

      world.step( time );
  });

  // start the ticker
  Physics.util.ticker.start();

};
// game();
});

});