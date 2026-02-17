/**This file is to be placed in the checkout/index.html page
 * 1. its to ensure that alll calculation functions needed to render order summary is obtained
 * 2 Send data to server.
 */

import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";


loadHeaderFooter();

//listing the parameters to run the checkout process class.
const key = "so-cart"
const outputElement = "#order-summary"; //to display the order summary
const formElement = document.getElementById("checkoutForm"); // to pick up form data

//I'm ensuring product summary details can be obtained.
const checkoutProcess = new CheckoutProcess(key, outputElement, formElement);
checkoutProcess.init();