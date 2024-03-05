"use strict"
let datos;

window.onload = recibir();

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function recibir(){
  
  fetch("https://opentdb.com/api.php?amount=10").then((response) => {
    return response.json();
   }).then(
    (data) => {
      cargardatos(data.results)
    }
   ).catch(
    (error) => {console.log(error)}

   )
}

let answers = [];
let actualquestion = 0;

function cargardatos(results){
  datos = results;
  console.log(datos); 
  let buttons = document.getElementsByClassName("ans")
  for(let button of buttons){
    button.addEventListener("click", (event) => handleclick(event));
  }
  loadActualQuestion();
}



function loadActualQuestion(){
  document.getElementsByClassName("question-number")[0].textContent = actualquestion+1;
  let buttons = document.getElementsByClassName("ans")
  document.getElementsByClassName("Question")[0].textContent = decodeHtml(datos[actualquestion].question);
  let allanswers = [...datos[actualquestion].incorrect_answers, datos[actualquestion].correct_answer]; //clonar un array en otro para que no sea una referencia puedes usar object.seal
  shuffle(allanswers);
  if(allanswers.length===2){
    buttons[2].style.display = "none"
    buttons[3].style.display = "none"
  } else{
    buttons[2].style.display = ""
    buttons[3].style.display = ""
  }
  let i = 0;
  for(let button of buttons){
    button.style.animation = ""
    button.style.backgroundColor = "";
    button.style.color = "";
    button.textContent = decodeHtml(allanswers[i]);
    i++;
  }
}


function handleclick(e){
  document.getElementsByClassName("quiz-card")[0].classList.remove("animate__wobble")
  answers = [...answers,{"correct":datos[actualquestion].correct_answer,"checked":e.target.textContent}]
  console.log(answers);

if(e.target.textContent!=decodeHtml(datos[actualquestion].correct_answer)){
    e.target.style.backgroundColor = "red"
    e.target.style.color = "#f2f2f2"
    e.target.textContent = "❌ " + e.target.textContent
    e.target.style.animation = "shake 300ms 2"
    checkCorrect();
  }else{
    e.target.style.backgroundColor = "green"
    e.target.style.color = "#f2f2f2"
    e.target.textContent = "✔️ " + e.target.textContent
  }
  actualquestion++;
  console.log(actualquestion)
  setTimeout(() => {
    document.getElementsByClassName("quiz-card")[0].classList.add("animate__wobble")
    loadActualQuestion();
  }, 3000);
}

function checkCorrect(){
  let buttons = document.getElementsByClassName("ans")
  for(let button of buttons){
    if(button.textContent === decodeHtml(datos[actualquestion].correct_answer)){
      button.style.backgroundColor = "green"
      button.style.color = "#f2f2f2"
      button.textContent = "✔️ " + button.textContent
    }
  }
}


function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

