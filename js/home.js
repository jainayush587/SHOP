//variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-btn");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".checkout_items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
let productsDOM = document.querySelector(".product-grid");


// cart
let cart = [];

//buttons
let buttonsDOM = [];

//getting the product_slider

class Products {
  async getProducts(){
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      let products = data.items;
      products = products.map(item =>{
        const {title,price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, id, image}
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//display product
class UI {
  displayProducts(products){
    let result = "";
    products.forEach(product => {
      result +=`
      <div class="product-item men">
        <div class="product discount product_filter">
          <div class="product_image">
            <img src=${product.image} alt="product">
          </div>
          <div class="favorite favorite_left"></div>
          <div class="product_bubble product_bubble_right product_bubble_red d-flex flex-column align-items-center"><span>20%</span></div>
          <div class="product_info">
            <h6 class="product_name"><a href="single.html">${product.title}</a></h6>
            <div class="product_price">Rs${product.price}</div>
          </div>
        </div>
        <button type="button" class="shop-btn add_to_cart_button" data-id=${product.id}><i class="fa fa-shopping-cart">add to cart</i></button>
      </div>
      `;
    });

    productsDOM.innerHTML = result;
    productsDOM = new Isotope( '.product-grid', {
    itemSelector: '.product-item',
    layoutMode: 'fitRows'
  });
}
  getBagButtons(){
    const buttons =[...document.querySelectorAll(".add_to_cart_button")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if(inCart){
        button.innerText = "In Cart";
        button.disabled = true ;
      }

        button.addEventListener('click',(event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          //get product from products
          let cartItem = {...Storage.getProduct(id),amount:1};
          // add product to the cart
          cart = [...cart,cartItem];
          //save cart in local Storage
          Storage.saveCart(cart);
          // set cart values
          this.setCartValues(cart);
          // add cart items/ display
          this.addCartItem(cartItem);
          // show the cart
          this.showCart();
        });

    });

  }
  setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item =>{
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    if (itemsTotal) cartItems.innerText = itemsTotal ;
    console.log(cartTotal,cartItems);
  }
  addCartItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<img src=${item.image} alt="product">
    <div>
      <h4>${item.title}</h4>
      <h5>Rs${item.price}</h5>
      <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fa fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fa fa-chevron-down" data-id=${item.id}></i>
    </div>
    `;
    cartContent.appendChild(div);

  }
  showCart(){
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  populateCart(cart){
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart(){
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  setupAPP(){
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click',this.showCart);
    closeCartBtn.addEventListener('click',this.hideCart);
  }
  cartLogic(){
    //clear cart button
    clearCartBtn.addEventListener("click", ()=>{
      this.clearCart();
    });
    //cart functionality
    cartContent.addEventListener("click",event=>{
      if(event.target.classList.contains("remove-item")){
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      }
      else if (event.target.classList.contains ("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      }
      else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0){
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount ;
        }
        else{
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart(){
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while (cartContent.children.lenght>0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id){
    cart = cart.filter(item => item.id !==id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart">add to bag</i>`;
  }
  getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

//Local storage
class Storage{
  static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products));
  }
  static getProduct(id){
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart(){
    return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
  }

}


document.addEventListener("DOMContentLoaded", () => {
const ui = new UI();
const products = new Products();
//setup app
ui.setupAPP();
// get all products
products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(()=>{
    ui.getBagButtons();
    ui.cartLogic();
  });
});
