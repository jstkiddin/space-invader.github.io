const main_music = document.querySelector('#main-music')

main_music.volume=0.3
main_music.autoplay=true
main_music.loop=true

const menu_btn = document.querySelector(".menu")
const start_btn = document.querySelector("#start")
const contr_btn = document.querySelector("#contr")

const hover_audio = document.querySelector("#hover_menu")
const click_audio = document.querySelector("#click_menu")


start_btn.addEventListener('mouseover', () => {
  hover_audio.volume = 0.5
  hover_audio.play()  
 })
contr_btn.addEventListener('mouseover', () => {
  hover_audio.volume = 0.5
  hover_audio.play()  
 })


 menu_btn.addEventListener('mouseout', () =>{
   hover_audio.pause()
    hover_audio.currentTime = 0;
 })

 menu_btn.addEventListener('click', () =>{
   click_audio.volume = .5
   click_audio.play()
 })