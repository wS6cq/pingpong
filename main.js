/*******************************************************************************
 * Copyright (c) 2011, Phillip Kroll <c@phillipkroll.de>
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 ******************************************************************************/

var app = null;
 
function onLoad() {
    var segment = unescape(document.location.hash.substring(1));
    segment = segment == "" ? 1 : segment;
    segment = segment > 100 ? 100 : segment; 
    
    app = new Application(document.getElementById('canvas'),segment);
    setInterval(iteration,15);  
    
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;     
}

function iteration() {
    app.iterate();
}

function keyDown(e){
    app.keyDown(e);
}

function keyUp(e){
    app.keyUp(e);
}
 
 /***************************************************
 * Prototype Application
 ***************************************************/

function Application(canvas, balls) {
    this.bootstrap(canvas, balls);
}

Application.prototype.bootstrap = function (canvas, balls) {
    this.canvas = new CanvasManager();
    this.leftPaddle = new Rectangle();
    this.rightPaddle = new Rectangle();
    this.score = new Score();
    this.balls = new Array();
    this.computers = new Array(); 
    this.iter = 0;   
   
   
    this.canvas.registerObjects(new Array(this.leftPaddle, this.rightPaddle));
    this.populate(balls);

    this.computerLeft = new Computer(this.balls, this.leftPaddle, this.canvas);
    this.computerRight = new Computer(this.balls, this.rightPaddle, this.canvas);

    this.computers.push(this.computerLeft);
    this.computers.push(this.computerRight);


    this.canvas.setCanvas(canvas);
    this.leftPaddle.setX(20);
    this.leftPaddle.setY(20);
    this.leftPaddle.setHeight(70);
    this.leftPaddle.setWidth(10);
    
    this.rightPaddle.setX(this.canvas.getWidth()-40);
    this.rightPaddle.setY(20);
    this.rightPaddle.setHeight(70);
    this.rightPaddle.setWidth(10);  

    this.spawnBalls();
      
    
}

Application.prototype.populate = function (balls) {
    
    for (var i =0; i<balls; i++) {
      this.balls.push(new Circle());
    }  
    for (var j =0; j<this.balls.length; j++) {
         this.canvas.registerObject(this.balls[j]);
    }
};

Application.prototype.iterate = function () {
    //console.log(this);
    this.iter++;
    this.animate();
    if (this.iter % 2 === 0) {
        forEach(this.computers, function(item){item.act()});
    }
};

Application.prototype.animate = function() {
    
    for (var i =0; i<this.balls.length; i++) {
        this.canvas.moveByVector(this.balls[i]);
    
        if (this.balls[i].getY() > this.canvas.getHeight() - this.balls[i].getHeight() || this.balls[i].getY() < 0){
            this.balls[i].getVector().setY(this.balls[i].getVector().getY()*-1);
        }

        if (this.balls[i].getX() > this.canvas.getWidth()){
            this.score.incA();
            this.spawnBall(this.balls[i]);
        }   

        if (this.balls[i].getX() < -20){
            this.score.incB();
            this.spawnBall(this.balls[i]);     
        }   
    }  
    
    // score    
    this.canvas.clearRectangle(this.canvas.getWidth()/2-50,0,100, 20);    
    this.canvas.getContext().font = "16pt Calibri";
    this.canvas.getContext().fillStyle = "#efefef";
    this.canvas.getContext().textAlign = "center";
    this.canvas.getContext().fillText(this.score.getA() + " : " + this.score.getB(), this.canvas.getWidth()/2, 20);
    this.canvas.getContext().font = "8pt Calibri";
    this.canvas.clearRectangle(this.canvas.getWidth()-27,this.canvas.getHeight()-15,30, 30);
    this.canvas.getContext().fillText("v 0.2", this.canvas.getWidth()-15, this.canvas.getHeight()-5);

    
    this.canvas.detectCollision();

};

Application.prototype.spawnBalls = function() {
    this.canvas.clear();
    this.rightPaddle.draw(this.canvas.getContext());
    this.leftPaddle.draw(this.canvas.getContext());
    //forEach( this.balls, this.spawnBall);
    for (var i =0; i<this.balls.length; i++) {
      this.spawnBall(this.balls[i]);
    }    
};

Application.prototype.spawnBall = function(ball) {
    ball.setX(this.canvas.getWidth()/2);
    ball.setY(this.canvas.getHeight()/2);
    ball.setHeight(16);
    ball.setWidth(16);
    ball.setVector(Vector.getRandom(2,3));
};

Application.prototype.keyDown = function(event) {
  if (!event)
    event = window.event;
  if (event.which) {
    t = event.which;
  } else if (event.keyCode) {
    t = event.keyCode;
  }

  if ( t === 87 && this.leftPaddle.getY() > 0 ) {
      this.computerLeft.disable();
      this.canvas.moveObject(this.leftPaddle, 0, -30);
  }
   
  if ( t === 83 && this.leftPaddle.getY() + this.leftPaddle.getHeight() < this.canvas.getHeight()) {
      this.computerLeft.disable();
      this.canvas.moveObject(this.leftPaddle, 0, +30);
  }  

  if ( t === 38 && this.rightPaddle.getY() > 0 ) {
      this.computerRight.disable();
      this.canvas.moveObject(this.rightPaddle, 0, -30);
  }
  
  if ( t === 40 && this.rightPaddle.getY() + this.rightPaddle.getHeight() < this.canvas.getHeight()) {
      this.computerRight.disable();      
      this.canvas.moveObject(this.rightPaddle, 0, +30);
  }

};

Application.prototype.keyUp = function(event) {
    
};
