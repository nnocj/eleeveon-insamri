import { getLocalStorage,loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// Utility: Get query param
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Render downloaded course details
function renderCourse(course) {
  if (!course) return;

  // Set course title
  const titleEl = document.querySelector("h2");
  if (titleEl) titleEl.textContent = course.title;

  // Set course description
  const descEl = document.querySelector(".course-description p");
  if (descEl) descEl.textContent = course.description || "";

  // Render media (video/audio)
  const mediaContainer = document.getElementById("courseVideoContainer");
  if (!mediaContainer) return;

  if (course.fileContent && course.fileType) {
    if (course.fileType.startsWith("video")) {
      mediaContainer.innerHTML = `
        <video controls width="100%">
          <source src="${course.fileContent}" type="${course.fileType}" />
          Your browser does not support the video tag.
        </video>
      `;
    } else if (course.fileType.startsWith("audio")) {
      mediaContainer.innerHTML = `
        <audio controls>
          <source src="${course.fileContent}" type="${course.fileType}" />
          Your browser does not support the audio tag.
        </audio>
      `;
    }
  } else if (course.video) {
    // fallback to YouTube URL
    // extract video ID from URL
    const videoId = course.video.split("v=")[1]?.split("&")[0];
    if (videoId) {
      mediaContainer.innerHTML = `
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/${videoId}" 
          title="${course.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      // If URL format is unknown, show as link
      mediaContainer.innerHTML = `<a href="${course.video}" target="_blank">Watch Video Online</a>`;
    }
  }

  // Optional thumbnail for visual fallback
  const thumbEl = document.getElementById("courseThumbnail");
  if (thumbEl && course.thumbnail) {
    thumbEl.src = course.thumbnail;
    thumbEl.alt = `Thumbnail of ${course.title}`;
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  const courseId = getQueryParam("course");
  if (!courseId) {
    alert("No course specified.");
    return;
  }

  // Load saved courses from local storage
  const savedCourses = getLocalStorage("ins-course") || [];
  const course = savedCourses.find(c => c.id === courseId);

  if (!course) {
    alert("Course not found in your downloads.");
    return;
  }

  renderCourse(course);
});
