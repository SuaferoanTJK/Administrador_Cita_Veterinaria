// Campos Formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// UI
const formulario = document.querySelector("#nueva-cita");
const contenedor = document.querySelector("#citas");

let editando;

class Citas{
    constructor(){
        this.citas = [];
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
    editarCita(citaUpdate){
        this.citas = this.citas.map( cita => cita.id === citaUpdate.id ? citaUpdate : cita);
    }
}
class UI{
    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement("div");
        divMensaje.className = "text-center alert d-block col-12";

        if(tipo === "error"){
            divMensaje.classList.add("alert-danger");
        } else{
            divMensaje.classList.add("alert-success");
        }

        divMensaje.textContent = mensaje;
        document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector("#agregar-cita"));
        
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    imprimirCitas({citas}){
        this.limpiarHTML();

        citas.forEach(cita =>{
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            
            const citaDiv = document.createElement("div");
            citaDiv.className = "cita p-3";
            citaDiv.dataset.id = id;

            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.className = "card-title font-weight-bolder";
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `
                <span class = "font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `
                <span class = "font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `
                <span class = "font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `
                <span class = "font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `
                <span class = "font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            // Btn para eliminar cita
            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btn btn-danger mr-2";
            btnEliminar.innerHTML = "Eliminar <svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg>";
            btnEliminar.onclick = ()=> eliminarCita(id);

            // Btn para editar cita
            const btnEditar = document.createElement("button");
            btnEditar.innerHTML = "Editar <svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'></path></svg>";
            btnEditar.className = "btn btn-info mr-2";
            btnEditar.onclick = ()=> editarCita(cita);

            // Agregar info a la cita
            citaDiv.appendChild(mascotaParrafo);
            citaDiv.appendChild(propietarioParrafo);
            citaDiv.appendChild(telefonoParrafo);
            citaDiv.appendChild(fechaParrafo);
            citaDiv.appendChild(horaParrafo);
            citaDiv.appendChild(sintomasParrafo);
            citaDiv.appendChild(btnEditar);
            citaDiv.appendChild(btnEliminar);
            

            // Agregar cita al HTML
            contenedor.appendChild(citaDiv);
        })
    }
    limpiarHTML(){
        while(contenedor.firstChild){
            contenedor.removeChild(contenedor.firstChild);
        }
    }
}

const ui = new UI();
const administarCitas = new Citas();

// Eventos
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener("change", datosCita);
    propietarioInput.addEventListener("change", datosCita);
    telefonoInput.addEventListener("change", datosCita);
    fechaInput.addEventListener("change", datosCita);
    horaInput.addEventListener("change", datosCita);
    sintomasInput.addEventListener("change", datosCita);
    formulario.addEventListener("submit", nuevaCita);
}

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
function datosCita(evento){
    citaObj[evento.target.name] = evento.target.value;
}

// Valida y agrega nueva cita
function nuevaCita(evento){
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

function reiniciarObjeto(){
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

function eliminarCita(id){
    administarCitas.eliminarCita(id);
    ui.imprimirAlerta("La cita se eliminó correctamente");
    ui.imprimirCitas(administarCitas);
}

function editarCita(cita){
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
