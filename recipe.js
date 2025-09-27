const apiKey = "0e928772cad24c2e979ecbcd9d128278";
// Get recipe id from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

if (recipeId) {
  fetchRecipeDetails(recipeId);
} else {
  document.querySelector(".recipe-container").innerHTML =
    "<p>No recipe selected.</p>";
}

// Fetch recipe details
function fetchRecipeDetails(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Recipe Data:", data);
      displayRecipe(data);
    })
    .catch((err) => {
      console.error("Error fetching recipe details:", err);
      document.querySelector(".recipe-container").innerHTML =
        "<p>Failed to load recipe. Please try again.</p>";
    });
}

// Display recipe details
function displayRecipe(recipe) {
  // Title + Image
  document.getElementById("recipeTitle").textContent = recipe.title;
  document.querySelector("#recipeImage img").src = recipe.image || "";
  document.querySelector("#recipeImage img").alt = recipe.title || "Recipe";

  // Servings + Time
  document.getElementById("recipeServings").textContent =
    recipe.servings || "N/A";
  document.getElementById("recipeTime").textContent =
    recipe.readyInMinutes || "N/A";
  document.getElementById("recipePrep").textContent =
    recipe.preparationMinutes || "N/A";
  document.getElementById("recipeCook").textContent =
    recipe.cookingMinutes || "N/A";

  // Ingredients
  const ingredientsList = document.getElementById("ingredientsList");
  ingredientsList.innerHTML = "";
  if (recipe.extendedIngredients) {
    recipe.extendedIngredients.forEach((ing) => {
      const li = document.createElement("li");
      li.innerHTML = `<label><input type="checkbox"> ${ing.original}</label>`;
      ingredientsList.appendChild(li);
    });
  }

  // Instructions
  const instructions = document.getElementById("instructions");
  instructions.innerHTML = "";
  if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
    recipe.analyzedInstructions[0].steps.forEach((step, idx) => {
      const div = document.createElement("div");
      div.classList.add("step");

      div.innerHTML = `
        <button class="step-header">
          <span class="step-number">${step.number}</span>
          <span class="step-title">Step ${step.number}</span>
          <span class="arrow">▾</span>
        </button>
        <div class="step-content">${step.step}</div>
      `;

      instructions.appendChild(div);

      if (idx === 0) {
        div.querySelector(".step-header").classList.add("active");
        div.querySelector(".step-content").classList.add("show");
        div.querySelector(".arrow").textContent = "▴";
      }
    });

    document.querySelectorAll(".step-header").forEach((btn) => {
      btn.addEventListener("click", () => {
        const content = btn.nextElementSibling;
        const arrow = btn.querySelector(".arrow");

        btn.classList.toggle("active");
        content.classList.toggle("show");
        arrow.textContent = content.classList.contains("show") ? "▴" : "▾";
      });
    });
  } else if (recipe.instructions) {
    instructions.innerHTML = `<p>${recipe.instructions}</p>`;
  }

  // Nutrition Chart
  if (recipe.nutrition && recipe.nutrition.caloricBreakdown) {
    const breakdown = recipe.nutrition.caloricBreakdown;
    const ctx = document.getElementById("nutritionChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Protein %", "Fat %", "Carbs %"],
        datasets: [
          {
            data: [
              breakdown.percentProtein,
              breakdown.percentFat,
              breakdown.percentCarbs,
            ],
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        width: 400,
        height: 400,
      },
    });
  }

  // Dish Types & Cuisine
  document.getElementById("recipeDish").innerHTML = recipe.dishTypes?.length
    ? recipe.dishTypes.join(", ")
    : "N/A";
  document.getElementById("recipeCuisine").innerHTML = recipe.cuisines?.length
    ? recipe.cuisines.join(", ")
    : "N/A";

  // Labels
  const chipsContainer = document.querySelector(".chips");
  chipsContainer.innerHTML = "";
  chipsContainer.innerHTML += recipe.vegetarian
    ? `<span class="chip veg">Vegetarian</span>`
    : `<span class="chip nonveg">Non-Vegetarian</span>`;
  if (recipe.vegan) chipsContainer.innerHTML += `<span class="chip vegan">Vegan</span>`;
  chipsContainer.innerHTML += recipe.glutenFree
    ? `<span class="chip glutenfree">Gluten-Free</span>`
    : `<span class="chip gluten">Contains Gluten</span>`;
  chipsContainer.innerHTML += recipe.dairyFree
    ? `<span class="chip dairyfree">Dairy-Free</span>`
    : `<span class="chip dairy">Contains Dairy</span>`;

  // ✅ Save Button Logic (NOW recipe data is available)
  const saveBtn = document.getElementById("primary-btn");
  const toast = document.getElementById("toast");

  let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  let isSaved = savedRecipes.some((r) => r.title === recipe.title);

  if (isSaved) {
    saveBtn.innerText = "Saved";
    saveBtn.classList.add("saved");
  }

  saveBtn.addEventListener("click", () => {
    let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    let existingIndex = savedRecipes.findIndex((r) => r.title === recipe.title);

    if (existingIndex === -1) {
      // Save
      savedRecipes.push({ title: recipe.title, image: recipe.image });
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
      console.log("Saved Recipes:", localStorage.getItem("savedRecipes"));
      saveBtn.innerText = "Saved";
      saveBtn.classList.add("saved");
      showToast("Recipe Saved!");
    } else {
      // Remove
      savedRecipes.splice(existingIndex, 1);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
      saveBtn.innerText = "Save Recipe";
      saveBtn.classList.remove("saved");
      showToast("Recipe Removed!");
    }
  });

  function showToast(message) {
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 2000);
  }
}
