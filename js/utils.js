function errHandler(domElem, errMsg) {
    let productsContainer = document.querySelector(".products-container");
    domElem.innerHTML = errMsg;
    domElem.style.textAlign = "center";
    domElem.style.padding = "40vh 0";
}