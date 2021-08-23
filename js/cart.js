// On définit copyOfLS qui est notre contenu du localStorage, ici les produits ajoutés au panier ------------------------------------------------------------------------------------------------------------------------------------
let cart = document.querySelector(".cart-card__recap");
const copyOfLS = JSON.parse(localStorage.getItem("products"));
const regexEmail =
  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,63})$/;

main();
function main() {
  displayCart();
  countTotalInCart();
  toEmptyCart();
  checkFormAndPostRequest();
}

// Définition de la fonction d'affichage du panier ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function displayCart() {
  let test = document.querySelector(".width-to-empty-cart");
  cartCard = document.querySelector(".cart-card");
  let emptyCart = document.querySelector(".if-empty-cart");
  // Si le array en provenance du localStorage contient un objet, on affiche le panier et rend invisible le message qui informe du panier vide --------------------------------------------------------------------------------------
  if (localStorage.getItem("products")) {
    cartCard.style.display = "flex";
    cartCard.style.flexDirection = "column";
    cartCard.style.justifyContent = "space-around";
    emptyCart.style.display = "none";
  }
  // Pour chaque élément du LocalStorage, on crée les divs dynamiquement via une boucle pour remplir le tableau ----------------------------------------------------------------------------------------------------------------------

  for (let produit in copyOfLS)
    if (copyOfLS !== null) {
      let productRow = document.createElement("div");
      cart.insertBefore(productRow, test);
      productRow.classList.add("cart-card__recap__row", "product-row");

      let productName = document.createElement("div");
      productRow.appendChild(productName);
      productName.classList.add("cart-card__recap__title");
      productName.innerHTML = copyOfLS[produit].name;

      let productQuantity = document.createElement("div");
      productRow.appendChild(productQuantity);
      productQuantity.classList.add(
        "cart-card__recap__title",
        "title-quantity"
      );
      productQuantity.innerHTML = copyOfLS[produit].quantity;

      let productPrice = document.createElement("div");
      productRow.appendChild(productPrice);
      productPrice.classList.add(
        "cart-card__recap__title",
        "data-price",
        "price"
      );
      productPrice.innerHTML = copyOfLS[produit].price;

      // affichage prix au bon format -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

      productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(copyOfLS[produit].price * copyOfLS[produit].quantity);
    } else {
      console.log("Rien dans le LocalStorage");
    }
}

function countTotalInCart() {
  let arrayOfPrice = [];
  let totalPrice = document.querySelector(".total");

  // // On push chaque prix de nos articles dans un tableau -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  for (let produit in copyOfLS) {
    let prixArticle = copyOfLS[produit].price * copyOfLS[produit].quantity;
    arrayOfPrice.push(prixArticle);
  }

  // Additionner les valeurs du tableau pour avoir le prix total -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  if (arrayOfPrice.length > 0) {
    const reducer = (acc, currentVal) => acc + currentVal;
    arrayOfPrice = arrayOfPrice.reduce(reducer);
  }

  // Affichage du prix avec formatage €
  totalPrice.innerText = `Total : ${(arrayOfPrice = new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(arrayOfPrice))}`;
}

function toEmptyCart() {
  // Lorsque qu'on clique sur le bouton, le panier se vide ainsi que le localStorage ----------------------------------------------------------------------------------------------------------------------------------------------------
  const buttonToEmptyCart = document.querySelector(".to-empty-cart");
  buttonToEmptyCart.addEventListener("click", () => {
    localStorage.clear();
  });
}

// On récupère les infos de l'utilisateur ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function checkFormAndPostRequest() {
  const submit = document.querySelector("#submit");

  // On vérifie dans un premier temps que le localStorage contient des objets ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  if (copyOfLS) {
    let inputName = document.querySelector("#name");
    let inputLastName = document.querySelector("#lastname");
    let inputPostal = document.querySelector("#postal");
    let inputCity = document.querySelector("#city");
    let inputAddress = document.querySelector("#adress");
    let inputMail = document.querySelector("#mail");
    let erreur = document.querySelector(".erreur");

    //  On crée un listener pour vérifier que tous les champs sont renseignés ----------------------------------------------------------------------------------------------------------------------------------------------------------------
    submit.addEventListener("click", (e) => {
      if (
        !inputName.value ||
        !inputLastName.value ||
        !inputPostal.value ||
        !inputCity.value ||
        !inputAddress.value ||
        !inputMail.value
      ) {
        // On diffuse un message d'erreur si des champs sont vides ou le numéro pas au bon format ----------------------------------------------------------------------------------------------------------------------------------------------
        erreur.innerHTML = "Vous devez renseigner tous les champs !";
        e.preventDefault();
      } else if (!regexEmail.test(inputMail.value)) {
        e.preventDefault();
        erreur.innerText = "L'adresse mail n'est pas valide";
      } else {
        let productsBought = [];
        productsBought.push(copyOfLS);

        // On crée la constante Order qui va prendre les informations contact de l'utilisateur ----------------------------------------------------------------------------------------------------------------------------------------------
        const order = {
          contact: {
            firstName: inputName.value,
            lastName: inputLastName.value,
            city: inputCity.value,
            address: inputAddress.value,
            email: inputMail.value,
          },
          products: productsBought,
        };

        // Envoi de la requête POST au backend ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        // creation de l'entête de la requête  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        const options = {
          method: "POST",
          body: JSON.stringify(order),
          headers: { "Content-type": "application/json" },
        };
        // Préparation du prix formaté pour l'afficher sur la prochaine page ---------------------------------------------------------------------------------------------------------------------------------------------------------------
        let priceConfirmation = document.querySelector(".total").innerText;
        priceConfirmation = priceConfirmation.split(":");

        // Envoi de la requête avec l'en tête. On changera de page avec un localStorage contient order, id, prix ---------------------------------------------------------------------------------------------------------------------------
        fetch("http://localhost:3000/api/teddies/order", options)
          .then((response) => response.json())
          .then((data) => {
            localStorage.clear();
            localStorage.setItem("orderId", data.orderId);
            localStorage.setItem("total", priceConfirmation[1]);

            //  vérifier le statut 201 de la requête fetch ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            document.location.href = "confirmation.html";
          })
          .catch((err) => {
            alert("Il y a une erreur:" + err);
          });
      }
    });

    // Si le panier est vide on indique à l'utilisateur qu'il doit au moins acheter 1 article pour passer commande --------------------------------------------------------------------------------------------------------------------------
  } else {
    submit.addEventListener("click", (e) => {
      e.preventDefault();
      let erreur = document.querySelector(".erreur");
      erreur.innerText = "Votre panier est vide, vous devez le remplir !";
    });
  }
}
