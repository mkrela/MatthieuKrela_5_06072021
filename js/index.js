main();

function main() {
  getArticles();
}
// Récupérer les articles depuis l'API via la méthode FETCH ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getArticles() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (res) {
      return res.json();
    })

    // En cas de problème on dispose un message d'erreur à l'utilisateur ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
    .catch((error) => {
      let productsContainer = document.querySelector(".products-container");
      productsContainer.innerHTML = "Le back-end semble ne pas fonctionner";
      productsContainer.style.textAlign = "center";
      productsContainer.style.padding = "40vh 0";
    })

    //   Disposition des données relatives aux articles dans le DOM ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    .then(function displayInfo(resultatAPI) {
      const articles = resultatAPI;

      // On boucle : pour chaque produit que le backend nous envoit, une 'carte' va se créer dynamiquement, contenant les infos dudit produit ---------------------------------------------------------------------------------------------------
      for (let article in articles) {
        let productCard = document.createElement("div");
        document.querySelector(".products").appendChild(productCard);
        productCard.classList.add("product");
        console.log(productCard)
        //  On crée un lien pour chaque produit qui renvoit vers la page de celui en lui passant son ID ------------------------------------------------------------------------------------------------------------------------------------------
        let productLink = document.createElement("a");
        productCard.appendChild(productLink);
        productLink.href = `product.html?id=${resultatAPI[article]._id}`;
        // productLink.classList.add("stretched-link");

        // On lui insère associe son image correspondante -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        let productImgDiv = document.createElement("div");
        productLink.appendChild(productImgDiv);
        productImgDiv.classList.add("product__img");

        let productImg = document.createElement("img");
        productImgDiv.appendChild(productImg);
        productImg.src = resultatAPI[article].imageUrl;

        // On lui associe les informations correspondantes telles que les options disponibles (couleurs différentes) -----------------------------------------------------------------------------------------------------------------------------
        let productInfosDiv = document.createElement("div");
        productLink.appendChild(productInfosDiv);
        productInfosDiv.classList.add("product__infos");

        let productInfoTitle = document.createElement("div");
        productInfosDiv.appendChild(productInfoTitle);
        productInfoTitle.innerHTML = resultatAPI[article].name;

        // On lui associe le prix correspondant ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        let productInfoPrice = document.createElement("div");
        productInfosDiv.appendChild(productInfoPrice);
        productInfoPrice.classList.add("product__infos__price");

        // Formatage du prix pour l'afficher en euros ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        resultatAPI[article].price = resultatAPI[article].price / 100;
        productInfoPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(resultatAPI[article].price);
      }
    });
}
