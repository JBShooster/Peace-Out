var level1 = function(){

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
                fillStyle: 'blue'
                ,lineWidth: 1
                ,width: 40
                ,height: 40
            }
        }));
    }
};