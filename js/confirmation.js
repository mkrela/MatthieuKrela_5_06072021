main ();

function main () {
    displayOrderAndPrice ();
}

// On détermine les éléments du DOM où doivent s'afficher les informations ---------------------------------------------------------------------------------------------------------------------------------------------------------------
function displayOrderAndPrice () {
    const totalConfirmation = document.querySelector('.total span');
    const orderId = document.querySelector('.display-orderid');

    totalConfirmation.innerText= localStorage.getItem("total");
    orderId.innerText=localStorage.getItem("orderId");

    // on vide le LocalStorage pour finir l'opération ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // localStorage.clear();
}

