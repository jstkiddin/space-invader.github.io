// pop-up buttons
const openPopUp = document.querySelector('#open-popup')
const closePopUp = document.querySelector('.popup-close')


const popUp = document.querySelector('.popup')

openPopUp.addEventListener('click', (e)=>{
  e.preventDefault()
  popUp.classList.add('active')

})

closePopUp.addEventListener('click', ()=>{
  popUp.classList.remove('active')

})