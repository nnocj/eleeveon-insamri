import { getLocalStorage, prepareMedia, setLocalStorage } from "./utils.mjs";

export default class CourseDetails {
  constructor(courseId, dataSource) {
    this.courseId = courseId;
    this.dataSource = dataSource; // external API URL
    this.course = {};
  }

  async convertToJson(res) {
    if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
    return res.json();
  }

  async findCourseById(id) {
    try {
      const courses = await fetch(this.dataSource)
        .then(this.convertToJson.bind(this))
        .then((data) => (data.meals ? data.meals : data));

      const course = courses.find((item) => item.idMeal === id);
      if (!course) throw new Error(`Course with ID "${id}" not found.`);

      return course;
    } catch (error) {
      console.error("Error fetching course:", error);
      alert("Failed to load course data. Please try again later.");
      return null;
    }
  }

  async init() {
    this.course = await this.findCourseById(this.courseId);
    if (!this.course) return;

    this.renderCourseDetails();

    const downloadBtn = document.getElementById("downloadCourseBtn");
    if (downloadBtn) downloadBtn.addEventListener("click", () => this.downloadCourse(this.course));

    const form = document.getElementById("assignmentForm");
    if (form) form.addEventListener("submit", this.submitAssignment.bind(this));
  }

  // ============================
// Downloads a course locally
// ============================
// ============================
// Downloads the current course locally
// ============================
async downloadCourse() {
  const savedCourses = getLocalStorage("ins-course") || [];

  // Use this.course directly
  const course = this.course;

  if (!course) {
    alert("No course loaded to download.");
    return;
  }

  if (savedCourses.some((c) => c.id === course.idMeal)) {
    alert("You have already downloaded this course.");
    return;
  }

  const courseData = {
    id: course.idMeal,
    title: course.strMeal,
    thumbnail: course.strMealThumb || "",
    description: course.strInstructions || "",
    downloadedAt: new Date().toISOString(),
    video: course.strYoutube || "", // URL backup
    fileContent: "",
    fileType: "",
  };

  try {
    // Only convert media if a URL exists
    if (course.strYoutube) {
      const { base64, fileType } = await prepareMedia(course.strYoutube);
      courseData.fileContent = base64 || ""; // Base64 string for offline playback
      courseData.fileType = fileType || "";
    }
  } catch (error) {
    console.error("Error converting media:", error);
    alert("Failed to convert media for offline use. The URL will be saved as backup.");
  }

  savedCourses.push(courseData);
  setLocalStorage("ins-course", savedCourses);
  alert("Course downloaded locally for offline use!");
}


 getServerPayload() {
  return new Promise((resolve, reject) => {
    const fullName = document.getElementById("fullName")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const assignmentFile = document.getElementById("assignmentFile")?.files[0];

    if (!fullName || !email || !assignmentFile) {
      reject("Please fill all fields and attach your assignment.");
      return;
    }

    // ✅ File size limit (25MB recommended for base64 JSON)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (assignmentFile.size > MAX_SIZE) {
      reject("File too large. Maximum allowed size is 25MB.");
      return;
    }

    // ✅ Allowed types
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "video/mp4",
      "video/webm",
      "video/quicktime"
    ];

    if (!allowedTypes.includes(assignmentFile.type)) {
      reject("Unsupported file type. Upload Word, audio, or video files only.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result; // Data URL (base64)

      const payload = {
        title: `${fullName} ${this.course.strMeal} Assignment`,
        folder: `${this.course.strMeal}-assignments`,
        owner: "Eleeveon Insamri",
        secret_passkey: "mySuperSecret123",
        data: {
          fullName,
          email,
          courseId: this.course.idMeal,
          fileName: assignmentFile.name,
          fileType: assignmentFile.type,
          fileSize: assignmentFile.size,
          uploadedAt: new Date().toISOString(),
          fileContent: base64Data
        }
      };

      resolve(payload);
    };

    reader.onerror = (err) => reject("Error reading file.");

    // 🔥 Must use DataURL for binary files
    reader.readAsDataURL(assignmentFile);
  });
}

  async submitAssignment(e) {
    e.preventDefault();

    try {
      const payload = await this.getServerPayload();
      if (!payload) return;

      const response = await fetch("https://json-hub-api.onrender.com/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Assignment submitted successfully!");
        document.getElementById("assignmentForm").reset();
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert(error || "Error submitting assignment. Check your network and try again.");
    }
  }

  renderCourseDetails() {
    if (!this.course) return;
    courseDetailsTemplate(this.course);
  }
}

// =============================================================================================
// Template Renderer Meals. Since its youtube which is a URL, i'm using iframe to play youtube
// ===========================================================================================
function courseDetailsTemplate(course) {
  // Title
  const titleEl = document.querySelector("h2");
  if (titleEl) titleEl.textContent = course.strMeal;

  // Description
  const descEl = document.querySelector(".course-description p");
  if (descEl) descEl.textContent = course.strInstructions || "";

  // Video as embedded YouTube
  const videoContainer = document.getElementById("courseVideoContainer"); // wrap iframe in a div
  if (videoContainer && course.strYoutube) {
    const videoId = course.strYoutube.split("v=")[1]?.split("&")[0]; // extract video ID
    videoContainer.innerHTML = `
      <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/${videoId}" 
        title="${course.strMeal}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  }

  // Optional thumbnail for visual fallback
  const thumbEl = document.getElementById("courseThumbnail");
  if (thumbEl && course.strMealThumb) {
    thumbEl.src = course.strMealThumb;
    thumbEl.alt = `Thumbnail of ${course.strMeal}`;
  }
}
