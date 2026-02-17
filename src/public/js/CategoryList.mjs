/**I believe that naming is very important. In this case I belive strongly that the name should have
 * been category list because the class is respoonsible for rendering a list of categories.
 * I will reference this in my insamri app of this course.
 */
import { renderListWithTemplate } from "./utils.mjs";

export default class  CategoryList {


    constructor(category, dataSource, listElement) {
    this.category = category;
    this.product = {};
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
      // use the datasource to get the list of categories from the json/category. 
      const list = await this.dataSource.getData();
      console.log("category info", this.category);

      // render category list
      this.renderList(list);
  
    }
  


    renderList(list){
        renderListWithTemplate(categoryNavTemplate, this.listElement, list);
    }
}

//productcard template
function categoryNavTemplate(category) {
    const categoryName = category.Name.toLowerCase();
 
    return `<li class="category-nav-item">
                <a href="#" class="${categoryName}">${categoryName}
                    <img src="${category.Image}" alt="Image of ${category.Name}" width="50">
                </a>
            </li>`
        } //category_pages?category=${category.Id}
  
 
