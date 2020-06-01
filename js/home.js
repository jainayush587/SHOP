//variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-btn");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".checkout_items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".product-grid");

// cart
let cart = [];


//getting the product_slider

class Products {
  async getProducts(){
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

//display product
class UI {
  constructor() {

  }
}

//local Storage
class Storage {
  constructor() {

  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new UI();
  const products = new Products();

//get all products
products.getProducts().then(data => console.log(data));
})
