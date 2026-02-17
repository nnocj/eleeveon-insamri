/**This file specializes in rendering the product list of each categor when the category link is clicked. For 
 * For me this knowlegde helps alot when building apps that uses data from various api sources based on user search.
 * Especially in a situation where we create our own cateory of the data based on sources etc.
 */

import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {
  constructor(dataSource, listElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.category = dataSource.category; // comes from the data source
  }

  async init() {
    try {
      const products = await this.dataSource.getData();
      this.renderProductList(products);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  renderProductList(products) {//this is for the list of data.
    //template is for the individual product card
    //I hav attached the category to help me later get product details.
    const template = (product) => `
      <li class="product-card">
        <a href="product_pages/?category=${this.category}&product=${product.Id}">
          <img 
            src="${product.Images?.PrimaryMedium || product.Image}" 
            alt="Image of ${product.NameWithoutBrand}">
          <h2 class="card__brand">${product.Brand.Name}</h2>
          <h3 class="card__name">${product.NameWithoutBrand}</h3>
          <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
      </li>
    `;
    /**what i learn here is that the renderList with.. funtion knows to make each item frm list accepting parameter of product */
    renderListWithTemplate(template, this.listElement, products, "afterbegin", true);
  }
}
