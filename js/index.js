"use strict"
let datos;
let clicked = false;

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
let audio = new Audio("/Quiz/music/Raul_Cabezali_-_Quiz_Show.mp3")
  audio.play();
  audio.volume = 0.3;
  audio.loop = true;
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

  if(clicked){
    return;
  }

  clicked = true;

  document.getElementsByClassName("quiz-card")[0].classList.remove("animate__wobble")
  answers = [...answers,{"correct":decodeHtml(datos[actualquestion].correct_answer),"checked":decodeHtml(e.target.textContent)}]
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
  if(actualquestion>=9){
    setTimeout(() => {
      finalQuiz();
    }, 1000);
  }
  actualquestion++;
  setTimeout(() => {
    clicked = false;
    document.getElementsByClassName("quiz-card")[0].classList.add("animate__wobble")
    loadActualQuestion();
  }, 1500);
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


function finalQuiz(){

  document.getElementsByClassName("quiz-container")[0].style.display = "none";
  let corrects = 0;
 
    let x = 0;

  for(let an of answers){
    let divcontainer = document.createElement("div");
    let h2 = document.createElement("h2");
    let divbuttons = document.createElement("div");
    let opt1 = document.createElement("div");
    let opt2 = document.createElement("div");
    divcontainer.classList.add("final");
    divbuttons.classList.add("buttons");
    opt1.classList.add("final1");
    opt2.classList.add("final2");
    opt1.style.backgroundColor = "#32cd32"
    opt2.style.backgroundColor = "#ED4337"
    opt1.style.color = "white"
    opt2.style.color = "white"
    divbuttons.appendChild(opt1);
    if(an.correct != an.checked){
      divbuttons.appendChild(opt2);
    }
    divcontainer.appendChild(h2);
    divcontainer.appendChild(divbuttons);
    h2.textContent = decodeHtml(datos[x].question);
    opt1.textContent = an.correct;
    opt2.textContent = an.checked;
    opt1.textContent += " ✔️";
    opt2.textContent += " ❌";
    document.getElementsByClassName("final-questions")[0].appendChild(divcontainer);
    x++
  }


  for(let ans of answers){
      if(ans.correct === ans.checked){
        corrects++;
        console.log(ans);
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

