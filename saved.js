document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const heading = document.querySelector(".intro h2");

  let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

  // Clear any static placeholder cards from HTML
  grid.innerHTML = "";

  if (savedRecipes.length === 0) {
    heading.textContent = "Oops! Looks like you haven't saved any recipes yet!";
    return;
  }

  savedRecipes.forEach((recipe) => {
    if (!recipe.title || !recipe.image) return; // skip broken entries

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-img" style="background-image:url('${recipe.image}');">
        <div class="card-overlay"></div>
        <button class="fav-btn"><span class="material-symbols-outlined">favorite</span></button>
      </div>
      <div class="card-body">
        <h1>${recipe.title}</h1>
      </div>
    `;

    grid.appendChild(card);
  });
});
