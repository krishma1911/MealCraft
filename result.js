const apiKey = "0e928772cad24c2e979ecbcd9d128278";
const urlParams = new URLSearchParams(window.location.search);
const ingredients = urlParams.get("ingredients");

// Load user preferences from localStorage
const preferences = JSON.parse(localStorage.getItem("userPref")) || {};

if (ingredients) {
  fetchRecipes(ingredients);
}

// Fetch recipes from API
function fetchRecipes(ingredients) {
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
    ingredients
  )}&number=20&apiKey=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Filter recipes based on preferences
      const filtered = filterRecipesByPreferences(data);
      displayRecipes(filtered);
    })
    .catch((err) => {
      console.error("Error fetching recipes:", err);
      document.getElementById("recipesContainer").innerHTML =
        "<p>Failed to load recipes. Please try again.</p>";
    });
}

// Filter recipes based on user preferences
function filterRecipesByPreferences(recipes) {
  return recipes.filter((recipe) => {
    let match = true;

    // Example preference filters (adjust to your preference keys)
    if (preferences.maxMissingIngredients !== undefined) {
      if (recipe.missedIngredientCount > preferences.maxMissingIngredients)
        match = false;
    }
    if (preferences.minUsedIngredients !== undefined) {
      if (recipe.usedIngredientCount < preferences.minUsedIngredients)
        match = false;
    }

    // Add more preference filters here if needed

    return match;
  });
}

// Display recipes on page
function displayRecipes(recipes) {
  const container = document.getElementById("recipesContainer");
  container.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    container.innerHTML = "<p>No recipes match your preferences.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <div class="recipe-content">
        <h3>${recipe.title}</h3>
        <p>Made with: ${recipe.usedIngredients
          .map((ing) => ing.name)
          .join(", ")}</p>
        <div class="tags">
          <span class="tag green">${recipe.usedIngredientCount} Used</span>
          <span class="tag blue">${recipe.missedIngredientCount} Missing</span>
        </div>
        <div class="actions">
          <button class="view-btn" onclick="viewRecipe(${recipe.id})">View Recipe</button>
          <button class="save-btn">Save</button>
        </div>
      </div>
    `;
    container.appendChild(card);

    // Add save button listener
    const saveBtn = card.querySelector(".save-btn");
    saveBtn.addEventListener("click", () => saveRecipe(recipe));
  });
}

// Save recipe to localStorage and show toast
function saveRecipe(recipe) {
  let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

  // Avoid duplicates
  if (!savedRecipes.some((r) => r.id === recipe.id)) {
    savedRecipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    showToast(`${recipe.title} saved!`);
    
    // Update saved count on profile if exists
    const savedCountEl = document.getElementById("savedCount");
    if (savedCountEl) savedCountEl.textContent = savedRecipes.length;
  } else {
    showToast(`${recipe.title} is already saved`);
  }
}

// Toast notification
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Open recipe details page
function viewRecipe(id) {
  window.location.href = `recipe.html?id=${id}`;
}
