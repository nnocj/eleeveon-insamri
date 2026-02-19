/**
 * ============================================
 * MAIN ENTRY FILE
 * ============================================
 * Responsibilities:
 * 1. Load header and footer
 * 2. Initialize CourseList (meals)
 * 3. Initialize CategoryList (unique categories)
 * 4. Handle search input (dynamic data source)
 * 5. Show skeleton loader during fetch
 * 
 * Architecture Concept:
 * - CourseList fetches once and stores data internally.
 * - CategoryList also refetches
 * - Category click filters already-loaded data.
 * - Search replaces the dataSource and reloads CourseList and CategoryList.
 * - This way we minimize API calls while keeping UI responsive.
 * -My app is designed to use two API's to search for course.
 * One searches by name and the other by first letter.
 */

import CourseList from "./CourseList.mjs";
import CategoryList from "./CategoryList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { showSkeletonCards } from "./Animations.mjs";

// ------------------------------------------
// Load shared layout
// ------------------------------------------
loadHeaderFooter();

// ------------------------------------------
// Default Data Source
// Loads meals starting with letter "a"
// ------------------------------------------
let dataSource =
  "https://www.themealdb.com/api/json/v1/1/search.php?f=a";

// ------------------------------------------
// DOM Elements
// ------------------------------------------
const categoryListElement = document.querySelector(".category-list");
const courseListElement = document.querySelector(".course-list");
const searchInput = document.getElementById("searchInput");

// ------------------------------------------
// Create CourseList instance
// This handles fetching + rendering meals
// ------------------------------------------
let courseList = new CourseList(dataSource, courseListElement);

// ------------------------------------------
// Create CategoryList instance
// We pass a callback so categories can filter
// the already-loaded course data (no refetch)
// ------------------------------------------
let categoryList = new CategoryList(
  dataSource,
  categoryListElement,
  (selectedCategory) => {
    // Filter already-loaded courses
    courseList.filterByCategory(selectedCategory);
  }
);

// ------------------------------------------
// SEARCH FUNCTIONALITY
// When user presses Enter:
// 1. Update dataSource to search by full name (?s=)
// 2. Recreate CourseList with new data source
// 3. Show skeleton loader
// 4. Re-fetch and render results
// ------------------------------------------
if (searchInput) {
  searchInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const searchTerm = searchInput.value.trim();
      if (!searchTerm) return;

      // Change API endpoint to search by name
      dataSource =
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

      // Show skeleton loading animation
      showSkeletonCards(courseListElement, 24);

      // Recreate CourseList and categories with new data source
      courseList = new CourseList(dataSource, courseListElement);
      categoryList = new CategoryList(dataSource, categoryListElement, (selectedCategory) => {
        courseList.filterByCategory(selectedCategory);
      });
      // Fetch and render search results
      await courseList.init();
      await categoryList.init();
    }
  });
}

// ------------------------------------------
// Initialize App
// 1. Show skeleton loader
// 2. Load courses
// 3. Load categories
// ------------------------------------------
async function initApp() {
  showSkeletonCards(courseListElement, 24);

  await courseList.init();
  await categoryList.init();
}

initApp();
