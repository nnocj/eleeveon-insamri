import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

//to ensure that the header and footer is present even in the cart
loadHeaderFooter();


function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  // a new list containing only prices of the items
  const prices = cartItems.map(item => item.FinalPrice || 0);

  //calculating for the total cart and inserting in cart html
  let totalPrice = 0;
  const totalPriceElement = document.querySelector("#totalprice");
  prices.forEach(price => {totalPrice +=price})
  totalPriceElement.textContent = `Total: $${totalPrice}`;

  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const productImage = item.Images ? item.Images.PrimaryMedium : item.Image; // use PrimaryMedium if available, otherwise use Image

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${productImage}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function redirectToCheckout() {//this is to redirect my page to checkout/index.html
  window.location.href = "../checkout/index.html";
}


renderCartContents();

document.querySelector("#checkout").addEventListener("click", redirectToCheckout);//ensure response to button click to check out