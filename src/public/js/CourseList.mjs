/**
 * CourseList renders courses from a data source (meals API style)
 * Each card shows thumbnail, title, and links to course detail page
 */
import { renderListWithTemplate, getData } from "./utils.mjs";

export default class CourseList {
  /**
   * @param {object} dataSource - Object with getData() method returning array of courses
   * @param {HTMLElement} listElement - container for course list
   */
  constructor(dataSource, listElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.allCourses = [];
  }

  async init() {
    try {
      const courses = await getData(this.dataSource);
      this.allCourses = courses;
      this.renderCourses(courses);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  }

  renderCourses(courses) {
    if (courses.length === 0) {
      this.listElement.innerHTML = "<p>No courses found.</p>";//that is if no courses match the category filter
      return;
    }
    const template = (course) => {
      const courseId = course.idMeal;
      const title = course.strMeal;
      const thumbnail = course.strMealThumb || "";
      const description = course.strInstructions ? course.strInstructions.substring(0, 100) + "..." : "";
      const category = course.strCategory || "";

      return `
        <li class="course-card">
          <a href="/course_pages/course.html?course=${courseId}">
            <img src="${thumbnail}" alt="Thumbnail of ${title}">
            <h2 class="card__title">${title}</h2>
            <p class="course-card__description">${description}</p>
            ${category ? `<span class="course-card__category">${category}</span>` : ""}
          </a>
        </li>
      `;
    };

    renderListWithTemplate(template, this.listElement, courses, "afterbegin", true);
  }

  // 🔥 THIS function is called upon in the main via the initiated courselist
  filterByCategory(categoryName) {
    const filtered = this.allCourses.filter(
      (course) =>
        course.strCategory.toLowerCase() === categoryName.toLowerCase()
    );

    this.renderCourses(filtered);
  }
}

