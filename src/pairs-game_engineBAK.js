import buttonPalabra from "./buttonPalabra.js";
//------------------------------ TERMINOS GLOBALES-----------------------------------------
let cantidadPalabras = 0;
let aciertos = 0;
let fallidos = 0;
let cantBtnSelected = 0;
let btnSelected = new Array();
let btnPalabra = new Array();
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
const labelDificultad = document.querySelector(".navTxt-dificultad");
const labelAciertos = document.querySelector(".navTxt-aciertos");
const labelFallidos = document.querySelector(".navTxt-fallidos");

const labelsHeader = document.querySelectorAll(".nav-hidden");

navButton__mobile.addEventListener("change", (evento) => {
  console.log("Hola");
  if (evento.target.checked == true) {
    headerNavMenu__mobile.style.display = "flex";
  } else if (evento.target.checked == false) {
    headerNavMenu__mobile.style.display = "none";
  }
});

const actualizarValoresLabel = (labelElement = Element, valorLabel = "") => {
  labelElement.innerHTML = valorLabel;
};
const verLabels = () => {
  for (let i = 0; i < labelsHeader.length; i++) {
    console.log(labelsHeader.item(i));
  }
};

const mostrarLabels = () => {
  for (let i = 0; i < labelsHeader.length; i++) {
    if (labelsHeader.item(i).matches(".nav-hidden")) {
      labelsHeader.item(i).style.display = "block";
      console.log(labelsHeader.item(i));
    }
  }
};
//verLabels();
//mostrarLabels();
//------------------------------ACCIONES DEL CUERPO y JUEGO----------------------------------------

const gbGridPlayArea = document.querySelector(".gbGridElements");
const cmbDificultad = document.querySelector("#cmbDificultad");
const radioAutoWords = document.querySelector("#rdGenerar_auto");
const radioManualWords = document.querySelector("#rdGenerar_manual");
const btnFileSelector = document.querySelector("#btnFileSelector");
const btnIniciarJuego = document.querySelector("#btnEmpezarGame");

btnIniciarJuego.addEventListener("click", async (evento) => {
  const empezar = confirm("Deseas Empezar el Juego?");
  if (empezar) {
    let archivoLeido = "";
    if (radioAutoWords.checked) {
      let lector = fetch("../game_content/autogen_words.txt");
      archivoLeido = await lector
        .then((res) => res.blob())
        .then((res) => res.text());
      //console.log(typeof archivoLeido);
      preStateJuego(archivoLeido);
    } else if (radioManualWords.checked) {
      btnFileSelector.click();
      btnFileSelector.onchange = function (evento) {
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
    } else {
      alert("Seleccione una opcion de generar Palabras!");
      return null;
    }
  }
});

const preStateJuego = (textos) => {
  console.log(textos);
  btnFileSelector.value = ""; //Para limpiar el valor del archivo cargado
  // y funcione el evento onchange en caso se escoja el mismo archivo.
  btnPalabra = new Array();
  limpiarContenidoInternoHTML(gbGridPlayArea);
  cantidadPalabras = 0;
  if (cmbDificultad.value == "gm_easy") {
    cantidadPalabras = 8;
    actualizarValoresLabel(labelDificultad, "FACIL");
  } else if (cmbDificultad.value == "gm_normal") {
    cantidadPalabras = 10;
    actualizarValoresLabel(labelDificultad, "NORMAL");
  } else if (cmbDificultad.value == "gm_hard") {
    cantidadPalabras = 12;
    actualizarValoresLabel(labelDificultad, "DIFICIL");
  } else if (cmbDificultad.value == "gm_expert") {
    cantidadPalabras = 14;
    actualizarValoresLabel(labelDificultad, "EXPERTO");
  } else {
    return null;
  }
  aciertos = 0;
  fallidos = 0;
  actualizarValoresLabel(labelAciertos, aciertos);
  actualizarValoresLabel(labelFallidos, fallidos);
  //mostrarLabels();
  generarBtnPalabras(cantidadPalabras, textos);
};

const generarBtnPalabras = (cantidadPalabras = 0, textos) => {
  try {
    if (typeof textos != "string") {
      throw "El segundo parametro NO es un dato de tipo texto!";
    }

    let palabrasObtenidas = textos.split("\n");

    palabrasObtenidas = barajarColeccion(palabrasObtenidas, false);

    /*console.log(palabrasObtenidas);
    console.log(palabrasObtenidas.length);
    console.log(cantidadPalabras);//*/
    if (palabrasObtenidas.length < cantidadPalabras) {
      const messageError =
        "El archivo no contiene la cantidad de palabras requeridas para jugar en la dificultad " +
        labelDificultad.innerHTML +
        "!";
      alert(messageError);
      throw messageError;
    }

    let palabrasDificultad = new Array();

    for (let i = 0; i < cantidadPalabras; i++) {
      palabrasDificultad[i] = palabrasObtenidas[i];
    }
    for (let i = 0; i < cantidadPalabras; i++) {
      palabrasDificultad.push(palabrasDificultad[i]);
    }

    palabrasDificultad = barajarColeccion(palabrasDificultad);

    /*for (let i = 0; i < palabrasDificultad.length; i++) {
      console.log(palabrasDificultad[i]);
    }//*/

    for (let i = 1; i <= cantidadPalabras * 2; i++) {
      let botonGenerado = new buttonPalabra();

      botonGenerado.generarButton(
        gbGridPlayArea,
        `${palabrasDificultad[i - 1]}`,
        `gbGrid__btnPalabra_${i}`,
        "gbGrid__button",
        `Casilla ${i}`,
        i
      );
      btnPalabra[i] = botonGenerado;

      const btnPalabraGenerado = document.querySelector(
        `#${btnPalabra[i].elementId}`
      );
      //---AÑADIR EVENTO A CADA UNO DE LOS BOTONONES DE PALABRAS
      btnPalabraGenerado.addEventListener("click", (evento) => {
        try {
          if (cantBtnSelected < 0 || cantBtnSelected > 2) {
            alert("Error en la cantidad de botones seleccionados!");
            cantBtnSelected = 0;
          } else if (cantBtnSelected >= 0 || cantBtnSelected < 2) {
            if (btnPalabra[i].seleccionado) {
              btnPalabra[i].seleccionado = false;
              btnPalabraGenerado.classList.remove("btnSeleccionado");
              btnSelected.pop();
              cantBtnSelected--;
            } else {
              btnPalabra[i].seleccionado = true;
              btnPalabraGenerado.classList.add("btnSeleccionado");
              cantBtnSelected++;
              btnSelected[cantBtnSelected] = btnPalabra[i];
              //console.log(btnSeleccionados.botones[ btnSeleccionados.cantidad ].palabraBtn);
              console.log(
                cantBtnSelected +
                  ") " +
                  btnSelected[cantBtnSelected].index +
                  " " +
                  btnSelected[cantBtnSelected].elementId +
                  "-> " +
                  btnSelected[cantBtnSelected].palabraBtn
              );
              if (cantBtnSelected == 2) {
                //alert("Hay dos botones seleccionados, vamo a resetear");

                if (btnSelected[1].palabraBtn != btnSelected[2].palabraBtn) {
                  document
                    .querySelector(`#${btnSelected[1].elementId}`)
                    .classList.remove("btnSeleccionado");
                  document
                    .querySelector(`#${btnSelected[1].elementId}`)
                    .classList.add("btnErroneo");
                  document.querySelector(
                    `#${btnSelected[1].elementId}`
                  ).innerHTML = btnSelected[1].palabraBtn;
                  document.querySelector(
                    `#${btnSelected[1].elementId}`
                  ).disabled = true;

                  document
                    .querySelector(`#${btnSelected[2].elementId}`)
                    .classList.add("btnErroneo");
                  document
                    .querySelector(`#${btnSelected[2].elementId}`)
                    .classList.remove("btnSeleccionado");
                  document.querySelector(
                    `#${btnSelected[2].elementId}`
                  ).innerHTML = btnSelected[2].palabraBtn;
                  document.querySelector(
                    `#${btnSelected[2].elementId}`
                  ).disabled = true;

                  //Ejecutar metodo temporizador asyncrono en Promesa para que al momento de llamar
                  //Quede encapsulado y obtener su resultado de manera sincronica con los
                  //demas instrucciones por delante (cuando se llame este empezara a trabajar asincronamente
                  // sin afectar a las otras instrucciones sincronas) Usar cuando se quiera modificar el DOM
                  // en plazos de tiempo
                  const erroneoTemp = async (btnSelected) => {
                    new Promise((resolve, reject) =>
                      setTimeout(function () {
                        document
                          .querySelector(`#${btnSelected[1].elementId}`)
                          .classList.remove("btnErroneo");
                        document.querySelector(
                          `#${btnSelected[1].elementId}`
                        ).innerHTML = btnSelected[1].innerHtml_ButtonContent;
                        document.querySelector(
                          `#${btnSelected[1].elementId}`
                        ).disabled = false;
                        document
                          .querySelector(`#${btnSelected[2].elementId}`)
                          .classList.remove("btnErroneo");
                        document.querySelector(
                          `#${btnSelected[2].elementId}`
                        ).innerHTML = btnSelected[2].innerHtml_ButtonContent;
                        document.querySelector(
                          `#${btnSelected[2].elementId}`
                        ).disabled = false;
                      }, 1500)
                    );
                  };
                  fallidos++;
                  actualizarValoresLabel(labelFallidos, fallidos);
                  erroneoTemp(btnSelected);
                } else {
                  document
                    .querySelector(`#${btnSelected[1].elementId}`)
                    .classList.remove("btnSeleccionado");
                  document
                    .querySelector(`#${btnSelected[1].elementId}`)
                    .classList.add("btnAcertado");
                  document.querySelector(
                    `#${btnSelected[1].elementId}`
                  ).innerHTML = btnSelected[1].palabraBtn;
                  document.querySelector(
                    `#${btnSelected[1].elementId}`
                  ).disabled = true;
                  document
                    .querySelector(`#${btnSelected[2].elementId}`)
                    .classList.remove("btnSeleccionado");
                  document
                    .querySelector(`#${btnSelected[2].elementId}`)
                    .classList.add("btnAcertado");
                  document.querySelector(
                    `#${btnSelected[2].elementId}`
                  ).innerHTML = btnSelected[1].palabraBtn;
                  document.querySelector(
                    `#${btnSelected[2].elementId}`
                  ).disabled = true;
                  aciertos++;
                  actualizarValoresLabel(labelAciertos, aciertos);
                  comprobarVictoria();
                }
                btnPalabra[btnSelected[1].index].seleccionado = false;
                btnPalabra[btnSelected[2].index].seleccionado = false;

                cantBtnSelected = 0;
                btnSelected = new Array();
                console.log(cantBtnSelected + "RESETEADO");
              }
            }
          }
        } catch (error) {
          console.log("Error durante el proceso: \n--> " + error);
        }

        //console.log( btnPalabra[i].elementId+": " + btnPalabra[i].seleccionado );
        //alert(`Has apretado el boton ${btnPalabra[i].palabraBtn}`);
      });
    }
  } catch (error) {
    console.log("Error durante el proceso: \n--> " + error);
  }
};

const limpiarContenidoInternoHTML = (elementoParaLimpiar = Element) => {
  elementoParaLimpiar.innerHTML = "";
};

const barajarColeccion = (
  arrayParaBarajar = new Array(""),
  Repetidos = true
) => {
  try {
    if (!Array.isArray(arrayParaBarajar))
      throw "function barajarColeccion(): Parametro no es de tipo Array o una Colleccion!";
    if (arrayParaBarajar.length == 0)
      throw "function barajarColeccion(): Array vacio o sin parametro!";
    //console.log(arrayParaBarajar.length);
    let arrayBarajada = new Array();

    if (Repetidos) {
      //simplemente barajar todos los elementos!
      let indicesEvaluados = new Array();
      for (let i = 0; i < arrayParaBarajar.length; i += 0) {
        let indexRandom = Math.floor(Math.random() * arrayParaBarajar.length);
        if (!indicesEvaluados.includes(indexRandom)) {
          arrayBarajada[i] = arrayParaBarajar[indexRandom];
          indicesEvaluados[i] = indexRandom;
          //console.log( i + ") " + arrayBarajada[i]);
          //console.log("LECHUGA");
          i++;
        }
      }
    } else if (!Repetidos) {
      //barajar y eliminare todos los datos repetidos que contenga el Array previo
      for (let i = 0; i < arrayParaBarajar.length; i++) {
        if (
          !arrayBarajada.includes(arrayParaBarajar[i].trim()) &&
          arrayParaBarajar[i].trim() != "" &&
          arrayParaBarajar[i].trim() != undefined
        ) {
          arrayBarajada.push(arrayParaBarajar[i].trim());
          //console.log( i + ") " + arrayBarajada[i] );
          //console.log("TOMATE");
        }
      }
      arrayBarajada = barajarColeccion(arrayBarajada, true);
    }
    return arrayBarajada;
  } catch (error) {
    console.log("Error durante el proceso: \n--> " + error);
  }
};

const comprobarVictoria = () => {
  if (aciertos == cantidadPalabras) {
    alert("Felicidades! Encontraste todos los pares de palabras =D");
    aciertos = 0;
    fallidos = 0;
  }
};
