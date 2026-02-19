//this is to give feedback on a page that is performaing and action within it like posting assigments etc.
export function showSpinner() {
const form = document.getElementById("assignmentForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector("button");
  submitBtn.disabled = true;

  // Show spinner
  const spinner = document.createElement("span");
  spinner.className = "spinner";
  submitBtn.appendChild(spinner);

  // Simulate upload / fetch
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Remove spinner & re-enable button
  spinner.remove();
  submitBtn.disabled = false;

  alert("Assignment submitted!");
});

}

// this is to hold my course list in place before everything is loaded, to avoid layout shift and give a better user experiene.
export function showSkeletonCards(container, count = 6) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const li = document.createElement("li");
    li.className = "course-card skeleton";
    li.innerHTML = `
      <div class="skeleton-thumbnail"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text"></div>
    `;
    container.appendChild(li);
  }
}
