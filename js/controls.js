const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const shotSfx = document.querySelector('#shoot')

const speed = 5
const coefficient = 0.5
const count_down =0
/**
 * previous settings
 */

shotSfx.volume = 0.3

canvas.width = innerWidth
canvas.height = innerHeight


// class GameObj{
//   constructor(){
//     this.position={
//       x: canvas.width/2,
//       y: canvas.height*0.86
//     }

// }

class Enemy {
  constructor({position}){
    this.position={
      x: position.x,
      y: position.y
    }

    const image = new Image()
      image.src = './img/invader.png'
      image.onload=()=>{
        this.image = image

        this.width = image.width*coefficient
        this.height = image.height*coefficient
      }


    this.velosity ={
      x:0,
      y:0
    }
  }

  draw(){
    if(this.image){
      c.drawImage(this.image, this.position.x,
        this.position.y, 
        this.width, this.height);
    }

  }

  update({velosity}){
    if(this.image){
      this.position.x+=velosity.x
      this.position.y+=velosity.y
      this.draw()
    }
  }
}

class GroupInvader{
  constructor(){
    this.position ={
      x:0,
      y:0
    }

    this.velosity = {
      x:0,
      y:0
    }

    const rows = Math.floor(Math.random()*5+2)
    const columns = Math.floor(Math.random()*10+4)

    this.invaders =[]
    for(let y=0; y<rows;y++){
      for(let x=0;x<columns;x++){
        this.invaders.push(
          new Enemy({
            position:{
              x:x*50,
              y:y*30}
          })
        )
      }
    }
  }

  update(){
    
    this.position.x+=this.velosity.x
    this.position.y+=this.velosity.y

  }
}

/**
 * class Player - 
 */

class Player{
  constructor(){
    this.position={
      x: 0.97*canvas.width/2,
      y: canvas.height*0.86
    }

    this.rotation =0

    const image = new Image()
      image.src = './img/ship2.png'
      image.onload=()=>{
        this.image = image

        this.width = image.width*coefficient
        this.height = image.height*coefficient
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
  }

  update(){
    if(this.image){
      this.position.x+=this.velosity.x
      this.position.y+=this.velosity.y
      this.draw()
    }
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

const inv_group = [new GroupInvader()]


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

  inv_group.forEach(group=>{
    group.update()
    group.invaders.forEach((invader)=>{
      invader.update()
    })
  })


  shots.forEach((shot,index) => {
    if ((shot.position.y+shot.radius)<=0){
      setTimeout(()=>{
        shots.splice(index,1)
      }, 0)
    }else{
      shot.update()
    }
  })

  // if(player.position.x>=0 && (player.position.x+player.width) < canvas.width){

  // }

  if(keys.a.pressed && player.position.x >=0){
    player.velosity.x = -speed
  }else if (keys.d.pressed && (player.position.x+player.width) < canvas.width) {
    player.velosity.x = speed
  }else if(keys.s.pressed && (player.position.y+player.height+15)<canvas.height){
    player.velosity.y = speed
  }else if(keys.w.pressed && player.position.y>=0){
    player.velosity.y = -speed
  }
  else{
    player.velosity.x=0
    player.velosity.y=0
  }

  // if(count_down>0){ --count_down}
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
      if(count_down==0){
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
        count_down = 50
  
        keys.space.pressed=true
      }
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

