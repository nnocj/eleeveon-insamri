import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Render downloaded courses from local storage
function renderDownloadedCourses() {
  const savedCourses = getLocalStorage("ins-course") || [];
  const container = document.getElementById("downloadedCourses");

  if (!container) return;

  container.innerHTML = "";

  if (savedCourses.length === 0) {
    container.innerHTML = "<p>No courses downloaded yet.</p>";
    return;
  }

  const courseTemplate = (course) => {
    const title = course.title;
    const thumbnail = course.thumbnail || "/images/default-course.png";
    const description = course.description
      ? course.description.substring(0, 100) + "..."
      : "";
    const downloadedAt = new Date(course.downloadedAt).toLocaleString();

    // Determine media HTML
    let mediaHTML = "";
    if (course.fileContent) {
      if (course.fileType.startsWith("video")) {
        mediaHTML = `
          <video controls width="100%">
            <source src="${course.fileContent}" type="${course.fileType}">
            Your browser does not support the video tag.
          </video>
        `;
      } else if (course.fileType.startsWith("audio")) {
        mediaHTML = `
          <audio controls>
            <source src="${course.fileContent}" type="${course.fileType}">
            Your browser does not support the audio tag.
          </audio>
        `;
      }
    } else if (course.video) {
      mediaHTML = `<a href="${course.video}" target="_blank">Watch Video Online</a>`;
    }

    // Build clickable card linking to downloads/course_details.html
    const url = `./download_details.html?course=${encodeURIComponent(
      course.id
    )}&title=${encodeURIComponent(title)}`;

    return `
      <li class="course-card">
        <a href="${url}">
          <div class="course-thumbnail">
            <img src="${thumbnail}" alt="Thumbnail of ${title}">
          </div>
          <div class="course-info">
            <h2 class="card__title">${title}</h2>
            <p class="course-card__description">${description}</p>
            ${mediaHTML}
            <p><small>Downloaded: ${downloadedAt}</small></p>
          </div>
        </a>
      </li>
    `;
  };

  // Render all courses
  savedCourses.forEach((course) => {
    container.insertAdjacentHTML("beforeend", courseTemplate(course));
  });
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", renderDownloadedCourses);
