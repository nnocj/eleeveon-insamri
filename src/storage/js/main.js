/**Name of App: Sleep Outside E-commerce Web Application that allows users to browse and purchase outdoor products 
 * such as tents, sleeping bags, and camping gear.
 * Author: Nicholas Oblitey Commey
 * Date: 13th Febrary, 2026
 * 
 * Special Features or Lessons:
 * 1. Users search product from different api sources
 * 2. These sources are labeled with different custom category  by me the app developer based on source
 * 3. When the classes are initialized, they fetch data from the source and render the on the main page with the product id and category copies to its link;s href.
 * 4. When a user clicks on a product, the app uses the product id and category info on the href of the link to fetch the product details from the source and render it in the product details page.
 * 5. Users can add products to cart irrespective of category and the cart data is stored in local storage.
 * 
 * Other applications where I can apply some concepts from this project:
 * 1. I can apply the concept of fetching data from different sources and rendering it on the page in my future projects that require data from different sources.
 * 2. I can also apply the concept of using query parameters to fetch specific data and render it on the page in my future projects that require dynamic rendering based on user interaction.
 * 3. I can also apply the concept of using local storage to store user data such as cart items in my future projects that require user data persistence.
 * 4. I can also apply the concept of using classes to organize my code and make it more modular and reusable in my future projects.
 *
 * Related Projects:
 * 1. School management app that allows users to manage student information, courses, and grades. 
 * When build properly can use only one file accross all pages which will be the main.js file or the program.js file.
 * 2. Insamri app that allows users to search for courses and learn lessons under them.
 * 3. Frontend and backend utilities for my school management app and insamri app. These utilities will include functions for fetching data from the server, rendering data on the page, and handling user interactions.

*/

import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import CategoryData from "./CategoryData.mjs";
import CategoryList from "./CategoryList.mjs";
import { loadHeaderFooter} from "./utils.mjs";

loadHeaderFooter();

//category section to display the list of navs
const categoryListElement = document.querySelector('.category-list');
const categoryDataSource = new CategoryData("category");
const categoryList = new CategoryList("category", categoryDataSource, categoryListElement);
categoryList.init();

//product section
const listElement = document.querySelector('.product-list');

//setting the tents category as the default category to load when the page is first loaded
const defaultCategory = "tents";
const dataSource = new ProductData(defaultCategory);
const productList = new ProductList(dataSource, listElement);
productList.init();

/**Loading products dynamically based on clicked or selected category.
 * Also ensuring that the previous data is cleared before loading new data. This is to avoid data stacking and confusion.
 * Aside from that I make sure that each product get a category name based on the category name in the nav. This is to ensure that the correct data is loaded for each category. I also make sure to use the category name as the key to fetch data from the json file. This is to ensure that the correct data is loaded for each category.
 * Finally I ensure to clear previous data fron the list container to avoid data adding to previous data causing confusion
 */
categoryListElement.addEventListener("click", (e) => {// the category list element is already defined
    
    //first lets clear the previous data before moving to a new one.
    listElement.innerHTML= "";
    
    const link = e.target.closest("a");

    if (!link) return; // clicked something else

    e.preventDefault();

    const category = link.textContent.trim().toLowerCase();

    const dataSource = new ProductData(category);// because of this i dont think i need to repase category into product list
    
    const productList = new ProductList( dataSource, listElement);

    productList.init();

    
});




