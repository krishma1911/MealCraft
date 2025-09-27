const apiKey = "0e928772cad24c2e979ecbcd9d128278"; document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("categoriesSlider");
  const ingredientsContainer = document.getElementById("ingredientsContainer");
  const selectedCategoryTitle = document.getElementById("selectedCategoryTitle");

  const ingredientInput = document.getElementById("ingredientInput");
  const addBtn = document.getElementById("addBtn");
  const clearBtn = document.getElementById("clearBtn");
  const searchBtn = document.getElementById("searchBtn");
  const fetchBtn = document.getElementById("fetchRecipes");

  let categories = [];
  let allIngredients = [];
  let currentIndex = 0;
  const visibleCount = 5;
  let selectedIngredients = [];

  /* ------------------------------
     Autosuggestions
  --------------------------------*/
  const suggestionBox = document.createElement("ul");
  suggestionBox.style.position = "absolute";
  suggestionBox.style.background = "#fff";
  suggestionBox.style.border = "1px solid #ddd";
  suggestionBox.style.listStyle = "none";
  suggestionBox.style.padding = "5px";
  suggestionBox.style.margin = "0";
  suggestionBox.style.width = ingredientInput.offsetWidth + "px";
  suggestionBox.style.maxHeight = "150px";
  suggestionBox.style.overflowY = "auto";
  suggestionBox.style.zIndex = "1000";
  suggestionBox.style.display = "none";
  ingredientInput.parentNode.style.position = "relative";
  ingredientInput.parentNode.appendChild(suggestionBox);

  function showSuggestions(value) {
    suggestionBox.innerHTML = "";
    if (!value) {
      suggestionBox.style.display = "none";
      return;
    }

    const filtered = allIngredients.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    filtered.forEach(suggestion => {
      const li = document.createElement("li");
      li.textContent = suggestion;
      li.style.padding = "5px";
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        ingredientInput.value = suggestion;
        suggestionBox.style.display = "none";
      });
      suggestionBox.appendChild(li);
    });

    suggestionBox.style.display = "block";
  }

  ingredientInput.addEventListener("input", (e) => {
    showSuggestions(e.target.value.trim());
  });

  document.addEventListener("click", (e) => {
    if (e.target !== ingredientInput && !suggestionBox.contains(e.target)) {
      suggestionBox.style.display = "none";
    }
  });

  /* ------------------------------
     Chips container for added ingredients
  --------------------------------*/
  let chipsContainer = document.getElementById("ingredientsList");
  if (!chipsContainer) {
    chipsContainer = document.createElement("div");
    chipsContainer.id = "ingredientsList";
    chipsContainer.className = "flex flex-wrap gap-2 mb-6";
    const wrapper = ingredientInput.parentElement;
    wrapper.parentElement.insertBefore(chipsContainer, wrapper.nextSibling);
  }

  /* ------------------------------
     Add Ingredient Button
  --------------------------------*/
  if (addBtn) {
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const raw = (ingredientInput.value || "").trim();
      if (!raw) return;

      const exists = selectedIngredients.some(
        (it) => it.toLowerCase() === raw.toLowerCase()
      );
      if (exists) {
        ingredientInput.value = "";
        ingredientInput.focus();
        return;
      }

      selectedIngredients.push(raw);

      const chip = document.createElement("div");
      chip.className =
        "ingredient-tag flex items-center gap-2 bg-[#f4f4e6] text-[#1c1c0d] px-3 py-1 rounded-full text-sm";
      chip.setAttribute("data-ingredient", raw);
      chip.innerHTML = `
        <span>${raw}</span>
        <button type="button" aria-label="remove ${raw}" class="remove-ingredient material-symbols-outlined">close</button>
      `;
      chipsContainer.appendChild(chip);

      chip.querySelector(".remove-ingredient").addEventListener("click", () => {
        const val = chip.getAttribute("data-ingredient");
        selectedIngredients = selectedIngredients.filter(
          (it) => it.toLowerCase() !== val.toLowerCase()
        );
        chip.remove();
        console.log("selectedIngredients:", selectedIngredients);
      });

      ingredientInput.value = "";
      ingredientInput.focus();

      console.log("selectedIngredients:", selectedIngredients);
    });
  }

  /* ------------------------------
     Clear All Ingredients
  --------------------------------*/
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      selectedIngredients = [];
      chipsContainer.innerHTML = "";
      console.log("Cleared all ingredients");
    
    // Deselect any selected chips in the categories section
    const categoryChips = document.querySelectorAll(".ingredient-chip.selected");
    categoryChips.forEach((chip) => chip.classList.remove("selected"));

    console.log("Selected ingredients cleared:", selectedIngredients);
    });
  }

  /* ------------------------------
     Redirect with query params
  --------------------------------*/
  function goToResults() {
    if (selectedIngredients.length === 0) {
      alert("Please add at least one ingredient!");
      return;
    }
    const query = encodeURIComponent(selectedIngredients.join(","));
    window.location.href = `result.html?ingredients=${query}`;
  }

  searchBtn?.addEventListener("click", goToResults);
  fetchBtn?.addEventListener("click", goToResults);

  /* ------------------------------
     Result Page: fetch recipes
  --------------------------------*/
  if (window.location.pathname.includes("result.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const ingQuery = urlParams.get("ingredients");

    if (ingQuery) {
      const ingredients = ingQuery.split(",");
      fetchRecipes(ingredients);
    }
  }

  async function fetchRecipes(ingredients) {
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
      ","
    )}&number=6&apiKey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      renderRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }

  function renderRecipes(recipes) {
    const container = document.querySelector(".grid");
    if (!container) return;

    container.innerHTML = "";

    if (recipes.length === 0) {
      container.innerHTML =
        "<p class='text-center text-stone-600 col-span-full'>No recipes found for the selected ingredients.</p>";
      return;
    }

    recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.className =
        "flex flex-col gap-4 rounded-xl shadow-sm bg-white overflow-hidden group hover:shadow-lg transition-shadow duration-300";

      card.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="w-full bg-center bg-no-repeat aspect-video bg-cover transition-transform duration-300 group-hover:scale-105" 
              style='background-image: url("${recipe.image}");'></div>
        </div>
        <div class="p-4 flex flex-col gap-3">
          <h3 class="text-stone-800 text-lg font-bold leading-tight">${recipe.title}</h3>
          <p class="text-stone-500 text-sm font-normal leading-normal">
            Used: ${recipe.usedIngredientCount}, Missing: ${recipe.missedIngredientCount}
          </p>
          <div class="flex items-center gap-2 pt-2">
            <a href="https://spoonacular.com/recipes/${recipe.title
              .toLowerCase()
              .replace(/ /g, "-")}-${recipe.id}" 
              target="_blank" 
              class="flex-1 bg-yellow-400 text-stone-900 font-bold py-2 px-4 rounded-full text-sm hover:bg-yellow-500 transition-colors">
              View Recipe
            </a>
            <button class="flex-1 border border-stone-300 text-stone-800 font-bold py-2 px-4 rounded-full text-sm hover:bg-stone-100 transition-colors">
              Save
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ------------------------------
     Fetch categories & ingredients
  --------------------------------*/
  if (slider && ingredientsContainer && selectedCategoryTitle) {
    fetch("ingredients.json")
      .then((res) => res.json())
      .then((data) => {
        categories = Object.entries(data).map(([name, obj]) => ({
          name,
          icon: obj.icon,
          items: obj.items,
        }));
        allIngredients = categories.flatMap(cat => cat.items);
        renderCategories();
        updateSlider();
      })
      .catch((err) =>
        console.error("Error loading ingredients.json:", err)
      );
  }

  function renderCategories() {
    slider.innerHTML = "";
    categories.forEach((cat, index) => {
      const btn = document.createElement("button");
      btn.className = "category-pill";
      btn.innerHTML = `<img src="${cat.icon}" alt="${cat.name}"> ${cat.name}`;
      btn.addEventListener("click", () => showIngredients(index));
      slider.appendChild(btn);
    });
  }

  function showIngredients(index) {
    const category = categories[index];
    selectedCategoryTitle.textContent = category.name;
    ingredientsContainer.innerHTML = "";

    category.items.forEach((ing) => {
      const chip = document.createElement("div");
      chip.className = "ingredient-chip";
      chip.textContent = ing;

      chip.addEventListener("click", () => {
        chip.classList.toggle("selected");
        if (chip.classList.contains("selected")) {
          if (!selectedIngredients.includes(ing)) {
            selectedIngredients.push(ing);
          }
        } else {
          selectedIngredients = selectedIngredients.filter(
            (item) => item !== ing
          );
        }
        console.log("selectedIngredients:", selectedIngredients);
      });

      ingredientsContainer.appendChild(chip);
    });
  }

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    if (currentIndex < categories.length - visibleCount) {
      currentIndex++;
      updateSlider();
    }
  });

  function updateSlider() {
    const offset = -currentIndex * 260;
    slider.style.transform = `translateX(${offset}px)`;
  }
});
