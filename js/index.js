
let datos;
let clicked = false;
let files = [];
let corrects = 0;

window.onload = recibir();

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function recibir() {
  fetch("https://opentdb.com/api.php?amount=10")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      cargardatos(data.results);
    })
    .catch((error) => {
      console.log(error);
    });
}

let answers = [];
let actualquestion = 0;
let playmusic = false;
window.onclick = (e) => {
  if (!playmusic) {
    let audio = new Audio("/Quiz/music/Raul_Cabezali_-_Quiz_Show.mp3");
    audio.play();
    audio.volume = 0.3;
    audio.loop = true;
    playmusic = true;
  }
};
function cargardatos(results) {
  datos = results;
  let buttons = document.getElementsByClassName("ans");
  for (let button of buttons) {
    button.addEventListener("click", (event) => handleclick(event));
  }
  loadActualQuestion();
}

function loadActualQuestion() {
  document.getElementsByClassName("question-number")[0].textContent =
    actualquestion + 1;
  let buttons = document.getElementsByClassName("ans");
  document.getElementsByClassName("Question")[0].textContent = decodeHtml(
    datos[actualquestion].question
  );
  let allanswers = [
    ...datos[actualquestion].incorrect_answers,
    datos[actualquestion].correct_answer,
  ]; //clonar un array en otro para que no sea una referencia puedes usar object.seal
  shuffle(allanswers);
  if (allanswers.length === 2) {
    buttons[2].style.display = "none";
    buttons[3].style.display = "none";
  } else {
    buttons[2].style.display = "";
    buttons[3].style.display = "";
  }
  let i = 0;
  for (let button of buttons) {
    button.style.animation = "";
    button.style.backgroundColor = "";
    button.style.color = "";
    button.textContent = decodeHtml(allanswers[i]);
    i++;
  }
}

function handleclick(e) {
  if (clicked) {
    return;
  }

  clicked = true;

  document
    .getElementsByClassName("quiz-card")[0]
    .classList.remove("animate__wobble");
  answers = [
    ...answers,
    {
      correct: decodeHtml(datos[actualquestion].correct_answer),
      checked: decodeHtml(e.target.textContent),
    },
  ];

  if (
    e.target.textContent != decodeHtml(datos[actualquestion].correct_answer)
  ) {
    e.target.style.backgroundColor = "red";
    e.target.style.color = "#f2f2f2";
    e.target.textContent = "❌ " + e.target.textContent;
    e.target.style.animation = "shake 300ms 2";
    checkCorrect();
  } else {
    e.target.style.backgroundColor = "green";
    e.target.style.color = "#f2f2f2";
    e.target.textContent = "✔️ " + e.target.textContent;
  }
  if (actualquestion >= 2) {
    setTimeout(() => {
      finalQuiz();
    }, 1000);
  }
  actualquestion++;
  setTimeout(() => {
    clicked = false;
    document
      .getElementsByClassName("quiz-card")[0]
      .classList.add("animate__wobble");
    loadActualQuestion();
  }, 1500);
}

function checkCorrect() {
  let buttons = document.getElementsByClassName("ans");
  for (let button of buttons) {
    if (
      button.textContent === decodeHtml(datos[actualquestion].correct_answer)
    ) {
      button.style.backgroundColor = "green";
      button.style.color = "#f2f2f2";
      button.textContent = "✔️ " + button.textContent;
    }
  }
}

function finalQuiz() {
  document.getElementsByClassName("quiz-container")[0].style.display = "none";

  for (let ans of answers) {
    if (ans.correct === ans.checked) {
      corrects++;
    }
  }

  document.getElementsByClassName("final-card-button")[0].addEventListener("click", () => {finalQuizsecond()});
      
      // Obtenemos el canvas
      var canvas = document.getElementById('miCanvas');
      var context = canvas.getContext('2d');
  
      // Creamos una imagen de fondo
      var imagenFondo = new Image();
      imagenFondo.src = '/img/fondocomic.jpg';
      imagenFondo.onload = function() {
        // Dibujamos la imagen de fondo en el canvas
        context.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);
  
        // Creamos un texto
        var texto = `Your score is ${corrects}/10!`;
        context.font = '40px Arial'; // Establecemos la fuente y el tamaño del texto
        context.fillStyle = 'white'; // Establecemos el color del texto
  
        // Calculamos las coordenadas para centrar el texto horizontalmente y verticalmente
        var textoX = (canvas.width - context.measureText(texto).width) / 2;
        var textoY = (canvas.height - 30) / 2 + 30; // Se suma 30 (tamaño del texto) para centrarlo verticalmente
  
        // Dibujamos el texto en el canvas
        context.fillText(texto, textoX, textoY);
        let image = canvas.toDataURL();
        files.push(dataURLtoFile(canvas.toDataURL(), "quizi"))
        document.getElementsByClassName("final-card-image")[0].src = image;
        document.getElementsByClassName("final-card-count")[0].style.display = "flex"
      };
      
      // Establecemos la ruta de la imagen de fondo
       // Reemplaza 'ruta/de/la/imagen.jpg' con la ruta de tu imagen de fondo
  
      

}


function finalQuizsecond(){

  document.getElementsByClassName("final-card-count")[0].style.display = "none";
  let x = 0;
  for (let an of answers) {
    let divcontainer = document.createElement("div");
    let h2 = document.createElement("h2");
    let divbuttons = document.createElement("div");
    let opt1 = document.createElement("div");
    let opt2 = document.createElement("div");
    divcontainer.classList.add("final");
    divbuttons.classList.add("buttons");
    opt1.classList.add("final1");
    opt2.classList.add("final2");
    opt1.style.backgroundColor = "#32cd32";
    opt2.style.backgroundColor = "#ED4337";
    opt1.style.color = "white";
    opt2.style.color = "white";
    divbuttons.appendChild(opt1);
    if (an.correct != an.checked) {
      divbuttons.appendChild(opt2);
    }
    divcontainer.appendChild(h2);
    divcontainer.appendChild(divbuttons);
    h2.textContent = x + 1 + ". " + decodeHtml(datos[x].question);
    opt1.textContent = an.correct;
    opt2.textContent = an.checked;
    opt1.textContent += " ✔️";
    opt2.textContent += " ❌";
    document
      .getElementsByClassName("final-questions")[0]
      .appendChild(divcontainer);
    x++;
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

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}
