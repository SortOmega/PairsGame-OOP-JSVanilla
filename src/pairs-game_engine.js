//------------------------------VENTANA PRINCIPAL-----------------------------------------
//document.oncontextmenu = function(){return false;}
//document.onkeydown = function(){return false;}
// let alturaVentanaPrincipal = screen.availHeight;
// document.body.style.height = `${alturaVentanaPrincipal}px`;
// addEventListener("resize",(evento)=>{
//     let alturaVentanaPrincipal = screen.availHeight;
//     console.log(alturaVentanaPrincipal);
//     document.body.style.height = alturaVentanaPrincipal;
// });
//------------------------------NAV-MENU__Acciones----------------------------------------
const navButton__mobile = document.querySelector("#check__Nav-Menu");
const headerNavMenu__mobile = document.querySelector(".header-navMenu");

navButton__mobile.addEventListener("change", (evento) => {
  //console.log(evento);
  if (evento.target.checked == true) {
    headerNavMenu__mobile.style.display = "flex";
  } else if (evento.target.checked == false) {
    headerNavMenu__mobile.style.display = "none";
  }
});
//------------------------------ACCIONES DEL CUERPO y JUEGO----------------------------------------
const gbGridPlayArea = document.querySelector(".gbGridElements");
const cmbDificultad = document.querySelector("#cmbDificultad");
const btnFileSelector = document.querySelector("#btnFileSelector");
const btnIniciarJuego = document.querySelector("#btnEmpezarGame");

let btnPalabra = new Array();

btnIniciarJuego.addEventListener("click", (evento) => {
  const empezar = confirm("Deseas Empezar el Juego?");
  if (empezar) {
    let archivoLeido;
    btnFileSelector.onchange = async function (evento) {
      let archivo = this.files[0];
      console.log(archivo);

      if (archivo.type == "text/plain") {
        let lector = new FileReader();
        lector.onloadend = function () {
          archivoLeido = this.result;
          preStateJuego(archivoLeido);
          //console.log(archivoLeido);
        };

        lector.readAsText(archivo);
      } else {
        alert("Tipo de archivo no valido!!");
      }
    };
    btnFileSelector.click();
  }
});

const preStateJuego = (textos) => {
  console.log(textos);
  btnPalabra = new Array();
  limpiarContenidoInternoHTML(gbGridPlayArea);
  let cantidadPalabras = 0;
  if (cmbDificultad.value == "gm_easy") {
    cantidadPalabras = 8;
  } else if (cmbDificultad.value == "gm_normal") {
    cantidadPalabras = 10;
  } else if (cmbDificultad.value == "gm_hard") {
    cantidadPalabras = 12;
  } else if (cmbDificultad.value == "gm_expert") {
    cantidadPalabras = 14;
  } else {
    return null;
  }
  generarBtnPalabras(cantidadPalabras, textos);
};

const generarBtnPalabras = async (cantidadPalabras, textos) => {
  try {
    if (typeof textos != "string") {
      throw "El segundo parametro NO es un dato de tipo texto!";
    }

    let palabrasObtenidas = textos.split("\n");

    palabrasObtenidas = barajarColeccion(palabrasObtenidas);

    let palabrasDificultad = new Array();

    for (let i = 0; i < cantidadPalabras; i++) {
      palabrasDificultad[i] = palabrasObtenidas[i];
    }
    for (let i = 0; i < cantidadPalabras; i++) {
      palabrasDificultad.push(palabrasDificultad[i]);
    }

    palabrasDificultad = barajarColeccion(palabrasDificultad);

    /*for(let i = 0; i < palabrasDificultad.length; i++){
            console.log( palabrasDificultad[i] );
        }*/

    for (let i = 1; i <= cantidadPalabras * 2; i++) {
      let botonGenerado = new buttonPalabra();

      botonGenerado.generarButton(
        gbGridPlayArea,
        `${palabrasDificultad[i - 1]}`,
        `gbGrid__btnPalabra_${i}`,
        "gbGrid__button",
        `Casilla ${i}`
      );
      btnPalabra[i] = botonGenerado;

      const btnPalabraGenerado = document.querySelector(
        `#${btnPalabra[i].elementId}`
      );
      btnPalabraGenerado.addEventListener("click", (evento) => {
        alert(`Has apretado el boton ${btnPalabra[i].palabraBtn}`);
      });
    }
  } catch (error) {
    console.log("Error durante el proceso: \n--> " + error);
  }
};

const limpiarContenidoInternoHTML = (elementoParaLimpiar) => {
  elementoParaLimpiar.innerHTML = "";
};

const barajarColeccion = (arrayParaBarajar = new Array()) => {
  try {
    if (!Array.isArray(arrayParaBarajar))
      throw "function barajarColeccion(): Parametro no es de tipo Array o una Colleccion!";
    //if( arrayParaBarajar.length == 0 ) throw "function barajarColeccion(): Array vacio o sin parametro!";
    console.log(arrayParaBarajar.length);
    let arrayBarajada = new Array();

    for (let i = 0; i < arrayParaBarajar.length; i += 0) {
      let indexRandom = Math.floor(Math.random() * arrayParaBarajar.length);
      if (!arrayBarajada.includes(arrayParaBarajar[indexRandom])) {
        arrayBarajada[i] = arrayParaBarajar[indexRandom];
        console.log(i + ") " + arrayBarajada[i]);
        i++;
        //console.log("TOMATE");
      }
    }
    return arrayBarajada;
  } catch (error) {
    console.log("Error durante el proceso: \n--> " + error);
  }
};
