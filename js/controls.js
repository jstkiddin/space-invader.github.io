const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const shotSfx = document.querySelector('#shoot')

const speed = 5

/**
 * previous settings
 */

shotSfx.volume = 0.3

canvas.width = innerWidth
canvas.height = innerHeight


// class GameObj{
//   constructor(){
//     this.velosity = {
//       x:0,
//       y:0
//     }
//   }
// }

class Enemy {
  constructor(){
    this.position = {
      x:200,
      y:200
    }
    this.velosity = {
      x:0,
      y:0
    }
  }


}

class Player{
  constructor(){
    this.position={
      x: 0.97*canvas.width/2,
      y: canvas.height*0.86
    }

    const image = new Image()
      image.src = './img/ship2.png'
      image.onload=()=>{
        this.image = image

        this.width = image.width*0.5
        this.height = image.height*0.5
      }


    this.velosity ={
      x:0,
      y:0
    }

    this.life = 3

  }

  draw(){
    if(this.image){
      c.drawImage(this.image, this.position.x,
        this.position.y, 
        this.width, this.height);
    }

    // c.fillStyle = 'red'
    // c.fillRect(, this.width, this.height)
  }

  update(){
    this.position.x+=this.velosity.x
    this.draw()
  }
}


class Shot{
  constructor({position,velosity}){
    this.position = position
    this.velosity = velosity
    this.radius = 3
  }
  
  draw(){
    c.beginPath()
    c.arc(this.position.x, this.position.y,this.radius,0,Math.PI*2)
    
    c.fillStyle = "white"
    c.fill()
    
    c.closePath()
  }
  
  update(){
    this.position.x+=this.velosity.x
    this.position.y+=this.velosity.y
    this.draw()
  }
}

const player = new Player()
player.draw()

const shots = [
]

/**  
 * sets by default boolean 'pressed' as false
 * 
 * it helps player to not go out of game-field 
 * even if the key was pressed and never unpressed 
*/
const keys = {
  w:{
    pressed:false
  },
  a:{
    pressed:false
  },
  s:{
    pressed:false
  },
  d:{
    pressed:false
  },
  space:{
    pressed:false
  }
}


// 
function animate(){
  requestAnimationFrame(animate)
  
  c.clearRect(0,0,canvas.width, canvas.height)
  player.update()
  shots.forEach((shot,index) => {
    
    if ((shot.position.y+shot.radius)<=0){
      setTimeout(()=>{
        shots.splice(index,1)
      }, 0)
    }else{
      shot.update()
    }
  })

  if(keys.a.pressed && player.position.x >=0){
    player.velosity.x = -speed
  }else if (keys.d.pressed && (player.position.x+player.width) < canvas.width) {
    player.velosity.x = speed
  }else if(keys.s.pressed){
    player.velosity.y = speed
  // }else if(keys.s.pressed && (player.position.y+player.height)<canvas.height){
  //   player.velosity.y = speed
  }else if(keys.w.pressed){
    player.velosity.y = -speed
  // }else if(keys.w.pressed && player.position.y>=0){
  //   player.velosity.y = -speed
  }else if (keys.space.pressed) {
    
  }
  else{
    player.velosity.x=0
    player.velosity.y=0
  }
}
animate()

/** 
 * Event Listners part so your spaceship could move
*/
addEventListener('keydown', ({key}) =>{
  switch(key){
    case 'a':
      keys.a.pressed=true
      break;
    case 'w':
      keys.w.pressed=true
      break;
    case 's':
      keys.s.pressed=true
      break;
    case 'd':
      keys.d.pressed=true
      break;  
    case ' ':
      shots.push(new Shot({
        position:{
          x:player.position.x + player.width/2,
          y:player.position.y
        },
        velosity:{
          x:0,
          y:-7
        }
      }))

      shotSfx.play()

      keys.space.pressed=true
      break;  
  }
})

addEventListener('keyup', ({key}) =>{
  switch(key){
    case 'a':
      keys.a.pressed=false
      break;
    case 'w':
      keys.w.pressed=false
      break;
    case 's':
      keys.s.pressed=false
      break;
    case 'd':
      keys.d.pressed=false
      break;  
    case ' ':
      keys.space.pressed=false
      break;  
  }
})

