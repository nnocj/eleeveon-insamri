import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";


loadHeaderFooter();

//products details rendition
//get category from URL query string
const category = getParam("category");//it searches through the URL to get the category value.
//datasource
const dataSource = new ProductData(category);
/**check to see if category = tents  */
const productId = getParam("product");// this one returns only numeric value of id
//render product details
const productDetails = new ProductDetails(productId, dataSource);
//render
productDetails.init();

















