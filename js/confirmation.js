main ();

function main () {
    displayOrderAndPrice ();
}

function displayOrderAndPrice () {
    const totalConfirmation = document.querySelector('.total span');
    const orderId = document.querySelector('.display-orderid');

    totalConfirmation.innerText= localStorage.getItem("total");
    orderId.innerText=localStorage.getItem("orderId");

    // on vide le LocalStorage 

    localStorage.clear();
}

