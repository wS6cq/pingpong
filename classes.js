/*******************************************************************************
 * Copyright (c) 2011, Phillip Kroll <contact@phillipkroll.de>
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
      
/***************************************************
 * Prototype Shape
 ***************************************************/
    
 function Shape(x, y) {
     this.x = x;
     this.y = y;
     this.width = 50;
     this.height = 50;
     this.velocity = new Vector(0, 0);
     this.location = new Vector(x, y);
 };
 
 Shape.prototype.getVelocity = function () {
     return this.velocity;
 };
 
 Shape.prototype.setVelocity = function (vector) {
     this.velocity = vector;
 };

Shape.prototype.getLocation = function () {
    return this.location;
};


Shape.prototype.setLocation = function (location) {
    this.location = location;
};


 Shape.prototype.setWidth = function (width) {
     this.width = width;
 };
 
 Shape.prototype.setHeight = function (height) {
     this.height = height;
 };
 
 Shape.prototype.getWidth = function () {
     return this.width;
 }; 
 
 Shape.prototype.getHeight = function () {
     return this.height;
 };
 
 Shape.prototype.move = function (x, y) {
     this.location.x += x;
     this.location.y += y;
 };

Shape.prototype.getMass = function () {
    return this.location.x * this.location.y;
};


/***************************************************
 * Prototype Rectangle
 ***************************************************/

Rectangle.prototype = new Shape();        
Rectangle.prototype.constructor = Rectangle;   

function Rectangle(x, y){ 
    Shape.prototype.constructor.call(this, x, y);
};

Rectangle.prototype.draw = function (context) {
    context.fillStyle = "rgb(250,250,250)";
    context.fillRect (this.getLocation().getX(), this.getLocation().getY(), this.getWidth(), this.getHeight());
};

Rectangle.prototype.clear = function (context) {
    context.clearRect(this.getLocation().getX(), this.getLocation().getY(), this.getWidth(),this.getHeight());
};

/***************************************************
 * Prototype Circle
 ***************************************************/

Circle.prototype = new Shape();        
Circle.prototype.constructor = Circle;   

function Circle(x, y){ 
    Shape.prototype.constructor.call(this, x, y);
};

Circle.prototype.draw = function (context) {
    context.fillStyle = "rgb(250,250,250)";
    context.beginPath();
    // context.arc(this.getLocation().getX()+this.getRadius(),this.getLocation().getY()+this.getRadius(),this.getRadius(),0,Math.PI*2,true);
    context.arc(this.getLocation().getX()+this.getWidth()/2,this.getLocation().getY()+this.getHeight()/2,this.getWidth()/2,0,Math.PI*2,true);
    context.closePath();    
    context.fill();
 
};

Circle.prototype.getRadius = function () {
    return this.getWidth()/2;
}
 
Circle.prototype.clear = function (context) {
    context.clearRect (this.getLocation().getX()-1, this.getLocation().getY()-1, this.getWidth()+2, this.getHeight()+2);
};

Shape.prototype.setCenter = function (center) {
    this.location = center.sub(this.getRadius());
};

Shape.prototype.getCenter = function () {
    return Vector.add(this.location, this.getRadius());
};


/***************************************************
 * Prototype CanvasManager
 ***************************************************/

function CanvasManager() {
    this.matrix = new Matrix(0,0);
    this.objects = new Array();

};

CanvasManager.prototype.getContext = function() {
    return this.canvas.getContext("2d");     
};

CanvasManager.prototype.setCanvas = function(canvas) {
    this.canvas = canvas;
    if (!canvas.getContext) {
        alter("not supported");
    }    
};

CanvasManager.prototype.moveObject = function (o, x, y) {     
  o.clear(this.getContext());
  o.move(x, y);
  o.draw(this.getContext());
};

CanvasManager.prototype.moveByVector = function (o) {     
  this.moveObject(o, o.getVelocity().getX(), o.getVelocity().getY());
};

CanvasManager.prototype.getWidth = function () {
    return this.canvas.getAttribute('width');
};

CanvasManager.prototype.getHeight = function () {
    return this.canvas.getAttribute('height');
};

CanvasManager.prototype.getBackgroundColor = function() {
    return this.canvas.getAttribute('backgroundColor');
};

CanvasManager.prototype.clear = function() {
    this.getContext().clearRect(0, 0, this.getWidth(), this.getHeight());
};

CanvasManager.prototype.registerObjects = function (objects) {
    if (objects.length != this.objects.length) {
        this.matrix = new Matrix(objects.length,objects.length);
    }
    this.objects = objects;
};

CanvasManager.prototype.registerObject = function (object) {
    this.objects.push(object);
    this.matrix = new Matrix(this.objects.length,this.objects.length);
};

CanvasManager.prototype.clearRectangle = function (x,y,h,w) {
    this.getContext().fillStyle = "rgb(250,250,250)";
    this.getContext().clearRect(x,y,h,w);
};

CanvasManager.prototype.detectCollision = function () {
    for (var i = 0; i < this.objects.length; i++) {
        for (var j = 0; j < this.objects.length; j++) {
            if (i !== j) {
            var o1 = this.objects[i];
            var o2 = this.objects[j];
       
            if (  (o1.getLocation().getX() + o1.getWidth() > o2.getLocation().getX()
                && o1.getLocation().getX() < o2.getLocation().getX() + o2.getWidth()
                && o1.getLocation().getY() + o1.getHeight() > o2.getLocation().getY()
                && o1.getLocation().getY() < o2.getLocation().getY() + o2.getHeight() )
                
            ){

              if (this.matrix.get(i, j) === 0 && this.matrix.get(j, i) === 0  ){
                 //this.resolveCollision(o1, o2);
                 //if ( !(o1 instanceof Circle) || !(o2 instanceof Circle) ) {

                   if (sig(o1.getVelocity().getX()) !== sig(o2.getVelocity().getX())) {
                       o1.getVelocity().setX(o1.getVelocity().getX()*-1);
                       o2.getVelocity().setX(o2.getVelocity().getX()*-1);
                   } else {
                       o1.getVelocity().setY(o1.getVelocity().getY()*-1);
                       o2.getVelocity().setY(o2.getVelocity().getY()*-1);
                   }
                  
                   this.matrix.set(i, j, 1);
                   this.matrix.set(j, i, 1);
                   o1.draw(this.getContext());
                   o2.draw(this.getContext());
                 }
      
            } else {
               this.matrix.set(i, j, 0);
               
            }
            
          
            }
        }
    }
};

CanvasManager.prototype.resolveCollision = function(o1, o2) {

    if ( o1 instanceof Circle && o2 instanceof Circle ){
        var l1 = o1.getCenter();
        var l2 = o2.getCenter();
        var delta = Vector.sub(l1, l2);
        var d = delta.getLength();
        var mtd =  Vector.multiply(delta, (( o1.getRadius() + o2.getRadius())-d)/d);
        var im1 = 1 / o1.getMass();
        var im2 = 1 / o2.getMass();
        o1.getCenter().add(Vector.multiply(mtd, im1/(im1+im2)));
        o2.getCenter().sub(Vector.multiply(mtd, im2 / (im1 + im2)));

        var v = Vector.sub(o1.getVelocity(), o2.getVelocity());
        var vn = Vector.dot(v, mtd.normalize());
        if ( vn <= 0 ) {
            var i = (-(1 + 1) * vn) / (im1 + im2);
            var impulse = Vector.multiply(mtd, i);
            o1.getVelocity().add(impulse.multiply(im1));
            o2.getVelocity().sub(impulse.multiply(im2));
        }
    }
    
};

/***************************************************
 * Prototype Vector
 ***************************************************/

 function Vector(x, y) {
     this.x = x;
     this.y = y;
 };
 
 Vector.prototype.setX = function (x) {
     this.x = x;
 };
 
 Vector.prototype.setY = function (y) {
     this.y = y;
 };
 
 Vector.prototype.getX = function () {
     return this.x;
 }; 
 
 Vector.prototype.getY = function () {
     return this.y;
 };

 Vector.prototype.getLength = function () {
     return Math.sqrt(this.x * this.x + this.y * this.y);
 };

Vector.prototype.add = function (v) {
    if (v instanceof Vector) {
        this.setX(this.getX()+v.getX());
        this.setY(this.getY()+v.getY());
    } else {
        this.setX(this.getX()+v);
        this.setY(this.getY()+v);
    }
    return this;
};

Vector.add = function (v1, v2) {
    var result = new Vector(v1.getX(),  v1.getY());
    return result.add(v2);
};

Vector.prototype.sub = function (v) {
    if (v instanceof Vector) {
        this.setX(this.getX()-v.getX());
        this.setY(this.getY()-v.getY());
    } else {
        this.setX(this.getX()-v);
        this.setY(this.getY()-v);
    }
    return this;
};

Vector.sub = function (v1, v2) {
    var result = new Vector(v1.getX(),  v1.getY());
    return result.sub(v2);
};

Vector.prototype.multiply = function (v) {
    if (v instanceof Vector) {
        this.setX(this.getX() * v.getX());
        this.setY(this.getY() * v.getY());
    } else {
        this.setX(this.getX()*v);
        this.setY(this.getY()*v);
    }
    return this;
};

Vector.multiply = function (v1, v2) {
    var result = new Vector(v1.getX(), v1.getY());
    return result.multiply(v2);
};

Vector.prototype.dot = function (v) {
    return this.getX()*v.getX() + this.getY()*v.getY();
};

Vector.dot = function (v1, v2) {
    var result = new Vector(v1.getX(), v1.getY());
    return result.dot(v2);
};

Vector.prototype.distance = function (v) {
    return this.sub(v).getLength();
};

Vector.prototype.normalize = function () {
    var length = this.getLength();
    this.setX(this.getX()/length);
    this.setY(this.getY()/length);
    return this;
}

 Vector.getRandom = function (min, max) {
     var instance = new Vector(Math.round(Math.random()*max*2)-max,Math.round(Math.random()*max*2)-max);
     instance.setX(instance.getX() <= 0 ? instance.getX() - min : instance.getX() + min);
     instance.setY(instance.getY() <= 0 ? instance.getY() - min : instance.getY() + min);
     return instance;
 };

Vector.prototype.toString = function () {
    return "x: " + this.getX() + ", y: " + this.getY();
}
 
 /***************************************************
 * Prototype Score
 ***************************************************/

 function Score() {
     this.reset();
 };
 
 Score.prototype.setA = function (a) {
     this.a = a;
 };
 
 Score.prototype.setB = function (b) {
     this.b = b;
 };
 
 Score.prototype.getA = function () {
     return this.a;
 }; 
 
 Score.prototype.getB = function () {
     return this.b;
 };
 
 Score.prototype.incA = function () {
     this.a++;
 };
 
 Score.prototype.incB = function () {
     this.b++;
 };
 
 Score.prototype.reset = function () {
     this.a = 0;
     this.b = 0;
 };
 
 
/***************************************************
* Prototype Matrix
***************************************************/

function Matrix (rows, cols) {
   this.rows = new Array(rows);
   this.forEachRow(function(row, i){return new Array(cols)}); 
   this.init(0);
};

Matrix.prototype.toString = function () {
   this.forEachRow(function (row, i) {
       console.log( i + ": " + row);
       return row;
   })
};

Matrix.prototype.init = function (value) {
   this.forEach(function(item, i, j){return value}); 
};

Matrix.prototype.forEachRow = function (action) {
   for (var i=0; i<this.rows.length; i++){
       this.rows[i] = action(this.rows[i], i);
   }
};

Matrix.prototype.forEach = function (action) {
   for (var i=0; i<this.rows.length; i++){
       for (var j=0; j<this.rows[0].length; j++){
          this.rows[i][j] = action(this.rows[i][j], i, j);         
       }
   }  
};

Matrix.prototype.set = function(row, col, value) {
    this.rows[row][col] = value;
};

Matrix.prototype.get = function(row, col) {
    return this.rows[row][col];
};

/***************************************************
* Prototype Computer
***************************************************/

function Computer (balls, handle, canvas) {
    this.handle = handle;
    this.acitve = true;
    this.balls = balls;
    this.canvas = canvas;
};

Computer.prototype.getRelevantObject = function() {
    var result = this.balls[0];
    for (var i=0; i<this.balls.length; i++) {
        var ball = this.balls[i];
        if ( Math.abs(ball.getLocation().getX() - this.handle.getLocation().getX()) <  Math.abs(result.getLocation().getX() - this.handle.getLocation().getX())
            && ( ( ball.getVelocity().getX() < 0 && ball.getLocation().getX() > this.handle.getLocation().getX() ) ||
                 ( ball.getVelocity().getX() > 0 && ball.getLocation().getX() < this.handle.getLocation().getX() )
            )){
            result = ball;
        }
    }
    return result;
};

Computer.prototype.act = function () {

    if (this.acitve === true) {

        var ball = this.getRelevantObject();
        
        if (ball.getLocation().getY()+ball.getHeight()/2 < this.handle.getLocation().getY()+this.handle.getHeight()/2){
            this.canvas.moveObject(this.handle, 0, -7);
        }
        if (ball.getLocation().getY()+ball.getHeight()/2 > this.handle.getLocation().getY()+this.handle.getHeight()/2){
            this.canvas.moveObject(this.handle, 0, 7);
        }    
    }
};

Computer.prototype.disable = function () {
    this.acitve = false;
};

Computer.prototype.enable = function () {
    this.acitve = true;
};

/***************************************************
* Misc
***************************************************/

function forEach(array, action) {
    for (var i=0; i<array.length; i++) {
       action(array[i]);
    }
};

function sig(number) {
    var result = 0;
    if (number > 0){ result = 1; }
    if (number < 0){ result = -1; }
    return result;
};

