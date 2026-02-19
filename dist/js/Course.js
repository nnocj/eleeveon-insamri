import { getParam, loadHeaderFooter } from "./utils.mjs";
import CourseDetails from "./CourseDetails.mjs";
import { showSpinner } from "./Animations.mjs";

// =========================
// Load header and footer
// =========================
loadHeaderFooter();

// =========================
// Get course info from URL
// =========================
const courseId = getParam("course");   // numeric or string ID

// =========================
// Initialize data source and course
// =========================
const dataSource = "https://www.themealdb.com/api/json/v1/1/search.php?f=a";
const courseDetails = new CourseDetails(courseId, dataSource);

// =========================
// Initialize course page
// =========================
courseDetails.init();
showSpinner();// in this way when the form is subiting it will display.
