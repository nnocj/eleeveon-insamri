import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.displayOrderSummary(this.outputSelector);
  }

//calculating for the items subtotal
calculateSubTotal() {
    //list of cart items
    const cartItems = getLocalStorage(this.key) || [];
  
    // a new list containing only prices of the items
    const prices = cartItems.map(item => parseFloat(item.FinalPrice) || 0);
  
    //calculating for the subtotal price of items in the cart.
    let totalPrice = 0;
    prices.forEach(price => { totalPrice += price });

    return totalPrice;
}

//calculating for the tax 
calculateTotalTax(){
    const subTotal = this.calculateSubTotal();
    const taxRate = 0.06;
    const totalTax =  subTotal * taxRate;

    return totalTax;
}

//calculating for shipping
calculateShippingTotal(){ // so here if the total sub is more than 100 dollars you dont pay for shipping
    const subTotal = this.calculateSubTotal();
    const shippingFare = subTotal > 100 ? 0 : 10;

    return shippingFare;
}

calculateOrderTotal() {
    const subTotal = this.calculateSubTotal();
    const taxTotal = this.calculateTotalTax();
    const shippingTotal = this.calculateShippingTotal();

    //here i calculate for the order total using the other functions
    const orderTotal = subTotal + taxTotal + shippingTotal;

    return orderTotal;
}

displayOrderSummary(outputSelector) {// its quite intersting how i just found a use for this.

    const container = document.querySelector(outputSelector);

    const orderSummaryTemplate = `
                <h2>Order Summary</h2>
                <p id="subtotal">SubTotal: $${this.calculateSubTotal().toFixed(2)}</p>
                <p id="taxtotal">Total Tax: $${this.calculateTotalTax().toFixed(2)}</p>
                <p id="shippingtotal">Shipping Cost: $${this.calculateShippingTotal().toFixed(2)}</p>
                <p id="ordertotal">Order Total: $${this.calculateOrderTotal().toFixed(2)}</p>
                `;
        
        container.innerHTML = orderSummaryTemplate;
    }
}

