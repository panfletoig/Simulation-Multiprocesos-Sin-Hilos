let NCompetidores = document.getElementById("NCompetidores");
const canvas = document.getElementById('Simulacion');
let ctx = canvas.getContext('2d');
let CPU = document.getElementById("CPU");
let HILOS = document.getElementById("Hilos");
let pista = new Pista(0,0);
let competidores = [new Corredor(0, canvas.width, canvas.height, 2, .6)];
let cajaCompetidores = document.getElementById("CajaCompetidores");
let valorAnterior = 0;
let AnimacionId = 0;
let Ganador = false;
let TextoGanador = document.getElementsByClassName("TextoGanador")[0].getElementsByTagName("P")[0];

///Cuando cargue la pagina
window.onload = function (){
    pintarFondo(); //Pinte el fondo
    InstanciarCompetidores(); //Coloque a los competidores
    ResetearCompetencia(); //Resetea la competencia
}
///Se asegura que los valores esten en los rangos
CPU.addEventListener("input", function(){
    if(CPU.value > 3){
        CPU.value = 3;
    }
    else if(CPU.value < 1){
        CPU.value = 1;
    }
});
///Se asegura que los valores esten en los rangos
HILOS.addEventListener("input", function(){
    if(HILOS.value > 3){
        HILOS.value = 3;
    }
    else if(HILOS.value < 1){
        HILOS.value = 1;
    }
});
///Se asegura que los valores esten en los rangos
///Luego instancia un nuevo competidor o lo elimina si hace falta
NCompetidores.addEventListener("input", function(){
    if (NCompetidores.value < 3) {
        NCompetidores.value = 3;
    }else if(NCompetidores.value > 10){
        NCompetidores.value = 10;
    }; 
    InstanciarCompetidores(); //Genera espacio para darle velocidad y prioridad
    Reseteo(); //Resetea la competencia
});

function InstanciarCompetidores(){
    let div = cajaCompetidores.getElementsByTagName("div"); //Obtiene los div que contienen a los competidores
    let cantidadActual = div.length; //Obtiene la longitud actual
    let cantidadDeseada = parseInt(NCompetidores.value); //Obtiene la catidad que se busca tener 

    //Si faltan competidores los agrega 
    for (let i = cantidadActual; i < cantidadDeseada; i++) {
        let container = document.createElement("div"); //Crea un dic
        container.className = "ContainerComp"; //Le asigna la clase

        let p = document.createElement("p"); //Crea un elemento p
        p.textContent = `Competidor ${i + 1}`; //Crea un competidor

        let velocidad = document.createElement("input"); //Crea un elemento input
        velocidad.type = "number"; //De tipo number
        velocidad.className = "Increment" //Que se incremente
        velocidad.id = "Velocidad"; //Le da el id velocidad
        velocidad.value = 1; //Le mueve 1 de predeterminado
        velocidad.min = 1; //Le mueve 1 de valor minimo
        velocidad.max = 10; //Le mueve 20 de valor maximo
        velocidad.step = 1; //Si se usa que aumente de 1 en 1

        //Realiza lo mismo de arriva pero con prioridad
        let prioridad = document.createElement("input"); 
        prioridad.type = "number";
        prioridad.className = "Increment" 
        prioridad.id = "Prioridad";
        prioridad.value = 1;
        prioridad.min = 1;
        prioridad.max = 10;
        prioridad.step = 1;

        container.appendChild(p); //Adiciona a container el elemento p
        container.appendChild(velocidad); //Adiciona a container el elemento input
        container.appendChild(prioridad); //Adiciona a container el elemento input

        cajaCompetidores.appendChild(container); //Los agrega al contenedor general
    }

    // Eliminar competidores si sobran
    for (let i = cantidadActual - 1; i >= cantidadDeseada; i--) {
        cajaCompetidores.removeChild(div[i]); //Remueve los no deseados
    }
}

///Inicia una animacion si no hay una activa
function IniciarAnimacion(){
    if(AnimacionId == 0){
        ResetearCompetencia(); //Resetea desde 0
        AnimacionId = Animacion(); //Asocia la animacion a una variable
    }
}

function Animacion(){
    pintarFondo(); //Pinta el fondo

    let prioridad = new Array(competidores.length); //Crea arreglo de prioridad
    //Por cada competidor obtiene la prioridad e hilos
    for(let i = 0; i < competidores.length; i++){
        if(competidores[i].Hilo == false) {
            prioridad[i] = competidores[i].ObtenerPrioridad();
        }
    }
    
    prioridad.sort((a, b)=> b - a); //Ordena de manera descendente
    //Repite hasta que la cantidad de prioridades sea igual a la cantidad de hilos disponibles
    for(;prioridad.length > pista.HilosDisponibles;){
        prioridad.pop();
    }
    //Por cada competidor
    for(let i = 0; i < competidores.length; i++){
        //Por cada hilo disponilbe
        for(let j = 0; j < pista.HilosDisponibles; j++){
            //Compara si hay el competidor tiene hilos se sale del bucle
            if(competidores[i].Hilo == true){ break; }

            //Si la prioridad es igual a la del competidor entonces
            if(prioridad[j] == competidores[i].ObtenerPrioridad()){
                competidores[i].AsignarHilo(pista.TomarHilo()); //Se le asigna hilo
                prioridad.splice(j, 1); //Se elimina ese valor de la lista de prioridades
                break; //Sale del ciclo
            }
        }

        //Competidor avanza y si termino se guarda en la variable termino
        let Termino = competidores[i].Avanzar();
        //Si termino
        if (Termino){
            pista.LiberarHilo(); //Libera el hilo
            console.log(pista);
            if (!Ganador && competidores[i].LlegoMeta()){
                Ganador = true;
                TextoGanador.innerHTML = `COMPETIDOR ${i + 1} GANA!!!`
                console.log(`Llego competidor ${i + 1}`)
            }
        }
        //Dibuja al competidor
        dibujarPunto(competidores[i].Position.x, competidores[i].Position.y, competidores[i].Radio);
    }
    AnimacionId = requestAnimationFrame(Animacion) //Se llama a otro frame
}
function Reseteo(){
    cancelAnimationFrame(AnimacionId); //Se cancela la animacion
    ResetearCompetencia(); //Se resetea la competencia
}
function ResetearCompetencia(){
    pista = new Pista(CPU.value, HILOS.value); //Se reinicia la pista
    let div = cajaCompetidores.getElementsByTagName("div"); //Se obtiene la cantidad de competidores
    let cantidadActual = div.length; //Se obtiene la cantidad de competidores
    TextoGanador.innerHTML = `!!!!PREPARADOS, LISTOS, FUERA!!!!`
    competidores = new Array(cantidadActual) //Se crea el arreglo
    //Repite por cada competidor
    for(let i = 0; i < cantidadActual; i++){
        let velocidad = (div[i].querySelector("#Velocidad").value) / 1; //Obtiene la velocidad parseando la velocidad "1" / 1 = 1
        let prioridad = (div[i].querySelector("#Prioridad").value) / 1; //Obtiene la prioridad parseando la prioridad "2" / 1 = 2
        competidores[i] = new Corredor(i, canvas.width, canvas.height, prioridad, velocidad, cantidadActual) // Crea al competidor
    }
    pintarFondo(); //pinta el fondo
    //Pinta a los competidores
    for(let i = 0; i < competidores.length; i++){
        dibujarPunto(competidores[i].Position.x, competidores[i].Position.y, competidores[i].Radio);
    }
    //Coloca 0 a la animacion indicando que puede iniciar
    AnimacionId = 0;
}

///dibujarPunto -> Dibuja un circulo
///x: Posicion X
///y: Posicion Y
///radio: Radio del circulo
///Color: color del relleno
function dibujarPunto(x, y, radio, color = '#222') {
    ctx.fillStyle = color; //Le da el color
    ctx.beginPath(); //Inicia dibujo
    ctx.arc(x, y, radio, 0, Math.PI * 2); //Genera el circulo
    ctx.fill(); //Se pinta el circulo
}
///pintarFondo -> Dibuja rectangulos y circulos para el fondo
function pintarFondo(){
    ctx.fillStyle = '#d1ccc2'; //Seleccion del color claro
    ctx.fillRect(0, 0, canvas.width, canvas.height); //Se pinta el fondo completo
    ctx.fillStyle = '#606455'; //Seleccion de color opaco
    ctx.fillRect(canvas.width / 2 - 5, 0, 10, canvas.height); //Se pinta a la mitad un rectangulo
    dibujarPunto(canvas.width/2, (canvas.height + competidores[0].Radio) / 2, 30, '#828871ff'); //Dibuja un circulo a la mitad
    dibujarPunto(canvas.width/2, (canvas.height + competidores[0].Radio) / 2, 25, '#606455'); //Dibuja otro circulo a la mitad
}