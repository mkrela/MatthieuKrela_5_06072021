let params = new URL(document.location).searchParams;
let id = params.get("id");
//  Définition des constantes -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const productCardImg = document.querySelector(".img");
const productCardName = document.querySelector(".product-card__infos__title");
const productCardDescription = document.querySelector(".product-card__infos__description");
const productCardPrice = document.querySelector(".product-card__infos__price");
const bearNumber = document.querySelector("#bearNum");
const colorSelect = document.querySelector("#color-select");

//  APPEL DE LA FONCTION MAIN -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

main();

//  Définition de la fonction main -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function main() {
  checkIf404();
  getArticles();
  addToCart();
}

// Définit une fonction en cas d'erreur 404 ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function checkIf404() {
  window.addEventListener(
    "error",
    (e) => {
      let container = document.querySelector(".container");
      container.innerHTML = `<p>Cette page n'existe pas. <a class="back-to-home" href="index.html">Retourner dans la boutique ?</a></p>`;
      container.style.padding = "40vh 0";
      container.style.fontSize = "26px";
      let backToHomeLink = document.querySelector(".back-to-home");
      backToHomeLink.style.textDecoration = "underline";
    },
    true
  );
}

function getArticles() {
  // On récupère uniquement le produit concerné via le paramètre dans la requête ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  fetch(`http://localhost:3000/api/teddies/${id}`)
    .then(function (response) {
      return response.json();
    })

    // Si la requête échoue, on définit un message d'erreur -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    .catch((error) => {
      let container = document.querySelector(".container");
      container.innerHTML =
        "Nous n'avons pas réussi à afficher nos nounours. Avez-vous bien lancé le serveur local (Port 3000) ? <br>Si le problème persiste, contactez-nous.";
      container.style.textAlign = "center";
      container.style.padding = "45vh 0";
    })

    // On place les données reçues via l'API aux bons endroits sur la page -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    .then(function (resultatAPI) {
      article = resultatAPI;
      productCardName.innerHTML = article.name;
      productCardImg.src = article.imageUrl;
      productCardDescription.innerText = article.description;

      // Formatage du prix pour l'afficher en euros ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      article.price = article.price / 100;
      productCardPrice.innerText = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(article.price);

      //  Création de l'element optionnel de l'article (Ici la couleur) ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      let colorSelect = document.getElementById("color-select");
      for (let i = 0; i < article.colors.length; i++) {
        let option = document.createElement("option");
        option.innerText = article.colors[i];
        colorSelect.appendChild(option);
      }
    });
}
// FONCTION D'AJOUT AU PANIER ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// On détermine les élements du DOM pour la fonction ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
function addToCart() {
  const addToCartBtn = document.querySelector(".add-to-cart");
  const confirmation = document.querySelector(".added-to-cart-confirmation");
  const textConfirmation = document.querySelector(".confirmation-text");

  // On définit le Listener et sa condition -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  addToCartBtn.addEventListener("click", () => {
    if (bearNumber.value > 0 && bearNumber.value < 100) {
      // CREATION DU PRODUIT A AJOUTER AU PANIER -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      let productAdded = {
        name: article.name,
        price: article.price,
        quantity: parseFloat(document.querySelector("#bearNum").value),
        id: id,
      };

      // GESTION DU LOCALSTORAGE ------------------------------------------------------------------------------------------------------------------------------------------------------------------
      // Si le localStorage existe, on récupère son contenu, on l'insère dans le tableau arrayProductsInCart 
      if (localStorage.getItem("products") !== null) {
        arrayProductsInCart = JSON.parse(localStorage.getItem("products"));

        // On vérifie si notre produit figure déjà dans le local storage grâce à la méthode findIndex --------------------------------------------------------------------------------------------
        function add(product) {
          const idx = arrayProductsInCart.findIndex(
            (elem) => elem.id === product.id
          );
          // Si le produit n'est pas dans le localStorage, on ajoute donc la quantité souhaitée par l'utilisateur -----------------------------------------------------------------------------------
          if (idx === -1) {
            arrayProductsInCart.push(product);
          } 
          
          // Si le produit est déjà présent dans le localStorage, on additionne la quantité souhaitée par l'utilisateur à la quantité déjà présente -----------------------------------------------------------------------------------------------------------
          else {
            arrayProductsInCart[idx].quantity += product.quantity;
          }
        }

        add(productAdded);

        // On renvoie donc le tableau arrayProductsInCart actualisé pour mettre à jour le localStorage -----------------------------------------------------------------------------------------------------------
        localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
      }

      // Si LocalStorage est vide, on crée le tableau ArrayProductsInCart, on ajout le produit et on le renvoit vers le LocalStorage avec le produit ajouté ----------------------------------------------------------------------------------------------------------------------------------
      else {
        arrayProductsInCart = [];
        arrayProductsInCart.push(productAdded);
        localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
      }

      // Effets visuels de confirmation de l'ajout d'un article avec un message popup de couleur verte ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      confirmation.style.visibility = "visible";
      textConfirmation.innerHTML = `${bearNumber.value} articles ajouté(s) !`;
      setTimeout("location.reload(true);", 2000);
    } 
    
    // Si la quantité n'est pas comprise entre 0 et 99 on affiche un message d'erreur de couleur rouge ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    else {
      confirmation.style.visibility = "visible";
      textConfirmation.style.background = "red";
      textConfirmation.style.border = "red";
      textConfirmation.style.color = "white";
      textConfirmation.style.whiteSpace = "normal";
      textConfirmation.innerText = `La quantité doit être comprise entre 1 et 99,.`;
    }
  });
}
