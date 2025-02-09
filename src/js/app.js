let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

const diasFeriados = [
    '2025-01-01',
    '2025-02-03',
    '2025-03-17',
    '2025-09-16',
    '2025-11-17',
    '2025-12-25'
]

document.addEventListener('DOMContentLoaded', function() {  
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la sección cuando se presionan los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaAnterior();
    paginaSiguiente();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente(); 
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto de cita
    seleccionarHora(); // Añade la hora de la cita en el objeto de cita

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
    
    // Seccion
    // Eliminar la clase mostrar de todas las secciones
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) { // Solo si hay una sección anterior
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Tab
    // Quita el resalte del tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) { // Solo si hay un tab anterior
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => { // Itera sobre cada uno de los botones
        boton.addEventListener('click', function(e) { 
            
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion(); 
            botonesPaginador(); // Actualiza los botones del paginador
        });
    })
}

function botonesPaginador() {
    
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');   

    if (paso === 1) { // Si es la primer sección, desactiva el botón anterior
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();  // Muestra el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        if (paso <= pasoInicial) return;
        paso--; 

        mostrarSeccion();
        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        if (paso >= pasoFinal) return;
        paso++;

        mostrarSeccion();
        botonesPaginador();
    });
}

// Consulta la API en el backend de PHP
async function consultarAPI() {

    try {
        const url = '/api/servicios'; // URL de la API
        const resultado = await fetch(url) // fetch es la funcion que nos va a permitir consumir este servicio
        const servicios = await resultado.json(); // json() es la función que nos convierte el resultado en un objeto JavaScript

        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;  

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;

     // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Confirmar si un servicio ya fue agregado
    if (servicios.some(agregado => agregado.id === id)) {
        // Eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputfecha = document.querySelector('#fecha');
    const diaDespues = new Date();
    diaDespues.setDate(diaDespues.getDate() + 1); // Dia actual +1
    const fechaMinima = diaDespues.toISOString().split('T')[0]; // Convertir a 'YYYY-MM-DD'

    inputfecha.addEventListener('input', function(e) {
        const dia = new Date(e.target.value).getUTCDay(); 
        const fechaSeleccionada = e.target.value;
        
        if ( [6, 0].includes(dia) ) {
            e.target.value = ''; // Limpia el input
            mostrarAlerta("Cerrado Fines de Semana", "error", ".formulario");
        } else if(fechaSeleccionada < fechaMinima) {
            e.target.value = '';
            mostrarAlerta("No puedes seleccionar una fecha actual o anterior a " + dia, "error", ".formulario");
        } else if(diasFeriados.includes(fechaSeleccionada)) {
            e.target.value = ''; // Limpia el input
            mostrarAlerta("Cerrado Días Festivos", "error", ".formulario");
        }  else {
            cita.fecha = fechaSeleccionada;
        }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {

        const horaCita = e.target.value;
        const [hora, minutos] = horaCita.split(":").map(Number);
        if (hora < 10 || (hora === 18 && minutos > 0) || hora > 18) {
            e.target.value = ''; // Limpia el input si la hora no es valida
            mostrarAlerta("La hora de la cita debe estar entre las 10:00 AM y las 6:00 PM", "error", ".formulario");
        } else {
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // Previene que se generen más de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    // Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {
        // Elimina la alerta después de 3 segundos
        setTimeout(() => {
        alerta.remove();
        }, 3000);
    }
    
}

function mostrarResumen() { 
    const resumen = document.querySelector('.contenido-resumen'); 

    // Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if ( Object.values(cita).includes("") || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    } 

    // Formatear el DIV de  resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para Servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicios');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // Heading para Citas en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechObj = new Date(fecha);
    const mes = fechObj.getMonth();
    const dia = fechObj.getDate() +2;
    const year = fechObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));
    // Fecha formateada al español
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Botón para confirmar la cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.classList.add('boton');
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}

async function reservarCita() {

    const { nombre, fecha, hora, servicios, id } = cita;
    const idServicios = servicios.map(servicio => servicio.id );
    // console.log(idServicios);

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    try {
        // Peticion hacia la API
        const url = '/api/citas'; // Funciona si vas a guardar el backend y frontend en el mismo dominio (/api/citas)
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado.resultado);

        if (resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Su cita fue creada correctamente",
                button: "OK"
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al guardar la cita. Por favor, recarga la página e inténtalo nuevamente.",
          });
    }

    // console.log([...datos]);
}
