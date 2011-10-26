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
    setInterval(iteration,20);
    
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
    this.version = "0.4";
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
    this.leftPaddle.setLocation(new Vector(20, 20));
    this.leftPaddle.setHeight(70);
    this.leftPaddle.setWidth(10);

    this.rightPaddle.setLocation(new Vector(this.canvas.getWidth()-40, 20));
    this.rightPaddle.setHeight(70);
    this.rightPaddle.setWidth(10);  

    this.spawnBalls();

      
    
};

Application.prototype.populate = function (balls) {
    
    for (var i =0; i<balls; i++) {
      this.balls.push(new Circle());
    }  
    for (var j =0; j<this.balls.length; j++) {
         this.canvas.registerObject(this.balls[j]);
    }
};

Application.prototype.iterate = function () {
    this.iter++;
    this.animate();
    if (this.iter) {
        forEach(this.computers, function(item){item.act()});
    }


};

Application.prototype.animate = function() {
    
    for (var i =0; i<this.balls.length; i++) {
        this.canvas.moveByVector(this.balls[i]);
    
        if (this.balls[i].getLocation().getY() > this.canvas.getHeight() - this.balls[i].getHeight() || this.balls[i].getLocation().getY() < 0){
            this.balls[i].getVelocity().setY(this.balls[i].getVelocity().getY()*-1);
        }

        if (this.balls[i].getLocation().getX() > this.canvas.getWidth()){
            this.score.incA();
            this.spawnBall(this.balls[i]);
        }   

        if (this.balls[i].getLocation().getX() < -20){
            this.score.incB();
            this.spawnBall(this.balls[i]);     
        }       
    }  

   if (this.computerLeft.acitve === false) {
       var speed = this.leftPaddle.getVelocity().getY();
       var step = 3;
       if (this.leftPaddle.getLocation().getY() + this.leftPaddle.getHeight() >= this.canvas.getHeight()&& speed > 0) { speed = 0; }
       if (this.leftPaddle.getLocation().getY() <= 0 && speed < 0) { speed = 0; }
       this.leftPaddle.getVelocity().setY(Math.abs(speed) > step ? speed > 0 ? speed-step : speed+step : 0);
       this.canvas.moveByVector(this.leftPaddle);
   }

    if (this.computerRight.acitve === false) {
        var speed = this.rightPaddle.getVelocity().getY();
        var step = 3;
        if (this.rightPaddle.getLocation().getY() + this.rightPaddle.getHeight() >= this.canvas.getHeight()&& speed > 0) { speed = 0; }
        if (this.rightPaddle.getLocation().getY() <= 0 && speed < 0) { speed = 0; }
        this.rightPaddle.getVelocity().setY(Math.abs(speed) > step ? speed > 0 ? speed-step : speed+step : 0);
        this.canvas.moveByVector(this.rightPaddle);
    }


    // score    
    this.canvas.clearRectangle(this.canvas.getWidth()/2-50,0,100, 20);    
    this.canvas.getContext().font = "16pt Calibri";
    this.canvas.getContext().fillStyle = "#efefef";
    this.canvas.getContext().textAlign = "center";
    this.canvas.getContext().fillText(this.score.getA() + " : " + this.score.getB(), this.canvas.getWidth()/2, 20);
    this.canvas.getContext().font = "8pt Calibri";
    this.canvas.clearRectangle(this.canvas.getWidth()-27,this.canvas.getHeight()-15,30, 30);
    this.canvas.getContext().fillText("v " + this.version, this.canvas.getWidth()-15, this.canvas.getHeight()-5);

    
    this.canvas.detectCollision();

};

Application.prototype.spawnBalls = function() {
    this.canvas.clear();
    this.rightPaddle.draw(this.canvas.getContext());
    this.leftPaddle.draw(this.canvas.getContext());
    for (var i =0; i<this.balls.length; i++) {
      this.spawnBall(this.balls[i]);
    }    
};

Application.prototype.spawnBall = function(ball) {
    ball.getLocation().setX(this.canvas.getWidth()/2);
    ball.getLocation().setY(Math.random()*(this.canvas.getHeight()-ball.getHeight()));
    ball.setHeight(16);
    ball.setWidth(16);
    ball.setVelocity(Vector.getRandom(2,4));
};

Application.prototype.keyDown = function(event) {
  if (!event)
    event = window.event;
  if (event.which) {
    t = event.which;
  } else if (event.keyCode) {
    t = event.keyCode;
  }

  // right up
  if (t === 87) {
      this.computerLeft.disable();
      var speed = this.leftPaddle.getVelocity().getY();
      this.leftPaddle.getVelocity().setY(speed > -20 ? speed - 20 : speed);
  }

  // left down
  if (t === 83) {
      this.computerLeft.disable();
      var speed = this.leftPaddle.getVelocity().getY();
      this.leftPaddle.getVelocity().setY(speed < 20 ? speed + 20 : speed);
  }  

  // right down
  if (t === 40) {
      this.computerRight.disable();
      var speed = this.rightPaddle.getVelocity().getY();
      this.rightPaddle.getVelocity().setY(speed < 20 ? speed + 20 : speed);
  }

   // right up
  if (t === 38) {
      this.computerRight.disable();      
      var speed = this.rightPaddle.getVelocity().getY();
      this.rightPaddle.getVelocity().setY(speed > -20 ? speed - 20 : speed);
  }

};

Application.prototype.keyUp = function(event) {
    
};
