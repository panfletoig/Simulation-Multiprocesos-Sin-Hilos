class Pista{
    ///Clase pista
    ///Hilos: Numero de Hilos por cpu -> 2 CPU = doble de hilos
    ///HilosDisponibles: Procesos que pueden Ejecutar
    constructor(cpu, hilos){
        this.HilosTotales = hilos * cpu;
        this.HilosDisponibles = this.HilosTotales;
    }   
    
    //Si se puede tomar un hilo retorna 1 sino retorna 0
    TomarHilo(){
        if(this.HilosDisponibles > 0){
            this.HilosDisponibles--;
            return 1;
        }
        return 0
    }
    //Si regresa uno de los hilos tomados
    LiberarHilo(){
        if(this.HilosDisponibles < this.HilosTotales){
            this.HilosDisponibles += 1;
            console.log("Hilo recuperado")
        }
    }
}