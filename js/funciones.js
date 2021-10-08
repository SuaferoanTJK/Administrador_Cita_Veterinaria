import Citas from "./classes/Citas.js";
import UI from "./classes/UI.js";
import {mascotaInput, propietarioInput, telefonoInput, fechaInput,horaInput, sintomasInput, formulario} from "./selectores.js";

const ui = new UI();
const administarCitas = new Citas();
let editando;

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
        ui.imprimirAlerta("Editado correctamente");
        administarCitas.editarCita({...citaObj});
        formulario.querySelector("button[type='submit']").textContent = "Crear cita";

        // Quitar modo edición
        editando = false;
    } else{
        // Generar ID único
        citaObj.id = Date.now();

        // Creando nueva cita
        administarCitas.agregarCita({...citaObj});

        ui.imprimirAlerta("Se agregó correctamente");
    }

    // Reiniciar el formulario y objeto
    formulario.reset();
    reiniciarObjeto();

    // Mostrar HTML de las citas
    ui.imprimirCitas(administarCitas);
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
    administarCitas.eliminarCita(id);
    ui.imprimirAlerta("La cita se eliminó correctamente");
    ui.imprimirCitas(administarCitas);
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