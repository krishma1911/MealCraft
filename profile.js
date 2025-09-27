document.addEventListener("DOMContentLoaded", () => {
  const profileName = document.getElementById("profileName");
  const profileImage = document.getElementById("profileImage");
  const headerAvatar = document.getElementById("headerAvatar");
  const savedRecipesDiv = document.getElementById("savedRecipes");
  // Get saved recipes array from localStorage
  let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
// Get total count
  let savedCount = savedRecipes.length;
  const preferences = document.querySelectorAll(".preferences"); // ✅ FIXED

  // Modal elements
  const editModal = document.getElementById("editModal");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
    const savePrefBtn = document.getElementById("savePrefBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const cancelBtn2 = document.getElementById("cancelBtn2");
  const nameInput = document.getElementById("nameInput");
  const avatarPicker = document.getElementById("avatarPicker");

  // Avatars
  const avatars = [
    "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg",
    "11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg"
  ];
  let selectedAvatar = null;
 
  function loadPref() {
      const userPref = JSON.parse(localStorage.getItem("userPref")) || {};
    // Preferences (checkboxes/toggles)
  preferences.forEach(pref => {
    if (Array.isArray(userPref.preferences)) {
      pref.checked = userPref.preferences.includes(pref.dataset.pref);
    } else {
      pref.checked = false; // fallback
    }
  });
  }
 function loadProfile() {
  const userData = JSON.parse(localStorage.getItem("userProfile")) || {};

  // Name & Avatar
  profileName.textContent = userData.name || "Guest User";
  const avatar = userData.avatar;
  profileImage.style.backgroundImage = `url(assets/avatar/${avatar})`;
  if (headerAvatar) {
    headerAvatar.style.backgroundImage = `url(assets/avatar/${avatar})`;
  }

  const savedCountEl = document.getElementById("savedCount");
  if (savedCountEl) {
    savedCountEl.textContent = savedCount;
  }
}

  /** Load Saved Recipes **/
  function loadSavedRecipes() {
    let saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    savedRecipesDiv.innerHTML = "";

    if (saved.length === 0) {
      savedRecipesDiv.innerHTML = `<p class="empty-text">No recipes saved yet.</p>`;
    } else {
      saved.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
          <img src="${recipe.image || "assets/placeholder.jpg"}" alt="${recipe.title || "Recipe"}">
          <h4>${recipe.title || "Untitled Recipe"}</h4>
        `;
        savedRecipesDiv.appendChild(card);
      });
    }

    savedCount.textContent = saved.length;
  }

  /** Open Modal **/
  editProfileBtn.addEventListener("click", () => {
    editModal.style.display = "flex";
    nameInput.value = profileName.textContent;

    avatarPicker.innerHTML = "";
    avatars.forEach(av => {
      const img = document.createElement("img");
      img.src = `assets/avatar/${av}`;
      img.dataset.avatar = av;
      if (profileImage.style.backgroundImage.includes(av)) {
        img.classList.add("selected");
        selectedAvatar = av;
      }
      img.addEventListener("click", () => {
        document.querySelectorAll(".avatar-picker img").forEach(i => i.classList.remove("selected"));
        img.classList.add("selected");
        selectedAvatar = av;
      });
      avatarPicker.appendChild(img);
    });
  });

  /** Save Changes **/
  savePrefBtn.addEventListener("click", () => {
    const prefs = Array.from(preferences)
      .filter(p => p.checked)
      .map(p => p.dataset.pref);

    const userPref = {
      preferences: prefs
    };

    localStorage.setItem("userPref", JSON.stringify(userPref));
    loadPref();
  });
  
  
  saveProfileBtn.addEventListener("click", () => {
    const name = nameInput.value.trim() || "Guest User";
    const prefs = Array.from(preferences)
      .filter(p => p.checked)
      .map(p => p.dataset.pref);

    const userProfile = {
      name,
      avatar: selectedAvatar,
      preferences: prefs
    };

    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    loadProfile();
    editModal.style.display = "none";
  });

  /** Cancel Buttons **/
  cancelBtn.addEventListener("click", () => {
    editModal.style.display = "none";
  });
  cancelBtn2.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  /** Tab Switching **/
  document.querySelectorAll(".tab-link").forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".tab-link").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      document.getElementById(tab.dataset.tab + "Tab").classList.add("active");
    });
  });

  /** Init **/
  loadProfile();
  loadPref();
  loadSavedRecipes();
});
