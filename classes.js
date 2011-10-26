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
     this.vector = new Vector(0, 0);
 };
 
 Shape.prototype.getVector = function () {
     return this.vector;
 };
 
 Shape.prototype.setVector = function (vector) {
     this.vector = vector;
 };
 
 Shape.prototype.setX = function (x) {
     this.x = x;
 };
 
 Shape.prototype.setY = function (y) {
     this.y = y;
 };
 
 Shape.prototype.getX = function () {
     return this.x;
 }; 
 
 Shape.prototype.getY = function () {
     return this.y;
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
     this.x += x;
     this.y += y;
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
    context.fillRect (this.getX(), this.getY(), this.getWidth(), this.getHeight());
};

Rectangle.prototype.clear = function (context) {
    context.clearRect(this.getX(), this.getY(), this.getWidth(),this.getHeight());
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
    context.arc(this.getX()+this.getWidth()/2,this.getY()+this.getHeight()/2,this.getWidth()/2,0,Math.PI*2,true);
    context.closePath();    
    context.fill();
 
};
 
Circle.prototype.clear = function (context) {
    context.clearRect (this.getX(), this.getY(), this.getWidth(), this.getHeight());
};
 
/***************************************************
 * Prototype CanvasManager
 ***************************************************/

function CanvasManager() {
    this.matrix = new Matrix(0,0);
    this.objects = new Array();

};

/**
 * @return CanvasRenderingContext2D
 */
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
  this.moveObject(o, o.getVector().getX(), o.getVector().getY());
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
       
            if (  (o1.getX() + o1.getWidth() > o2.getX() 
                && o1.getX() < o2.getX() + o2.getWidth() 
                && o1.getY() + o1.getHeight() > o2.getY()
                && o1.getY() < o2.getY() + o2.getHeight() )
                
            ){
               if (this.matrix.get(i, j) === 0 && this.matrix.get(j, i) === 0  ){
                   o1.getVector().setX(o1.getVector().getX()*-1);
                   o2.getVector().setX(o2.getVector().getX()*-1);
                   //o1.getVector().setY(o1.getVector().getY()*-1);
                   //o2.getVector().setY(o2.getVector().getY()*-1);                   
                   this.matrix.set(i, j, 1);
                   this.matrix.set(j, i, 1);
               }
               o1.draw(this.getContext());
               o2.draw(this.getContext());
               
            } else {
               this.matrix.set(i, j, 0);
               
            }
            
          
            }
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
 
 Vector.getRandom = function (min, max) {
     //max -= min;
     var instance = new Vector(Math.round(Math.random()*max*2)-max,Math.round(Math.random()*max*2)-max);
     instance.setX(instance.getX() <= 0 ? instance.getX() - min : instance.getX() + min);
     instance.setY(instance.getY() <= 0 ? instance.getY() - min : instance.getY() + min);
     return instance;
 };
 
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
    this.acitve = false;
    this.balls = balls;
    this.canvas = canvas;
};

Computer.prototype.getRelevantObject = function() {
    var result = this.balls[0];
    for (var i=0; i<this.balls.length; i++) {
        var item = this.balls[i];
        if ( Math.abs(item.getX() - this.handle.getX()) <  Math.abs(result.getX() - this.handle.getX())){
            result = item;
        }
    }  
    return result;
};

Computer.prototype.act = function () {
    if (this.acitve === false) {
        var ball = this.getRelevantObject();
        if (ball.getY()+ball.getHeight()/2 < this.handle.getY()+this.handle.getHeight()/2){
            this.canvas.moveObject(this.handle, 0, -7);
        }
        if (ball.getY()+ball.getHeight()/2 > this.handle.getY()+this.handle.getHeight()/2){
            this.canvas.moveObject(this.handle, 0, 7);
        }    
    }
};

Computer.prototype.disable = function () {
    this.acitve = true;
};

Computer.prototype.enable = function () {
    this.acitve = false;
};

/***************************************************
* Misc
***************************************************/

function forEach(array, action) {
    for (var i=0; i<array.length; i++) {
       action(array[i]);
    }
};


