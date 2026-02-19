import { renderListWithTemplate, getData } from "./utils.mjs";

export default class CategoryList {
  constructor(dataSource, categoryListElement, onCategoryClick) {
    this.dataSource = dataSource;
    this.categoryListElement = categoryListElement;
    this.onCategoryClick = onCategoryClick;
  }

  async init() {
    try {
      const meals = await getData(this.dataSource);

      const categoriesMap = new Map();

      meals.forEach((meal) => {
        const key = meal.strCategory?.toLowerCase();
        if (key && !categoriesMap.has(key)) {
          categoriesMap.set(key, {
            name: meal.strCategory,
            thumb: meal.strMealThumb,
          });
        }
      });

      const uniqueCategories = Array.from(categoriesMap.values())
        .sort((a, b) => a.name.localeCompare(b.name));

      this.renderList(uniqueCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  renderList(categories) {
    const template = (category) => `
      <li class="category-nav-item">
        <a href="#" 
           class="category-link" 
           data-category="${category.name.toLowerCase()}">
          ${category.name}
          ${
            category.thumb
              ? `<img src="${category.thumb}" 
                      alt="Image of ${category.name}" 
                      width="50">`
              : ""
          }
        </a>
      </li>
    `;

    renderListWithTemplate(
      template,
      this.categoryListElement,  // ✅ FIXED
      categories,
      "afterbegin",
      true
    );

    // Attach click listeners AFTER rendering
    this.categoryListElement
      .querySelectorAll(".category-link")
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();

          const selectedCategory = link.dataset.category;

          if (this.onCategoryClick) {
            this.onCategoryClick(selectedCategory);
          }
        });
      });
  }
}
