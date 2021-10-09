import Citas from "./classes/Citas.js";
import UI from "./classes/UI.js";
import {mascotaInput, propietarioInput, telefonoInput, fechaInput,horaInput, sintomasInput, formulario} from "./selectores.js";

const administarCitas = new Citas();
const ui = new UI();
let editando;
export let DB;

// Objeto con información de la cita
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
}

// Agregar datos al objeto
export function datosCita(evento){
    citaObj[evento.target.name] = evento.target.value;
}

// Valida y agrega nueva cita
export function nuevaCita(evento){
    evento.preventDefault();

    // Extraer información de la cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // Validar información
    if( mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === ""){
        ui.imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }
    if(editando){
        administarCitas.editarCita({...citaObj});

        // Editar en IndexedDB
        const transaction = DB.transaction(["citas"], "readwrite");
        const objectStore = transaction.objectStore("citas");
        objectStore.put(citaObj);
        transaction.oncomplete = () => {
            ui.imprimirAlerta("Editado correctamente");

            formulario.querySelector("button[type='submit']").textContent = "Crear cita";
    
            // Quitar modo edición
            editando = false;
        }
        transaction.onerror = () => {
            console.log("Hubo un error")
        }
    } else{
        // Generar ID único
        citaObj.id = Date.now();

        // Creando nueva cita
        administarCitas.agregarCita({...citaObj});

        // Insertar registro en DB
        const transaction = DB.transaction(["citas"],"readwrite");

        // Habilitar objectStore
        const objectStore = transaction.objectStore("citas");

        // Insertar en DB
        objectStore.add(citaObj);

        transaction.oncomplete = () => {
            console.log("Cita agregada");
            // Mostrar mensaje en pantalla
            ui.imprimirAlerta("Se agregó correctamente");
        }
    }

    // Reiniciar el formulario y objeto
    formulario.reset();
    reiniciarObjeto();

    // Mostrar HTML de las citas
    ui.imprimirCitas();
}

export function reiniciarObjeto(){
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

export function eliminarCita(id){
    const transaction = DB.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");
    objectStore.delete(id);

    transaction.oncomplete = () =>{
        ui.imprimirAlerta(`La cita ${id} se eliminó correctamente`);
        ui.imprimirCitas();
    }
    transaction.onerror = () => {
        console.log("Ha sucedido un error");
    }
}

export function editarCita(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // Llenar inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar texto btn
    formulario.querySelector("button[type='submit']").textContent = "Guardar cambios";

    editando = true;
}

export function crearDB(){
    // Crear la base de datos v1.0
    const crearDB = window.indexedDB.open("citas", 1);

    // Si hay un error 
    crearDB.onerror = function(){
        console.log("Hubo un error");
    }

    // Si todo sale bien
    crearDB.onsuccess = function(){
        DB = crearDB.result;

        // Mostrar citas al cargar (IndexedDB ya esta listo)
        ui.imprimirCitas();
    }

    // Definir el esquema
    crearDB.onupgradeneeded = function(evento){
        const db = evento.target.result;
        const objectStore = db.createObjectStore("citas",{
            keyPath: "id",
            autoIncrement: true
        });

        // Definir las columnas
        objectStore.createIndex("mascota", "mascota", {unique:false});
        objectStore.createIndex("propietario", "propietario", {unique:false});
        objectStore.createIndex("telefono", "telefono", {unique:false});
        objectStore.createIndex("fecha", "fecha", {unique:false});
        objectStore.createIndex("hora", "hora", {unique:false});
        objectStore.createIndex("sintomas", "sintomas", {unique:false});
        objectStore.createIndex("id", "id", {unique:true});

        console.log("DB Creada y Lista");
    }
}