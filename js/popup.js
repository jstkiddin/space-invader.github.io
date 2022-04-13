// pop-up buttons
const openPopUp = document.querySelector('#open-popup')
const closePopUp = document.querySelector('.popup-close')
const click_btn = document.querySelector('#click_menu')


const popUp = document.querySelector('.popup')

openPopUp.addEventListener('click', (e)=>{
  e.preventDefault()
  popUp.classList.add('active')

})

closePopUp.addEventListener('click', ()=>{
  popUp.classList.remove('active')
  click_btn.play()
})