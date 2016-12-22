import React , {Component} from 'react'

import {rotatePoint, randomNumBetween, asteroidVertices, randomNumBetweenExcluding} from './engineHelper'
const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32
}



class Food {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: randomNumBetween(-1.5, 1.5),
      y: randomNumBetween(-1.5, 1.5)
    }
    this.rotation = 0;
    this.rotationSpeed = randomNumBetween(-1, 0.1)
    this.radius = 150 //args.size;
    this.score = (80/this.radius)*5;
    this.create = args.create;
    this.addScore = args.addScore;
    this.vertices = asteroidVertices(8, args.size)
  }

  destroy(){
    this.delete = true;
    this.addScore(this.score);

    //Explode
    for (let i = 0; i < 2; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(10, 10),
        size: randomNumBetween(1, 3),
        position: {
          x: this.position.x + randomNumBetween(-this.radius/4, this.radius/4),
          y: this.position.y + randomNumBetween(-this.radius/4, this.radius/4)
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
        }
      });
      this.create(particle, 'particles');
    }

    // // Break into smaller asteroids
    // if(this.radius > 10){
    //   console.log('123 Break into smaller')
    //   for (let i = 0; i < 2; i++) {
    //     let food = new Food({
    //       size: this.radius/2,
    //       position: {
    //         x: randomNumBetween(-10, 20)+this.position.x,
    //         y: randomNumBetween(-10, 20)+this.position.y
    //       },
    //       create: this.create.bind(this),
    //       addScore: this.addScore.bind(this)
    //     });
    //     this.create(food, 'food');
    //   }
    // }
  }

  render(state){
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if(this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
    else if(this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
    if(this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
    else if(this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#942F59';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -this.radius);
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    context.closePath();
    context.stroke();
    context.restore();
  }
}

class Particle {
  constructor(args) {
    this.position = args.position
    this.velocity = args.velocity
    this.radius = args.size;
    this.lifeSpan = args.lifeSpan;
    this.inertia = 0.98;
  }

  destroy(){
    this.delete = true;
  }

  render(state){
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Shrink
    this.radius -= 0.1;
    if(this.radius < 0.1) {
      this.radius = 0.1;
    }
    if(this.lifeSpan-- < 0){
      this.destroy()
    }

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.fillStyle = '#D6F915';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -this.radius);
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }
}

class Bullet {
  constructor(args) {
    let posDelta = rotatePoint({x:0, y:-20}, {x:0,y:0}, args.ship.rotation * Math.PI / 180)
    this.position = {
      x: args.ship.position.x + posDelta.x,
      y: args.ship.position.y + posDelta.y
    }
    this.rotation = args.ship.rotation
    this.velocity = {
      x:posDelta.x / 2,
      y:posDelta.y / 2
    }
    this.radius = 50
  }

  destroy(){
    this.delete = true
  }

  render(state){
    // Move
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // Delete if it goes out of bounds
    if ( this.position.x < 0
      || this.position.y < 0
      || this.position.x > state.screen.width
      || this.position.y > state.screen.height ) {
        this.destroy()
    }

    // Draw
    const context = state.context
    context.save()
    context.translate(this.position.x, this.position.y)
    context.rotate(this.rotation * Math.PI / 180)
    context.fillStyle = '#D6F915'
    context.lineWidth = 5,5
    context.beginPath()

    context.arc(0, 0, 2, 0, 2 * Math.PI)
    context.closePath()
    context.fill()
    context.restore()
  }
}


class Ship {
  constructor(args) {
    console.log('12312312 SHIP!!!!!!!!!')
    this.position = args.position
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0
    this.rotationSpeed = 6
    this.speed = 0.15
    this.inertia = 0.99
    this.radius = 100
    this.lastShot = 0
    this.create = args.create
    this.onDie = args.onDie
    this.onEat = args.onEat
  }

  destroy(){
    this.onEat()
    // this.delete = true;
    // this.onDie();

    // //Explode
    // for (let i = 0; i < 60; i++) {
    //   const particle = new Particle({
    //     lifeSpan: randomNumBetween(60, 100),
    //     size: randomNumBetween(1, 4),
    //     position: {
    //       x: this.position.x + randomNumBetween(-this.radius/4, this.radius/4),
    //       y: this.position.y + randomNumBetween(-this.radius/4, this.radius/4)
    //     },
    //     velocity: {
    //       x: randomNumBetween(-1.5, 1.5),
    //       y: randomNumBetween(-1.5, 1.5)
    //     }
    //   });
    //   this.create(particle, 'particles');
    // }
  }

  rotate(dir){
    if (dir == 'LEFT') {
      this.rotation -= this.rotationSpeed;
    }
    if (dir == 'RIGHT') {
      this.rotation += this.rotationSpeed;
    }
  }

  accelerate(val){
    this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.speed;
    this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.speed;

    // Thruster particles
    let posDelta = rotatePoint({x:0, y:-10}, {x:0,y:0}, (this.rotation-180) * Math.PI / 180);
    const particle = new Particle({
      lifeSpan: randomNumBetween(20, 40),
      size: randomNumBetween(1, 3),
      position: {
        x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
        y: this.position.y + posDelta.y + randomNumBetween(-2, 2)
      },
      velocity: {
        x: posDelta.x / randomNumBetween(3, 5),
        y: posDelta.y / randomNumBetween(3, 5)
      }
    });
    this.create(particle, 'particles');
  }

  render(state){
    // Controls
    this.grou = Date.now();
    console.log('render ship')
    if(state.keys.up){
      this.accelerate(1);
    }
    if(state.keys.left){
      this.rotate('LEFT');
    }
    if(state.keys.right){
      this.rotate('RIGHT');
    }
    if(state.keys.space && Date.now() - this.lastShot > 300){
      const bullet = new Bullet({ship: this});
      this.create(bullet, 'bullets');
      this.lastShot = Date.now();
    }

    Date.now() - this.grou > 1500 && console.log('ahaha')
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Rotation
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if(this.position.x > state.screen.width) this.position.x = 0;
    else if(this.position.x < 0) this.position.x = state.screen.width;
    if(this.position.y > state.screen.height) this.position.y = 0;
    else if(this.position.y < 0) this.position.y = state.screen.height;

    // Ship view
    const context = state.context
    context.save()
    context.translate(this.position.x, this.position.y)
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#ffffff';
    context.fillStyle = '#000000';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -50+state.point)
    context.lineTo(10, 50)
    context.lineTo(5, 50)
    context.lineTo(-5, 50)
    context.lineTo(-10, 50)
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}

export class MoveExample extends Component {
  constructor() {
    super();
    this.state = {
      point:0,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys : {
        left  : 0,
        right : 0,
        up    : 0,
        down  : 0,
        space : 0,
      },
      foodCount: 3,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      shipLevel: 1
    }
    this.ship = [];
    this.food = [];
    this.bullets = [];
    this.particles = [];
  }

  handleResize(value, e){
    this.setState({
      screen : {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  handleKeys(value, e){
    let keys = this.state.keys;
    if(e.keyCode === KEY.LEFT   || e.keyCode === KEY.A) keys.left  = value;
    if(e.keyCode === KEY.RIGHT  || e.keyCode === KEY.D) keys.right = value;
    if(e.keyCode === KEY.UP     || e.keyCode === KEY.W) keys.up    = value;
    if(e.keyCode === KEY.SPACE) keys.space = value;
    this.setState({
      keys : keys
    });
  }

  componentDidMount() {
    window.addEventListener('keyup',   this.handleKeys.bind(this, false))
    window.addEventListener('keydown', this.handleKeys.bind(this, true))
    window.addEventListener('resize',  this.handleResize.bind(this, false))

    const context = this.refs.canvas.getContext('2d')
    this.setState({ context: context })
    this.startGame()
    requestAnimationFrame(() => {this.update()})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleKeys)
    window.removeEventListener('resize', this.handleKeys)
    window.removeEventListener('resize', this.handleResize)
  }

  update() {
    console.log(this.food.length)
    const context = this.state.context
    const keys = this.state.keys
    const ship = this.ship[0]

    context.save()
    context.scale(this.state.screen.ratio, this.state.screen.ratio)

    // Motion trail
    context.fillStyle = '#AEB5DB'
    context.globalAlpha = 0.4
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height)
    context.globalAlpha = 1

    // // Next set of asteroids
    if(!this.food.length){
      let count = this.state.foodCount + 1
      this.setState({ foodCount: count })
      this.generateFood(count)
    }

    //Check for colisions
    this.checkCollisionsWith(this.bullets, this.food)
    this.checkCollisionsWith(this.ship, this.food)

    // Remove or render
    this.updateObjects(this.particles, 'particles')
    this.updateObjects(this.food, 'food')
    this.updateObjects(this.bullets, 'bullets')
    this.updateObjects(this.ship, 'ship')

    context.restore()

    // Next frame
    requestAnimationFrame(() => {this.update()})
  }

  addScore(points){
    if(this.state.inGame){
      this.setState({
        currentScore: this.state.currentScore + points,
      })
    }
  }

  startGame(){
    this.setState({
      inGame: true,
      currentScore: 0,
    })

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height/2
      },
      create: this.createObject.bind(this),
      onDie: this.onDie,
      onEat : this.onEat
    })
    this.createObject(ship, 'ship')

    // Make food
    this.food = []
    this.generateFood(this.state.foodCount)
  }

  onEat = () => {
    this.setState({
      point:this.state.point + 10
    })
  }

  gameOver(){
    this.setState({
      inGame: false,
    })

    // Replace top score
    if(this.state.currentScore > this.state.topScore){
      this.setState({
        topScore: this.state.currentScore,
      })
      localStorage['topscore'] = this.state.currentScore
    }
  }

  generateFood(howMany){
    console.log(howMany)
    let food = []
    let ship = this.ship[0]
    for (let i = 0; i < howMany; i++) {
      let food = new Food({
        size: 20,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this)
      })
      this.createObject(food, 'food')
    }
  }

  createObject(item, group){
    this[group].push(item)
  }

  updateObjects(items, group){
    let index = 0
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1)
      }else{
        items[index].render(this.state)
      }
      index++
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1
    var b
    for(a ;a > -1; --a){
      b = items2.length - 1
      for(b ;b > -1; --b){
        var item1 = items1[a]
        var item2 = items2[b]
        if(this.checkCollision(item1, item2)){
          item1.destroy()
          item2.destroy()
        }
      }
    }
  }

  checkCollision(obj1, obj2){
    var vx = obj1.position.x - obj2.position.x
    var vy = obj1.position.y - obj2.position.y
    var length = Math.sqrt(vx * vx + vy * vy)
    if(length < obj1.radius + obj2.radius){
      return true;
    }
    return false;
  }

  render() {
    let endgame;
    let message;

    if (this.state.currentScore <= 0) {
      message = '0 points... So sad.';  
    } else if (this.state.currentScore >= this.state.topScore){
      message = 'Top score with ' + this.state.currentScore + ' points. Woo!';
    } else {
      message = this.state.currentScore + ' Points though :)'
    }

    if(!this.state.inGame){
      endgame = (
        <div className="endgame">
          <p>Game over, man!</p>
          <p>{message}</p>
          <button
            onClick={ this.startGame.bind(this) }>
            try again?
          </button>
        </div>
      )
    }

    return (
      <div>
        { endgame }
        <span className="score current-score" >Score: {this.state.currentScore}</span>
        <span className="score top-score" >Top Score: {this.state.topScore}</span>
        <span className="controls" >
          Use [A][S][W][D] or [←][↑][↓][→] to MOVE<br/>
          Use [SPACE] to SHOOT
        </span>
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}
