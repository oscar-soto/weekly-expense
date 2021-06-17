// Variables y Selectoresµ
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
   document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

   formulario.addEventListener('submit', agregarGasto);
}

// Classes
class Presupuesto {

   constructor(presupuesto) {
      this.presupuesto = Number(presupuesto);
      this.restante = Number(presupuesto);
      this.gastos = [];
   }

   nuevoGasto(gasto) {
      this.gastos = [...this.gastos, gasto];
      this.calcularRestante();
   }

   calcularRestante() {
      // Sumar lo que he gastado
      const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );

      // Restar el gastado al presupuesto
      this.restante =  this.presupuesto - gastado;
   }

   eliminarGasto(id) {
      this.gastos = this.gastos.filter( gasto => gasto.id !== id);
      this.calcularRestante();
   }
}

class UI {
   insertarPresupuesto( cantidad ) {
      // Extrayendo los valores
      const {presupuesto, restante} = cantidad;

      // Agregar al HTML
      document.querySelector('#total').textContent = presupuesto;
      document.querySelector('#restante').textContent = restante;
   }

   imprimirAlerta(mensaje, tipo) {
      // Crear el div
      const divMensaje = document.createElement('div');
      divMensaje.classList.add('text-center', 'alert');

      if(tipo === 'error') {
         divMensaje.classList.add('alert-danger');
      } else {
         divMensaje.classList.add('alert-success');
      }

      // Mensaje de error
      divMensaje.textContent = mensaje;

      // Insertar en el HTML
      document.querySelector('.primario').insertBefore(divMensaje, formulario);

      // Quitar del HTML

      setTimeout(() => {
         divMensaje.remove();
      }, 3000);
   }

   mostrarGastos(gastos) {
      this.limpiarHTML(); // Elimina el HTML previo

      // iterar sobre los gastos
      gastos.forEach(gasto => {
         const {cantidad, nombre, id} = gasto;

         // Crear un LI
         const nuevoGasto = document.createElement('li')
         nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
         // nuevoGasto.setAttribute('data-id', id); // forma vieja
         nuevoGasto.dataset.id = id;

         // Agregar HMTL del gasto
         nuevoGasto.innerHTML = `${nombre} <span class ="badge badge-primary badge-pill"> $ ${cantidad} </span>`

         // Boton para borrar el gasto
         const btnBorrar = document.createElement('button');
         btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
         btnBorrar.innerHTML = 'Borrar &times;';

         btnBorrar.onclick = () => {
            eliminarGasto(id);
         }

         nuevoGasto.appendChild(btnBorrar);

         // agregar al HTML

         gastoListado.appendChild(nuevoGasto);
      });
   }

   limpiarHTML() {

      // Limpiar el contenido
      while(gastoListado.firstChild) {
         gastoListado.removeChild(gastoListado.firstChild)
      }
   }

   actualizarRestante(restante) {
      document.querySelector('#restante').textContent = restante;
   }

   comprobarPresupuesto(presupuestoOBJ) {
      const {presupuesto, restante} = presupuestoOBJ;

      const restarDiv = document.querySelector('.restante');
      // Comprobar 25%
      if( (presupuesto / 4) > restante ) {
         restarDiv.classList.remove('alert-success', 'alert-warning');
         restarDiv.classList.add('alert-danger');
      } else if( (presupuesto / 2) > restante ) { // 50%
         restarDiv.classList.remove('alert-success');
         restarDiv.classList.add('alert-warning');
      } else {
         restarDiv.classList.remove('alert-warning', 'alert-danger');
         restarDiv.classList.add('alert-success');
      }

      // Si el total es 0 o menor
      if(restante <= 0) {
         ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
         formulario.querySelector('button[type="submit"]').disabled = true;

      }

   }
}

// Instanciar
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
   const presupuestoUsuario = prompt('Cual es tu presupuesto?');

   if( presupuestoUsuario === '' || presupuestoUsuario === null || isNaN( presupuestoUsuario ) || presupuestoUsuario <= 0) {
      window.location.reload();
   }

   // Presupuesto Valido
   presupuesto = new Presupuesto(presupuestoUsuario)
   ui.insertarPresupuesto(presupuesto)
}

// añade gastos
function agregarGasto(e) {
   
   e.preventDefault();

   // Leer los datos del formulario
   const nombre = document.querySelector('#gasto').value;
   const cantidad =Number( document.querySelector('#cantidad').value);

   // validar
   if(nombre === '' || cantidad === '') {
      ui.imprimirAlerta('Ambos campos son obligatorio', 'error');
      return;

   } else if( cantidad <= 0 || isNaN(cantidad) ) {
      ui.imprimirAlerta('Cantidad no valida', 'error');

      return;
   }

   // Generar un objecto con el gasto
   const gasto = { 
      nombre,        // nombre : nombre
      cantidad,      // Cantidad : cantidad
      id: Date.now() 
   } // Va unir nombre y cantidad a gasto (Object literal enhancement)

   presupuesto.nuevoGasto( gasto );

   // Mensaje de sastifactorio
   ui.imprimirAlerta('Gasto agregado correctamente' );

   // Imprimir los gastos
   const { gastos, restante } = presupuesto;
   // ui.agregarGastoListado(gastos);
   ui.mostrarGastos(gastos);
   
   ui.actualizarRestante(restante);
   
   // ir cambiando el color
   ui.comprobarPresupuesto(presupuesto);

   // Reinicia el formulario
   formulario.reset();
}

function eliminarGasto(id) {
   // Elimina los gastos del objecto
   presupuesto.eliminarGasto(id);

   // Elimina los gastos del HTML
   const { gastos, restante} = presupuesto;
   ui.mostrarGastos(gastos);

   ui.actualizarRestante(restante);
   
   ui.comprobarPresupuesto(presupuesto);
}

console.log(presupuesto)
console.log(ui)