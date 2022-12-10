export default class buttonPalabra {
  index = 0;
  palabraBtn;
  elementId;
  innerHtml_ButtonContent;
  seleccionado = false;

  constructor() {}

  generarButton(
    targetElement = Element,
    palabraBtn = "",
    elementId = "",
    elementClassName = "",
    innerHtml_ButtonContent = "",
    indice = 0
  ) {
    this.index = indice;
    this.palabraBtn = palabraBtn;
    this.elementId = elementId;
    this.innerHtml_ButtonContent = innerHtml_ButtonContent;
    this.seleccionado = false;
    const createBtnDOM = document.createDocumentFragment();
    const setBtnDOM = document.createElement("BUTTON");
    setBtnDOM.setAttribute("type", "button");
    setBtnDOM.className = elementClassName;
    setBtnDOM.id = this.elementId;
    setBtnDOM.innerHTML = this.innerHtml_ButtonContent;
    createBtnDOM.appendChild(setBtnDOM);
    targetElement.appendChild(createBtnDOM);
  }
}
