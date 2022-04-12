const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const life_html = document.querySelector('#life')
const points_html = document.querySelector('#points')
const shotSfx = document.querySelector('#shoot')
const enemyShotSfx = document.querySelector('#enemy-shoot')
const music_btn = document.querySelector('#btn-music')
const pause_btn = document.querySelector('#btn-pause')
const pause = document.querySelector('.pause')

let player_list
// '1', {player:{
// name:
// score:
// }}

const game_audio = document.querySelector('#game-audio')
  game_audio.volume=0.3
  game_audio.autoplay=true
  game_audio.loop=true


/**
 * previous settings
 */

const speed = 5
const coefficient = 0.5
let count_down = 0
let game = {
  over:false,
  active:true
}

enemyShotSfx.volume = 0.3
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

  update(x,y){
    if(this.image){
      this.position.x+=x
      this.position.y+=y
      this.draw()
    }
  }

  shoot(enemyShots){
    enemyShots.push(new EnemyShot({
      position:{
        x: this.position.x+this.width/2,
        y:this.position.y+this.height
      },
      velosity:{
        x:0,
        y:5
      }
    }
    ))

  }
}

class GroupInvader{
  constructor(){
    this.position ={
      x:0,
      y:0
    }

    this.velosity = {
      x:2,
      y:0
    }

    
    const rows = Math.floor(Math.random()*5+2)
    const columns = Math.floor(Math.random()*5+2)
    this.width = columns*47
    this.height=rows*30

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
    this.position.y+=this.velosity.y
    this.position.x+=this.velosity.x

    this.velosity.y=0

    if(this.position.x+this.width>=canvas.width || this.position.x <=0){
      this.velosity.x= -this.velosity.x
      this.velosity.y=25.5
    }
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

    this.opacity=1
    this.life = 3
    this.points = 0

  }

  draw(){
    c.save()
    
    c.globalAlpha = this.opacity

    if(this.image){
      c.drawImage(this.image, this.position.x,
        this.position.y, 
        this.width, this.height);
    }
    c.restore()
  }

  update(){
    if(this.image){
      this.position.x+=this.velosity.x
      this.position.y+=this.velosity.y
      this.draw()
    }
  }
}


class Particle{
  constructor({position,velosity,radius,color}){
    this.position = position
    this.velosity = velosity
    this.radius = radius
    this.color = color
    this.opacity =1
  }
  
  draw(){
    c.save()
    c.globalAlpha = this.opacity

    c.beginPath()
    c.arc(this.position.x, this.position.y,this.radius,0,Math.PI*2)
    
    c.fillStyle = this.color
    c.fill()
    
    c.closePath()
    c.restore()
  }
  
  update(){
    this.position.x+=this.velosity.x
    this.position.y+=this.velosity.y
    this.opacity-=0.01
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
    
    c.fillStyle = "red"
    c.fill()
    
    c.closePath()
  }
  
  update(){
    this.position.x+=this.velosity.x
    this.position.y+=this.velosity.y
    this.draw()
  }
}

class EnemyShot{
  constructor({position,velosity}){
    this.position = position
    this.velosity = velosity

    this.width = 3
    this.height = 10
  }
  
  draw(){
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.fillStyle = "red"
    c.fill()    
  }
  
  update(){
    this.position.x+=this.velosity.x
    this.position.y+=this.velosity.y
    this.draw()
  }

}


// enter
const player = new Player()
player.draw()

const shots = [] //array of player shots
const particles=[]

const inv_group = [] //array of enemy groups
const enemyShots = [] //array of enemy shots


let frames = 0 //frames count to spawn enemyShoots and enemy groups
let randomInterval = Math.floor((Math.random()*1000)+500) //random number of frames to spawn enemys

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


function funExplosion({object,color}){
  for(let indexP =0;indexP<10;indexP++){
    particles.push(new Particle({position:{
      x:object.position.x+object.width/2,
      y:object.position.y+object.height/2,},
      velosity:{
        x:(Math.random()-0.5)*2,
        y:(Math.random()-0.5)*2
      },
      radius:Math.random()*2,
      color: color || 'yellow'
  }))
  }
}

// 
function animate(){
  if(game.active){
    requestAnimationFrame(animate)
    
    c.clearRect(0,0,canvas.width, canvas.height)
    life.innerHTML = ''
    life.innerHTML = player.life

    points.innerHTML = ''
    points.innerHTML = player.points

    player.update()

    particles.forEach((particle, pIndex) =>{
      if(particle.opacity<=0.01){
        setTimeout(()=>{
          particles.splice(pIndex,1)
        },0)
      }else(
        particle.update()
      )
    })


    // console.log(`length of shots array: ${shots.length}`)

    // checking enemy shots going out of game space
    enemyShots.forEach((enemyShot, esIndex) =>{
      if(enemyShot.position.y+enemyShot.height >= canvas.height){
        setTimeout(()=>{
          enemyShots.splice(esIndex,1)
        },0)
      }else{
        enemyShot.update()
      }

      // enemy hits player
      if(enemyShot.position.y+enemyShot.height >= player.position.y &&
        enemyShot.position.x+enemyShot.width >= player.position.x &&
        enemyShot.position.x<=player.position.x+player.width){
          setTimeout(()=>{
                  // pop the enemy shot from array
                  enemyShots.splice(esIndex,1)

          },0)

          // EXPLOSIONS EVERYWHERE
          funExplosion({
            object:player,
            color:'#48a0dc'
          })

          player.life-=1

          if(player.life===0){
            player.opacity =0
            game.over=true
            
            setTimeout(()=>{
              game.active=false
              savingData()
            },200)
          }

          
        }
    })

    // cheking player shots going out of canvas space
    shots.forEach((shot,index) => {
      if ((shot.position.y+shot.radius)<=0){
        setTimeout(()=>{
          shots.splice(index,1)
        }, 0)
      }else{
        shot.update()
      }
    })
    count_down=0

    // 
    if(inv_group.length<=0){
      inv_group.push(new GroupInvader())
    }else{
      inv_group.forEach((group,gridIndex)=>{
        // spawn shots
        if(frames%200===0 && group.invaders.length>0){
          randomEI = Math.floor(Math.random()*group.invaders.length)
          group.invaders[randomEI].shoot(enemyShots)
          enemyShotSfx.play()
        }

        group.update()
        group.invaders.forEach((invader,i)=>{
          invader.update(group.velosity.x,group.velosity.y)

          shots.forEach((shot,j)=>{
          
            // some logic for player shot if it reaches an enemy
            if((shot.position.y-shot.radius<=invader.position.y+invader.height)&&
            (shot.position.x+shot.radius>=invader.position.x)&&
            (shot.position.x-shot.radius<=invader.position.x+invader.width)&&
            (shot.position.y+shot.radius>=invader.position.y)){

              setTimeout(()=>{
                const invaderFound = group.invaders.find(invader2=>invader2===invader)
                const shotFound = shots.find(shot2=>shot2===shot)
              
                // remove enemy and shot or "ENEMY GOT HITED BY SHOT"
                if(invaderFound && shotFound){
                  // debugger;

                  // EXPLOSIONS EVERYWHERE
                  funExplosion({
                    object:invader
                  })
                
                  // pop the invader and shot from their arrays
                  group.invaders.splice(i,1)
                  shots.splice(j,1)
                  player.points+=50
                
                  if(group.invaders.length >0){
                    const firstInvader = group.invaders[0]
                    const lastInvader = group.invaders[group.invaders.length-1]
                    // console.log(`first:${firstInvader} and last ${lastInvader}`)
                    group.width = lastInvader.position.x-firstInvader.position.x+lastInvader.width
                    group.position.x=firstInvader.position.x
                  }else {
                    inv_group.splice(gridIndex,1)
                  }
                }
              },0)
            
            }
          })
        })
      })
    }

  


    // move player on game space
    if(keys.a.pressed && player.position.x >=0){
      player.velosity.x = -speed
      player.rotation = -0.15
    }else if (keys.d.pressed && (player.position.x+player.width) < canvas.width) {
      player.velosity.x = speed
      player.rotation = 0.15
    }else if(keys.s.pressed && (player.position.y+player.height+15)<canvas.height){
      player.velosity.y = speed
    }else if(keys.w.pressed && player.position.y>=0){
      player.velosity.y = -speed
    }
    else{
      player.velosity.x=0
      player.velosity.y=0
      player.rotation = 0
    }

    frames++
  }
}

animate()

pause_btn.addEventListener('click',()=>{
  if(game.active){
    pause_btn.classList.add('clicked')
    pause.classList.add("active")
    game.active = false
  }else{
    pause_btn.classList.remove("clicked")
    pause.classList.remove("active")
    game.active=true
    animate()
  }

  console.log(game.active)
})

let game_audio_paused = false

music_btn.addEventListener('click',()=>{
  if(game_audio_paused){
    music_btn.classList.remove("clicked")
    game_audio.play()
    game_audio_paused = false
  }else{
    music_btn.classList.add('clicked')
    game_audio.pause()
    game_audio.currentTime=0
    game_audio_paused = true
  }
})

/** 
 * Event Listners part so your spaceship could move
*/
addEventListener('keydown', ({key}) =>{
  if(game.over) return
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
      count_down=1

      if(count_down===1){
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
      }
  
        shotSfx.play()
        // count_down = 50
  
        // keys.space.pressed=true
      // }
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
      shotSfx.pause()
      shotSfx.currentTime = 0
      keys.space.pressed=false
      break;  
  }
})

function savingData({player}){
  const enter_menu = document.querySelector('.enter')
  const enter_btn = document.querySelector('#enter-btn')
  enter_menu.classList.add('active')

  enter_btn.addEventListener('click',()=>{
    
  })
  
    if(player_list.length<5){
      player_list.setItem(player_list.length+1,player)
    }else{

    }
}

