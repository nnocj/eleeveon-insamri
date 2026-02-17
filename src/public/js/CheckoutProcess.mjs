/** Now I will leave it here with the thugh that this course focused on web frontend seperate from backend
 * So it will appreciate using a web service or external backend to handle it's data. 
 * This was mainly to learn how to apply OOP to build utilities.
 * For now the for form data wont be sent. So i will create a message for the user using a try ccatch.
 */

import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector, formElement) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.formElement = formElement;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {//this looks exactly like the way the school management app of CSE240 ETC. ONE BOARD
    this.list = getLocalStorage(this.key) || [];
    this.displayOrderSummary(this.outputSelector);
    this.checkout();
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
    if (!container) return;

    const orderSummaryTemplate = `
                <h2>Order Summary</h2>
                <p id="subtotal">SubTotal: $${this.calculateSubTotal().toFixed(2)}</p>
                <p id="taxtotal">Total Tax: $${this.calculateTotalTax().toFixed(2)}</p>
                <p id="shippingtotal">Shipping Cost: $${this.calculateShippingTotal().toFixed(2)}</p>
                <p id="ordertotal">Order Total: $${this.calculateOrderTotal().toFixed(2)}</p>
                `;
        
    container.innerHTML = orderSummaryTemplate;
}


//this will only display the only needed infos from each cart item
packageCartItems() {
    const cartItems = getLocalStorage(this.key) || [];

    return cartItems.map(item => ({
        id: item.Id,
        name: item.Name,
        price: parseFloat(item.FinalPrice) || 0,
        quantity: 1
    }));//here ii dont need string literal but direct reference and assignments
}


packageOrderSummary(){
    const taxTotal = this.calculateTotalTax();
    const shippingTotal = this.calculateShippingTotal();
    const orderTotal = this.calculateOrderTotal();

    // order summary to match the wdd330 server
    
    return  { 
            orderTotal: orderTotal,
            shipping: shippingTotal,
            tax: taxTotal
        }
}


// function to package the customer details from the form to match the wdd330 server request. This will be about the form 
packageCustomerDetails(){
    //get the Json formated form data
    const customerData = this.formDataToJSON(this.formElement);
    const currentDate = new Date();//to track the current date

    //adding other details to the customer info to match the wdd330 sever expectation
    return {
        orderDate: currentDate,
        fname: customerData.firstName,
        lname: customerData.lastName,
        street: customerData.street,
        city: customerData.city,
        state: customerData.state,
        zip: customerData.zip,
        cardNumber: "1234123412341234",
        expiration: customerData.expDate,
        code: "123"
    }
                    //I'm making card number and code fixed to match with the wdd330 api
}

// new get full order json
getFullOrderData(){
    //get packaged customer details and add the remaining info to it
    const customerData = this.packageCustomerDetails();

    //the remaining info to add to the customer data to become the full order data
    const cartItems = this.packageCartItems();
    const taxTotal = this.calculateTotalTax();
    const shippingTotal = this.calculateShippingTotal();
    const orderTotal = this.calculateOrderTotal();

    customerData["items"] = cartItems;
    customerData["orderTotal"] = orderTotal;
    customerData["shipping"] = shippingTotal;
    customerData["tax"] = taxTotal;

    return customerData; // ✅ THIS WAS MISSING
}

getServerStyleOrderData(){
    const customerData = this.formDataToJSON(this.formElement);
    const time = new Date().getTime();
    const serverStyleData =  {
        title: `${customerData.firstName} ${customerData.lastName} order at ${time}`,
        folder: "Food Orders",
        owner: "Nicholas",
        secret_passkey: "mySuperSecret123",
        data: this.getFullOrderData()
            
        }
    return serverStyleData;
}

//function to send full order details to server
getServerStyleOrderJson(){
    //get the raw order data
    const orderData = this.getServerStyleOrderData();// this is raw data
   console.log("raw data", orderData);

   const jsonData = this.orderServerStyleDataToJson(orderData); console.log("jsonData", jsonData);
    return jsonData// I will return the full order json containing both items and customer details
}


orderServerStyleDataToJson(orderData){//here it will only serve as a tool.
    return JSON.stringify(orderData);
}

orderDataToJson(orderData){//here it will only serve as a tool.
    return JSON.stringify(orderData);
}


// takes a form element and returns an object where the key is the "name" of the form input.
formDataToJSON(formElement) {
  const formData = new FormData(formElement),//this formData is an inbuilt JavaScript function to get form data
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;//this is to create and array of each key to a value
  });

  return convertedJSON;
}


async handleSubmit() {// async because it handles fetching
    //when the user click to submit
    //1. get the order
    const order = this.getServerStyleOrderData();
    
    //2. send the order to the wdd330 server
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order)
    };

    try {
        const response = await fetch("https://json-hub-api.onrender.com/api/documents", options);

        if (!response.ok) {
            throw new Error("Server error");
        }

        this.redirectToSuccess()// to go to another page entirely

        console.log(`Order data: ${order}\nServer Response: ${response}`);

        alert("Order placed successfully!");

    } catch (error) {
        console.error("Submission failed:", error);
        alert("Something went wrong. Try again.");
    }

  //ensure response to button click to check out
}

redirectToSuccess() {//this is to redirect my page to checkout/index.html
  window.location.href = "../checkout/success.html";
}

checkout() {
  this.formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    this.handleSubmit();

  });// later i can create te validation rule
}

}
