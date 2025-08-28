class Corredor{
    ///indice, Usa tamaño del canvas, prioridad, velocidad, longitud, radio
    constructor (posY, canvasWidth, canvasHeight, prioridad, velocidad, longitud, radio = 6){
        this.canvasWidth = canvasWidth; 
        this.canvasHeight = canvasHeight
        this.Radio = radio;
        //Y hace un calculo donde 
        //se divide en canvas entre el doble de competidores y 
        //cada posicion se calcula con el doble de el indice + 1
        //por ultimo se le suma radio para conciderar que no salga de la pantalla
        this.Position = {x: radio, y: ((posY * 2 + 1) * (canvasHeight - radio) / (longitud * 2)) + radio}
        this.Velocidad = velocidad;
        this.Prioridad = prioridad;
        this.TiempoEjecutado = 0; //Tiempo que ha estado ejecutando varia
        this.Inicio = Date.now(); //Tiempo de cuando inicia el proceso
        this.TiempoAsignado = 0; //Tiempo que se puede mover
        this.TiempoTotal = 1; //Tiempo que lleva ejecutando
        this.DistanciaAvanzada = 1; //Distancia que lleva recorrida
        this.Llego = false; //si ya llego al final
        this.Hilo = false; //Si posee un hilo
    }
    //Si el hilo es 1 toma el hilo y le asinga tiempo usando como seed la fecha actual
    AsignarHilo(hiloAsignado){
        if(hiloAsignado == 1){
            this.Hilo = true;
            this.TiempoAsignado = (Math.random(Date.now()) * 2) + 1
        }
    }
    //Avanzar
    Avanzar(){
        //Si ya llego o si no posee hilo retorna
        if (this.Llego || !this.Hilo) { return false; }

        //añade 1 a la posicion x y lo multiplica por la velocidad
        this.Position.x += 1 * this.Velocidad;
        //Si supera la posicion del canvas
        if(this.Position.x >= this.canvasWidth - this.Radio){
            //Significa que la posicion se resetea al tope
            this.Position.x = this.canvasWidth - this.Radio
            //Se le mueve un booleano a verdadero
            this.Llego = true;
            //Se le asigna prioridad a 0
            this.Prioridad = 0;
            return true;
        }
        //Calcula el tiempo ejecutado
        this.TiempoEjecutado = (Date.now() - this.Inicio) / 1000;
        //Si el tiempo supera al tiempo que se le asigno
        if(this.TiempoEjecutado >= this.TiempoAsignado){
            //Se añade a tiempo total ejecutado
            this.TiempoTotal += this.TiempoEjecutado;
            //La distancia avanzada se calcula a partir del ancho del canvas
            this.DistanciaAvanzada = this.canvasWidth - (this.canvasWidth - this.Position.x)
            //Se reinician variables
            this.TiempoEjecutado = 0;
            this.Inicio = Date.now();
            //Se coloca que ya no se tiene el hilo
            this.Hilo = false
            return true;
        }
        return false;
    }
    //Obtiene la prioridad dandole un peso a la distancia y al tiempo total de ejecucion en proporcion 1 tiempo y y 0.1 la distancia
    ObtenerPrioridad(){
        return (this.Prioridad / (this.TiempoTotal + (this.DistanciaAvanzada / .01))) * 100000;
    }
    //Retorna si llego al tope
    LlegoMeta(){
        return this.Position.x >= this.canvasWidth - this.Radio
    }
}