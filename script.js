// ====================================================================
// ĐÀ LẠT 360 — script.js
// App đọc thông tin: địa điểm check-in, lịch sử con đường, Reel TikTok.
// Toàn bộ dữ liệu lấy từ data.js (HERO_SLIDES, CATEGORIES, LOCATIONS,
// STREETS, BLOOMING_SEASONS).
// ====================================================================

const FAV_STORAGE_KEY = "dalat360_favorites";
const HOME_FEATURED_IDS = [
  "quang-truong-lam-vien",
  "ho-xuan-huong",
  "vuon-hoa-thanh-pho",
  "cho-da-lat",
  "nha-tho-con-ga",
  "cd-su-pham",
  "ga-da-lat",
  "ho-tuyen-lam",
  "thac-datanla",
  "thac-prenn",
];

function renderHomeLocations() {
  const grid = document.getElementById("homeLocationsGrid");
  if (!grid) return;
  const featured = HOME_FEATURED_IDS.map(findLocationById).filter(Boolean);
  grid.innerHTML = featured.map(locationCardHtml).join("");
  bindLocationCardClicks(grid);
}
const CATEGORY_ICON_SVG = {
  ho: '<svg viewBox="0 0 24 24"><path d="M2.5 9c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0 3.2 1.4 4.8 0"/><path d="M2.5 14.5c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0 3.2 1.4 4.8 0"/></svg>',
  "kien-truc": '<svg viewBox="0 0 24 24"><path d="M5 20V11a7 7 0 0 1 14 0v9"/><path d="M4 20h16"/><path d="M9.5 20v-6h5v6"/></svg>',
  thac: '<svg viewBox="0 0 24 24"><path d="M6.5 3v6.5M12 3v11M17.5 3v6.5"/><path d="M4 15.5c1 2 3 2 4 0M10 18.5c1 2 3 2 4 0M16 15.5c1 2 3 2 4 0"/></svg>',
  "nui-doi": '<svg viewBox="0 0 24 24"><path d="M3 19 9 8l3.5 5.5L14.5 10 21 19z"/></svg>',
  "tam-linh": '<svg viewBox="0 0 24 24"><path d="M12 19.5c-4-1-6.2-4-6.2-7 2.1 1 4.1 1 6.2 3 2.1-2 4.1-2 6.2-3 0 3-2.2 6-6.2 7z"/><path d="M12 13V4.5"/><path d="M8.3 8c1.4 1 2.4 2.3 3.7 4.5M15.7 8c-1.4 1-2.4 2.3-3.7 4.5"/></svg>',
  "vuon-hoa": '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.1"/><path d="M12 3c1.7 0 2.9 1.4 2.9 3.1S12 9.6 12 9.6 9.1 8 9.1 6.1 10.3 3 12 3zM12 21c-1.7 0-2.9-1.4-2.9-3.1S12 14.4 12 14.4s2.9 1.5 2.9 3.5S13.7 21 12 21zM3 12c0-1.7 1.4-2.9 3.1-2.9S9.6 12 9.6 12 8 14.9 6.1 14.9 3 13.7 3 12zM21 12c0 1.7-1.4 2.9-3.1 2.9S14.4 12 14.4 12s1.6-2.9 3.5-2.9S21 10.3 21 12z"/></svg>',
  "vui-choi": '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18 10.1 12.4 4.5 10.5 10.1 8.6z"/></svg>',
};

const CATEGORY_ICON_ALL = '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18 10.1 12.4 4.5 10.5 10.1 8.6z"/></svg>';

const CATEGORY_TILE_COLORS = {
  ho: "#dff1f0",
  "kien-truc": "#eaf1e2",
  thac: "#dcf1ec",
  "nui-doi": "#e7f2df",
  "tam-linh": "#f2edda",
  "vuon-hoa": "#f4e9e7",
  "vui-choi": "#e2f5e6",
};

const MAP_PIN_SVG = '<svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 21.5s-7.2-7.35-7.2-12.2A7.2 7.2 0 0 1 19.2 9.3c0 4.85-7.2 12.2-7.2 12.2z"/><circle cx="12" cy="9.3" r="2.6" fill="#fff"/></svg>';
const DIRECTIONS_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l16-7-7 16-2-7z"/></svg>';

const state = {
  favorites: loadFavorites(),
  currentView: "home",
  heroIndex: 0,
  heroTimer: null,
  activeCategory: "all",
  searchQuery: "",
  exploreTab: "places",
  builderDays: 1,
  builderSelected: [],
};

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderCategories();
  renderBloomingSeasons();
  renderStreetScroll();
  renderHomeLocations();
  renderCategoryChips();
  renderExploreLocations();
  renderExploreStreets();
  renderReelGrid();
  renderFavorites();
  updateFavCountUI();
  renderPresetItineraries();
  renderBuilderDays();
  renderBuilderPicker();

  bindNav();
  bindSearch();
  bindSeeAllButtons();
  bindExploreTabs();
  bindModalClose();
  bindHeroControls();
  bindHeaderFavShortcut();
  bindItineraryBuilder();


  // Initialize new features
  initWeatherWidget();

  initPWA();
});

// ===================== FAVORITES (localStorage) =====================
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(state.favorites));
  } catch (e) {
    /* ignore quota errors */
  }
}

function isFavorite(id) {
  return state.favorites.includes(id);
}

function toggleFavorite(id) {
  if (isFavorite(id)) {
    state.favorites = state.favorites.filter((f) => f !== id);
  } else {
    state.favorites.push(id);
  }
  saveFavorites();
  updateFavCountUI();
  // Re-render everything that shows fav state
  document.querySelectorAll(`[data-fav-target="${id}"]`).forEach((btn) => {
    btn.classList.toggle("is-fav", isFavorite(id));
  });
  renderFavorites();
}

function updateFavCountUI() {
  const count = state.favorites.length;
  const badge = document.getElementById("favCountBadge");
  const dot = document.getElementById("navFavDot");
  if (badge) {
    badge.hidden = count === 0;
    badge.textContent = count > 99 ? "99+" : String(count);
  }
  if (dot) {
    dot.hidden = count === 0;
  }
}

// ===================== HELPERS =====================
function findLocationById(id) {
  return LOCATIONS.find((l) => l.id === id) || null;
}

function findStreetById(id) {
  return STREETS.find((s) => s.id === id) || null;
}

function categoryLabel(catKey) {
  return CATEGORIES[catKey] ? CATEGORIES[catKey].label : catKey;
}

function imgWithFallback(src, fallbackEmoji, className, fallbackClassName) {
  return `
    <img src="${src}" alt="" loading="lazy"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <div class="${fallbackClassName}" style="display:none;">${fallbackEmoji}</div>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function tiktokSearchUrl(name) {
  return `https://www.tiktok.com/search?q=${encodeURIComponent(name + " Đà Lạt")}`;
}

function openTikTok(url) {
  window.open(url, "_blank", "noopener");
}

// ===================== GOOGLE MAPS HELPERS =====================
function mapQuery(loc) {
  const parts = [loc.name, loc.address, "Đà Lạt", "Lâm Đồng"].filter(Boolean);
  return parts.join(", ");
}

function mapEmbedUrl(loc) {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery(loc))}&z=15&output=embed`;
}

function mapDirectionsUrl(loc) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery(loc))}`;
}

// ===================== VIEW / NAV SWITCHING =====================
function bindNav() {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      goToView(btn.dataset.viewTarget);
    });
  });
}

function goToView(viewName, opts) {
  opts = opts || {};
  state.currentView = viewName;

  document.querySelectorAll(".view").forEach((v) => {
    v.classList.toggle("is-active", v.dataset.view === viewName);
  });
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.viewTarget === viewName);
  });

  if (viewName === "explore" && opts.exploreTab) {
    setExploreTab(opts.exploreTab);
  }
  if (viewName === "explore" && opts.category) {
    setActiveCategory(opts.category);
  }

  document.getElementById("appMain").scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  window.scrollTo(0, 0);
}

function bindSeeAllButtons() {
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.goto;
      if (target === "explore-streets") {
        goToView("explore", { exploreTab: "streets" });
      } else if (target === "itinerary") {
        goToView("itinerary");
      } else {
        goToView("explore", { exploreTab: "places" });
      }
    });
  });
}

function bindHeaderFavShortcut() {
  const btn = document.getElementById("headerFavBtn");
  if (btn) btn.addEventListener("click", () => goToView("favorites"));
}

// ===================== HERO CAROUSEL =====================
function renderHero() {
  const track = document.getElementById("heroTrack");
  const dots = document.getElementById("heroDots");
  if (!track || typeof HERO_SLIDES === "undefined") return;

  track.innerHTML = HERO_SLIDES.map((slide, idx) => `
    <div class="hero-slide" data-location-id="${slide.id}" data-idx="${idx}">
      ${imgWithFallback(slide.image, "🏔️", "", "hero-slide-fallback")}
      <div class="hero-slide-overlay"></div>
      <div class="hero-slide-content">
        <span class="hero-badge">${escapeHtml(slide.badge)}</span>
        <h1 class="hero-title">${escapeHtml(slide.title)}</h1>
        <p class="hero-subtitle">${escapeHtml(slide.subtitle)}</p>
      </div>
    </div>
  `).join("");

  dots.innerHTML = HERO_SLIDES.map((_, idx) =>
    `<span class="hero-dot ${idx === 0 ? "is-active" : ""}" data-idx="${idx}"></span>`
  ).join("");

  track.querySelectorAll(".hero-slide").forEach((slideEl) => {
    slideEl.addEventListener("click", () => openLocationModal(slideEl.dataset.locationId));
  });

  startHeroAutoplay();
}

function setHeroIndex(idx) {
  const track = document.getElementById("heroTrack");
  if (!track || typeof HERO_SLIDES === "undefined") return;
  const total = HERO_SLIDES.length;
  state.heroIndex = ((idx % total) + total) % total;
  track.style.transform = `translateX(-${state.heroIndex * 100}%)`;
  document.querySelectorAll(".hero-dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === state.heroIndex);
  });
}

function startHeroAutoplay() {
  stopHeroAutoplay();
  if (typeof HERO_SLIDES === "undefined" || HERO_SLIDES.length < 2) return;
  state.heroTimer = setInterval(() => setHeroIndex(state.heroIndex + 1), 4500);
}

function stopHeroAutoplay() {
  if (state.heroTimer) clearInterval(state.heroTimer);
}

function bindHeroControls() {
  const prev = document.getElementById("heroPrev");
  const next = document.getElementById("heroNext");
  if (prev) prev.addEventListener("click", () => { setHeroIndex(state.heroIndex - 1); startHeroAutoplay(); });
  if (next) next.addEventListener("click", () => { setHeroIndex(state.heroIndex + 1); startHeroAutoplay(); });

  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;
  let startX = 0, deltaX = 0, dragging = false;
  carousel.addEventListener("touchstart", (e) => {
    dragging = true; startX = e.touches[0].clientX; deltaX = 0;
    stopHeroAutoplay();
  }, { passive: true });
  carousel.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
  }, { passive: true });
  carousel.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;
    if (deltaX > 40) setHeroIndex(state.heroIndex - 1);
    else if (deltaX < -40) setHeroIndex(state.heroIndex + 1);
    startHeroAutoplay();
  });
}

// ===================== CATEGORIES =====================
function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;
  const entries = Object.entries(CATEGORIES);
  grid.innerHTML = entries.map(([key, cat]) => `
    <button class="category-tile" data-category="${key}">
      <span class="category-icon" style="background:${CATEGORY_TILE_COLORS[key] || "#eef2ec"};color:var(--pine)">${CATEGORY_ICON_SVG[key] || CATEGORY_ICON_ALL}</span>
      <span class="category-label">${escapeHtml(cat.label)}</span>
    </button>
  `).join("");

  grid.querySelectorAll(".category-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      goToView("explore", { exploreTab: "places", category: tile.dataset.category });
    });
  });
}

// ===================== BLOOMING SEASONS =====================
function renderBloomingSeasons() {
  const row = document.getElementById("bloomScroll");
  if (!row || typeof BLOOMING_SEASONS === "undefined") return;
  row.innerHTML = BLOOMING_SEASONS.map((b) => `
    <div class="bloom-card">
      <span class="bloom-month">${escapeHtml(b.month)}</span>
      <span class="bloom-flower">${escapeHtml(b.flower)}</span>
      <p class="bloom-desc">${escapeHtml(b.desc)}</p>
    </div>
  `).join("");
}

// ===================== STREETS =====================
function streetCardHtml(street) {
  return `
    <div class="street-card" data-street-id="${street.id}">
      <div class="street-card-image-wrap">
        ${imgWithFallback(street.image, "🛣️", "", "street-card-fallback")}
        <span class="street-badge">Lịch Sử</span>
      </div>
      <div class="street-card-body">
        <div class="street-card-name">${escapeHtml(street.name)}</div>
        <div class="street-card-subtitle">${escapeHtml(street.subtitle)}</div>
        <p class="street-card-snippet">${escapeHtml(street.history)}</p>
        <span class="street-card-tag">📍 ${street.hotspots.length} điểm nổi bật</span>
      </div>
    </div>
  `;
}

function renderStreetScroll() {
  const row = document.getElementById("streetScroll");
  if (!row || typeof STREETS === "undefined") return;
  row.innerHTML = STREETS.map(streetCardHtml).join("");
  bindStreetCardClicks(row);
}

function renderExploreStreets() {
  const list = document.getElementById("exploreStreetList");
  if (!list || typeof STREETS === "undefined") return;
  list.innerHTML = STREETS.map(streetCardHtml).join("");
  bindStreetCardClicks(list);
}

function bindStreetCardClicks(container) {
  container.querySelectorAll("[data-street-id]").forEach((card) => {
    card.addEventListener("click", () => openStreetModal(card.dataset.streetId));
  });
}

// ===================== LOCATION CARDS =====================
function locationCardHtml(loc) {
  const fav = isFavorite(loc.id);
  return `
    <div class="location-card" data-location-id="${loc.id}">
      <div class="location-card-image-wrap">
        ${imgWithFallback(loc.image, "📍", "", "location-card-fallback")}
        <span class="location-card-cat-tag">${escapeHtml(categoryLabel(loc.category))}</span>
        <button class="fav-toggle-btn ${fav ? "is-fav" : ""}" data-fav-target="${loc.id}" aria-label="Lưu yêu thích">
          <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 21s-6.7-4.35-9.3-8.05C1 10.7 1.3 7.7 3.6 6.02c2.1-1.53 4.87-1.1 6.4.86L12 8.9l2-2.02c1.53-1.96 4.3-2.39 6.4-.86 2.3 1.68 2.6 4.68.9 6.93C18.7 16.65 12 21 12 21z"/></svg>
        </button>
      </div>
      <div class="location-card-body">
        <div class="location-card-name">${escapeHtml(loc.name)}</div>
        <p class="location-card-teaser">${escapeHtml(loc.teaser || "")}</p>
        <div class="location-card-footer">
          <button class="tiktok-mini-btn" data-tiktok-target="${loc.id}">▶ Xem Video</button>
        </div>
      </div>
    </div>
  `;
}

function bindLocationCardClicks(container) {
  container.querySelectorAll(".location-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-fav-target]") || e.target.closest("[data-tiktok-target]")) return;
      openLocationModal(card.dataset.locationId);
    });
  });
  container.querySelectorAll("[data-fav-target]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.favTarget);
    });
  });
  container.querySelectorAll("[data-tiktok-target]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const loc = findLocationById(btn.dataset.tiktokTarget);
      if (loc) openTikTok(loc.tiktokUrl || tiktokSearchUrl(loc.name));
    });
  });
}



// ===================== EXPLORE (PLACES) =====================
function renderCategoryChips() {
  const row = document.getElementById("categoryChipRow");
  if (!row) return;
  const chips = [{ key: "all", label: "Tất cả", icon: CATEGORY_ICON_ALL }].concat(
    Object.entries(CATEGORIES).map(([key, cat]) => ({ key, label: cat.label, icon: CATEGORY_ICON_SVG[key] || CATEGORY_ICON_ALL }))
  );
  row.innerHTML = chips.map((c) => `
    <button class="filter-chip ${c.key === state.activeCategory ? "is-active" : ""}" data-chip="${c.key}">
      <span class="filter-chip-icon">${c.icon}</span><span>${escapeHtml(c.label)}</span>
    </button>
  `).join("");
  row.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => setActiveCategory(chip.dataset.chip));
  });
}

function setActiveCategory(key) {
  state.activeCategory = key;
  document.querySelectorAll("#categoryChipRow .filter-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.chip === key);
  });
  renderExploreLocations();
}

function getFilteredLocations() {
  const q = state.searchQuery.trim().toLowerCase();
  return LOCATIONS.filter((loc) => {
    const matchesCategory = state.activeCategory === "all" || loc.category === state.activeCategory;
    const matchesQuery = !q ||
      loc.name.toLowerCase().includes(q) ||
      (loc.teaser || "").toLowerCase().includes(q) ||
      (loc.address || "").toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

function renderExploreLocations() {
  const grid = document.getElementById("exploreLocationsGrid");
  const emptyState = document.getElementById("placesEmptyState");
  const countEl = document.getElementById("placesResultCount");
  if (!grid) return;
  const filtered = getFilteredLocations();
  grid.innerHTML = filtered.map(locationCardHtml).join("");
  bindLocationCardClicks(grid);
  if (countEl) countEl.textContent = `${filtered.length} địa điểm`;
  if (emptyState) emptyState.hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
}

// ===================== EXPLORE TABS =====================
function bindExploreTabs() {
  document.querySelectorAll(".explore-tab").forEach((tab) => {
    tab.addEventListener("click", () => setExploreTab(tab.dataset.exploreTab));
  });
}

function setExploreTab(tabName) {
  state.exploreTab = tabName;
  document.querySelectorAll(".explore-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.exploreTab === tabName);
  });
  document.getElementById("explorePlacesPanel").hidden = tabName !== "places";
  document.getElementById("exploreStreetsPanel").hidden = tabName !== "streets";

  const mapPanel = document.getElementById("exploreMapPanel");
  if (mapPanel) {
    mapPanel.hidden = tabName !== "map";
    if (tabName === "map") {
      initLeafletMap();
    }
  }
}

// ===================== SEARCH =====================
function bindSearch() {
  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("searchClearBtn");
  if (!input) return;

  input.addEventListener("input", () => {
    state.searchQuery = input.value;
    clearBtn.hidden = !input.value;
    if (input.value.trim()) {
      goToView("explore", { exploreTab: "places" });
    }
    renderExploreLocations();
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    state.searchQuery = "";
    clearBtn.hidden = true;
    renderExploreLocations();
    input.focus();
  });
}

// ===================== REEL VIEW =====================
function renderReelGrid() {
  const grid = document.getElementById("reelGrid");
  if (!grid) return;
  grid.innerHTML = LOCATIONS.map((loc) => `
    <div class="reel-card" data-reel-id="${loc.id}">
      ${imgWithFallback(loc.image, "🎬", "", "reel-card-fallback")}
      <div class="reel-card-scrim"></div>
      <div class="reel-play-icon">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
      </div>
      <div class="reel-card-label">
        <div class="reel-card-name">${escapeHtml(loc.name)}</div>
        <span class="reel-card-cta">▶ Xem Video</span>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".reel-card").forEach((card) => {
    card.addEventListener("click", () => {
      const loc = findLocationById(card.dataset.reelId);
      if (loc) openTikTok(tiktokSearchUrl(loc.name));
    });
  });
}

// ===================== FAVORITES VIEW =====================
function renderFavorites() {
  const list = document.getElementById("favoritesList");
  const emptyState = document.getElementById("favEmptyState");
  if (!list) return;
  const favLocations = state.favorites.map(findLocationById).filter(Boolean);

  if (favLocations.length === 0) {
    list.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }
  if (emptyState) emptyState.hidden = true;

  list.innerHTML = favLocations.map((loc) => `
    <div class="location-row" data-location-id="${loc.id}">
      <div class="location-row-image">
        ${imgWithFallback(loc.image, "📍", "", "location-row-fallback")}
      </div>
      <div class="location-row-body">
        <div class="location-row-name">${escapeHtml(loc.name)}</div>
        <div class="location-row-cat">${escapeHtml(categoryLabel(loc.category))}</div>
        <div class="location-row-actions">
          <button class="location-row-btn" data-tiktok-target="${loc.id}">▶ TikTok</button>
        </div>
      </div>
      <button class="location-row-remove" data-fav-target="${loc.id}" aria-label="Bỏ lưu">✕</button>
    </div>
  `).join("");

  list.querySelectorAll(".location-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("[data-fav-target]") || e.target.closest("[data-tiktok-target]")) return;
      openLocationModal(row.dataset.locationId);
    });
  });
  list.querySelectorAll("[data-fav-target]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.favTarget);
    });
  });
  list.querySelectorAll("[data-tiktok-target]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const loc = findLocationById(btn.dataset.tiktokTarget);
      if (loc) openTikTok(loc.tiktokUrl || tiktokSearchUrl(loc.name));
    });
  });
}

// ===================== ITINERARY VIEW =====================
function presetItinStepsHtml(timeline) {
  return timeline.map((step) => `
    <div class="preset-itin-step">
      <div class="preset-itin-step-dot-col"><div class="preset-itin-step-dot"></div></div>
      <div>
        <div class="preset-itin-step-time">${escapeHtml(step.time)}</div>
        <div class="preset-itin-step-title">${escapeHtml(step.title)}</div>
        ${step.note ? `<div class="preset-itin-step-note">${escapeHtml(step.note)}</div>` : ""}
      </div>
    </div>
  `).join("");
}

function renderPresetItineraries() {
  const wrap = document.getElementById("presetItinList");
  if (!wrap || typeof ITINERARIES === "undefined") return;
  wrap.innerHTML = ITINERARIES.map((itin) => {
    const stops = (itin.stops || []).map(findLocationById).filter(Boolean);
    return `
      <div class="preset-itin-card">
        <span class="preset-itin-badge">${escapeHtml(itin.badge || "")}</span>
        <div class="preset-itin-title">${escapeHtml(itin.title)}</div>
        <p class="preset-itin-desc">${escapeHtml(itin.desc || "")}</p>
        <div class="preset-itin-timeline">${presetItinStepsHtml(itin.timeline || [])}</div>
        <div class="preset-itin-stops-row">
          ${stops.map((s) => `<button class="preset-itin-stop-chip" data-related-id="${s.id}">📍 ${escapeHtml(s.name)}</button>`).join("")}
        </div>
      </div>
    `;
  }).join("");

  wrap.querySelectorAll("[data-related-id]").forEach((chip) => {
    chip.addEventListener("click", () => openLocationModal(chip.dataset.relatedId));
  });
}

// ---- Custom builder ----
function renderBuilderDays() {
  const row = document.getElementById("builderDaysRow");
  if (!row) return;
  const options = [1, 2, 3, 4];
  row.innerHTML = options.map((n) => `
    <button class="builder-day-btn ${state.builderDays === n ? "is-active" : ""}" data-days="${n}">${n} ngày</button>
  `).join("");
  row.querySelectorAll("[data-days]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.builderDays = Number(btn.dataset.days);
      renderBuilderDays();
      if (state.builderSelected.length) renderCustomPlan();
    });
  });
}

function renderBuilderPicker() {
  const list = document.getElementById("builderPickerList");
  if (!list) return;
  list.innerHTML = LOCATIONS.map((loc) => {
    const selected = state.builderSelected.includes(loc.id);
    return `
      <button class="builder-pick-item ${selected ? "is-selected" : ""}" data-pick-id="${loc.id}">
        <span class="builder-pick-check">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>
        </span>
        <span class="builder-pick-name">${escapeHtml(loc.name)}</span>
        <span class="builder-pick-cat">${escapeHtml(categoryLabel(loc.category))}</span>
      </button>
    `;
  }).join("");

  list.querySelectorAll("[data-pick-id]").forEach((item) => {
    item.addEventListener("click", () => toggleBuilderSelection(item.dataset.pickId));
  });
  updateBuilderSelectedCount();
}

function toggleBuilderSelection(id) {
  if (state.builderSelected.includes(id)) {
    state.builderSelected = state.builderSelected.filter((x) => x !== id);
  } else {
    state.builderSelected.push(id);
  }
  document.querySelectorAll(`[data-pick-id="${id}"]`).forEach((item) => {
    item.classList.toggle("is-selected", state.builderSelected.includes(id));
  });
  updateBuilderSelectedCount();
}

function updateBuilderSelectedCount() {
  const countEl = document.getElementById("builderSelectedCount");
  const genBtn = document.getElementById("builderGenerateBtn");
  const n = state.builderSelected.length;
  if (countEl) countEl.textContent = n === 0 ? "Chưa chọn địa điểm nào" : `Đã chọn ${n} địa điểm`;
  if (genBtn) genBtn.disabled = n === 0;
}

function estimateDurationMinutes(loc) {
  const text = loc.suggestedDuration || "";
  const nums = text.match(/\d+(\.\d+)?/g);
  if (!nums) return 90;
  const n = parseFloat(nums[nums.length - 1]);
  if (text.includes("phút") && !text.includes("giờ")) return Math.round(n);
  return Math.round(n * 60);
}

function minutesToTimeStr(total) {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}



function partOfDay(startMinutes) {
  const h = Math.floor(startMinutes / 60) % 24;
  if (h < 11) return { label: "Buổi sáng", icon: "🌤️" };
  if (h < 14) return { label: "Buổi trưa", icon: "🍜" };
  if (h < 18) return { label: "Buổi chiều", icon: "🌇" };
  return { label: "Buổi tối", icon: "🌙" };
}

function buildCustomPlan(ids, days) {
  const chosen = ids.map(findLocationById).filter(Boolean);
  if (!chosen.length) return [];
  const numDays = Math.min(days, chosen.length) || 1;
  const perDay = Math.ceil(chosen.length / numDays);
  const result = [];

  for (let d = 0; d < numDays; d++) {
    const dayStops = chosen.slice(d * perDay, (d + 1) * perDay);
    if (!dayStops.length) continue;

    let clock = 8 * 60; // bắt đầu 8:00
    let lastPart = null;
    const timeline = [];
    let hadLunch = false;

    dayStops.forEach((loc, i) => {
      // Chèn gợi ý ăn trưa nếu đã qua 11:30 mà chưa ăn
      if (!hadLunch && clock >= 11 * 60 + 30) {
        timeline.push({
          type: "meal",
          time: minutesToTimeStr(clock),
          title: "Ăn trưa",
          note: loc.nearbyFood && loc.nearbyFood.length
            ? `Gợi ý gần đây: ${loc.nearbyFood[0]}`
            : "Nghỉ ngơi & nạp năng lượng trước khi tiếp tục",
        });
        clock += 60;
        hadLunch = true;
      }

      const part = partOfDay(clock);
      const start = clock;
      const dur = estimateDurationMinutes(loc);
      const travel = i === 0 ? 0 : 20; // ước lượng di chuyển giữa 2 điểm
      clock += travel;
      const arriveTime = clock;
      clock += dur;
      const endTime = clock;
      clock += 15; // đệm nghỉ

      timeline.push({
        type: "stop",
        loc,
        partLabel: lastPart !== part.label ? `${part.icon} ${part.label}` : null,
        time: minutesToTimeStr(arriveTime),
        endTime: minutesToTimeStr(endTime),
        duration: dur,
        travel,
      });
      lastPart = part.label;
    });

    result.push({ dayNumber: d + 1, timeline });
  }
  return result;
}
function bindItineraryBuilder() {
  const genBtn = document.getElementById("builderGenerateBtn");
  if (genBtn) {
    genBtn.addEventListener("click", () => {
      if (!state.builderSelected.length) return;
      renderCustomPlan();
    });
  }
}
function renderCustomPlan() {
  const wrap = document.getElementById("customPlanWrap");
  if (!wrap) return;
  if (!state.builderSelected.length) {
    wrap.innerHTML = "";
    return;
  }
  const plan = buildCustomPlan(state.builderSelected, state.builderDays);
  let stopCounter = 0;

  wrap.innerHTML = plan.map((day) => {
    stopCounter = 0;
    return `
    <div class="cp-day">
      <div class="cp-day-header">
        <span class="cp-day-badge">Ngày ${day.dayNumber}</span>
        <span class="cp-day-count">${day.timeline.filter(s => s.type === "stop").length} điểm ghé thăm</span>
      </div>
      <div class="cp-timeline">
        ${day.timeline.map((step) => {
      if (step.type === "meal") {
        return `
              <div class="cp-item cp-item-meal">
                <div class="cp-item-rail">
                  <div class="cp-dot cp-dot-meal">🍽️</div>
                </div>
                <div class="cp-card cp-card-meal">
                  <div class="cp-card-time">${step.time}</div>
                  <div class="cp-card-title">${escapeHtml(step.title)}</div>
                  <div class="cp-card-sub">${escapeHtml(step.note)}</div>
                </div>
              </div>
            `;
      }
      stopCounter++;
      const catColor = CATEGORY_TILE_COLORS[step.loc.category] || "var(--pine-light)";
      return `
            ${step.partLabel ? `
              <div class="cp-part-divider"><span>${escapeHtml(step.partLabel)}</span></div>
            ` : ""}
            <div class="cp-item" data-plan-loc="${step.loc.id}">
              <div class="cp-item-rail">
                <div class="cp-dot" style="background:${catColor}">${stopCounter}</div>
              </div>
              <div class="cp-card">
                <div class="cp-card-image">
                  ${imgWithFallback(step.loc.image, "📍", "", "cp-card-fallback")}
                </div>
                <div class="cp-card-body">
                  <div class="cp-card-time">${step.time} <span class="cp-card-time-arrow">→</span> ${step.endTime}</div>
                  <div class="cp-card-title">${escapeHtml(step.loc.name)}</div>
                  <div class="cp-card-sub">
                    ⏱️ ${step.duration} phút${step.travel ? ` · 🚗 di chuyển ~${step.travel} phút` : ""}
                  </div>
                  ${step.loc.tip ? `<div class="cp-card-tip">💡 ${escapeHtml(step.loc.tip)}</div>` : ""}
                  ${step.loc.nearbyFood && step.loc.nearbyFood.length ? `
                    <div class="cp-card-food">🍜 ${escapeHtml(step.loc.nearbyFood.slice(0, 2).join(" · "))}</div>
                  ` : ""}
                </div>
              </div>
            </div>
          `;
    }).join("")}
      </div>
    </div>
  `;
  }).join("");

  wrap.querySelectorAll("[data-plan-loc]").forEach((row) => {
    row.addEventListener("click", () => openLocationModal(row.dataset.planLoc));
  });

  wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
// ===================== LOCATION DETAIL MODAL =====================
function openLocationModal(locationId) {
  const loc = findLocationById(locationId);
  if (!loc) return;

  const overlay = document.getElementById("locationModalOverlay");
  const scroll = document.getElementById("modalScroll");
  const fav = isFavorite(loc.id);
  const gallery = (loc.gallery && loc.gallery.length ? loc.gallery : [loc.image]);

  scroll.innerHTML = `
    <div class="md-gallery-wrapper">
      <div class="md-gallery" id="mdGallery">
        ${gallery.map((src) => `
          <div class="md-gallery-slide">
            ${imgWithFallback(src, "📍", "", "md-gallery-fallback")}
          </div>
        `).join("")}
      </div>
      ${gallery.length > 1 ? `
        <button class="md-gallery-nav prev" id="mdGalleryPrev" aria-label="Trước">‹</button>
        <button class="md-gallery-nav next" id="mdGalleryNext" aria-label="Sau">›</button>
      ` : ""}
      <button class="md-fav-float ${fav ? "is-fav" : ""}" data-fav-target="${loc.id}" aria-label="Lưu yêu thích">
        <svg viewBox="0 0 24 24" width="17" height="17"><path fill="currentColor" d="M12 21s-6.7-4.35-9.3-8.05C1 10.7 1.3 7.7 3.6 6.02c2.1-1.53 4.87-1.1 6.4.86L12 8.9l2-2.02c1.53-1.96 4.3-2.39 6.4-.86 2.3 1.68 2.6 4.68.9 6.93C18.7 16.65 12 21 12 21z"/></svg>
      </button>
    </div>
    <div class="md-body">
      <span class="md-cat-tag">${escapeHtml(categoryLabel(loc.category))}</span>
      <h2 class="md-title">${escapeHtml(loc.name)}</h2>
      <div class="md-meta-row">
        ${loc.rating ? `<span class="rating">★ ${escapeHtml(loc.rating)}</span>` : ""}
        ${loc.address ? `<span>📍 ${escapeHtml(loc.address)}</span>` : ""}
      </div>
      <p class="md-desc">${escapeHtml(loc.desc || loc.teaser || "")}</p>

      <div class="md-info-grid">
        ${loc.openingHours ? infoCell("🕒", "Giờ mở cửa", loc.openingHours) : ""}
        ${loc.bestTime ? infoCell("☀️", "Thời điểm đẹp nhất", loc.bestTime) : ""}
        ${loc.suggestedDuration ? infoCell("⏱️", "Thời gian gợi ý", loc.suggestedDuration) : ""}
        ${loc.price ? infoCell("🎟️", "Chi phí tham khảo", loc.price) : ""}
        ${loc.idealFor ? infoCell("👥", "Phù hợp với", loc.idealFor) : ""}
      </div>

      ${loc.highlights && loc.highlights.length ? `
        <h3 class="md-section-title">✨ Có Gì Hay Ở Đây</h3>
        <ul class="md-highlight-list">
          ${loc.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
        </ul>
      ` : ""}

      ${loc.nearbyFood && loc.nearbyFood.length ? `
        <h3 class="md-section-title">🍜 Ăn Gì Gần Đây</h3>
        <div class="md-chip-list">
          ${loc.nearbyFood.map((f) => `<span class="md-food-chip">${escapeHtml(f)}</span>`).join("")}
        </div>
      ` : ""}

      ${loc.history ? `
        <div class="md-history-box">
          <h3 class="md-section-title">📜 Lịch Sử Hình Thành</h3>
          <p class="md-history-text">${escapeHtml(loc.history)}</p>
        </div>
      ` : ""}

      <div class="md-map-box">
        <h3 class="md-section-title">🗺️ Vị Trí Trên Bản Đồ</h3>
        <div class="md-map-frame-wrap">
          <iframe src="${mapEmbedUrl(loc)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
        ${loc.address ? `
          <div class="md-map-address-row">
            ${MAP_PIN_SVG}
            <span>${escapeHtml(loc.address)}</span>
          </div>
        ` : ""}
        <div class="md-map-actions">
          <button class="md-map-btn" data-map-open="${loc.id}">${MAP_PIN_SVG}<span>Xem Google Maps</span></button>
          <button class="md-map-btn is-primary" data-map-directions="${loc.id}">${DIRECTIONS_SVG}<span>Chỉ đường</span></button>
        </div>
      </div>

      ${loc.tip ? `
        <div class="md-tip-box">
          <span>💡</span>
          <span>${escapeHtml(loc.tip)}</span>
        </div>
      ` : ""}
    </div>
    <div class="md-cta-bar">
      <button class="md-cta-fav ${fav ? "is-fav" : ""}" data-fav-target="${loc.id}" aria-label="Lưu yêu thích">
        <svg viewBox="0 0 24 24" width="19" height="19"><path fill="currentColor" d="M12 21s-6.7-4.35-9.3-8.05C1 10.7 1.3 7.7 3.6 6.02c2.1-1.53 4.87-1.1 6.4.86L12 8.9l2-2.02c1.53-1.96 4.3-2.39 6.4-.86 2.3 1.68 2.6 4.68.9 6.93C18.7 16.65 12 21 12 21z"/></svg>
      </button>
      <button class="md-cta-tiktok" data-tiktok-cta="${loc.id}">
        <svg viewBox="0 0 24 24" width="17" height="17"><path fill="currentColor" d="M16.6 5.82c-.9-.83-1.42-2-1.42-3.22h-3.02v14.02c0 1.5-1.22 2.72-2.72 2.72s-2.72-1.22-2.72-2.72 1.22-2.72 2.72-2.72c.28 0 .55.04.8.12v-3.08a5.7 5.7 0 0 0-.8-.06 5.75 5.75 0 1 0 5.75 5.75V9.4a8.7 8.7 0 0 0 5.07 1.62V8c-1.4 0-2.7-.44-3.66-1.18-.02 0-.02-.86 0 0z"/></svg>
        <span>Xem Video</span>
      </button>
    </div>
  `;

  scroll.querySelectorAll("[data-fav-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleFavorite(btn.dataset.favTarget);
      btn.classList.toggle("is-fav", isFavorite(loc.id));
    });
  });
  const tiktokCta = scroll.querySelector("[data-tiktok-cta]");
  if (tiktokCta) {
    tiktokCta.addEventListener("click", () => openTikTok(loc.tiktokUrl || tiktokSearchUrl(loc.name)));
  }
  const mapOpenBtn = scroll.querySelector("[data-map-open]");
  if (mapOpenBtn) {
    mapOpenBtn.addEventListener("click", () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(loc))}`, "_blank", "noopener"));
  }
  const mapDirBtn = scroll.querySelector("[data-map-directions]");
  if (mapDirBtn) {
    mapDirBtn.addEventListener("click", () => window.open(mapDirectionsUrl(loc), "_blank", "noopener"));
  }

  // Set up gallery navigation and auto-scroll
  if (gallery.length > 1) {
    const mdGallery = document.getElementById("mdGallery");
    const prevBtn = document.getElementById("mdGalleryPrev");
    const nextBtn = document.getElementById("mdGalleryNext");

    let currentIndex = 0;

    const scrollToIndex = (index) => {
      currentIndex = index;
      if (currentIndex >= gallery.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = gallery.length - 1;
      if (mdGallery) {
        mdGallery.scrollTo({
          left: currentIndex * mdGallery.clientWidth,
          behavior: 'smooth'
        });
      }
    };

    const startAutoScroll = () => {
      if (state.activeGalleryTimer) clearInterval(state.activeGalleryTimer);
      state.activeGalleryTimer = setInterval(() => {
        scrollToIndex(currentIndex + 1);
      }, 3000);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollToIndex(currentIndex - 1);
        startAutoScroll();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollToIndex(currentIndex + 1);
        startAutoScroll();
      });
    }

    if (mdGallery) {
      mdGallery.addEventListener('touchstart', () => {
        if (state.activeGalleryTimer) clearInterval(state.activeGalleryTimer);
      }, { passive: true });
      mdGallery.addEventListener('touchend', startAutoScroll);
    }

    startAutoScroll();
  }

  openModal(overlay);
}

function infoCell(icon, label, value) {
  return `
    <div class="md-info-cell">
      <div class="md-info-label"><span>${icon}</span><span>${escapeHtml(label)}</span></div>
      <div class="md-info-value">${escapeHtml(value)}</div>
    </div>
  `;
}

// ===================== STREET DETAIL MODAL =====================
function openStreetModal(streetId) {
  const street = findStreetById(streetId);
  if (!street) return;

  const overlay = document.getElementById("streetModalOverlay");
  const scroll = document.getElementById("streetModalScroll");

  const relatedLocs = (street.relatedLocationIds || []).map(findLocationById).filter(Boolean);

  scroll.innerHTML = `
    <div class="md-gallery">
      <div class="md-gallery-slide">
        ${imgWithFallback(street.image, "🛣️", "", "md-gallery-fallback")}
      </div>
    </div>
    <div class="md-body">
      <span class="md-cat-tag">🛣️ Lịch Sử Con Đường</span>
      <h2 class="md-title">${escapeHtml(street.name)}</h2>
      <div class="md-subtitle">${escapeHtml(street.subtitle)}</div>

      ${street.nameOrigin ? `
        <div class="md-origin-box">
          <strong>Nguồn gốc tên gọi:</strong> ${escapeHtml(street.nameOrigin)}
        </div>
      ` : ""}

      ${street.history ? `<p class="md-desc">${escapeHtml(street.history)}</p>` : ""}

      ${street.hotspots && street.hotspots.length ? `
        <h3 class="md-section-title">📍 Điểm Nổi Bật Trên Tuyến</h3>
        <div style="margin-bottom:18px;">
          ${street.hotspots.map((h) => `
            <div class="md-hotspot-item">
              <div class="md-hotspot-icon">${h.icon || "📍"}</div>
              <div>
                <div class="md-hotspot-name">${escapeHtml(h.name)}</div>
                <div class="md-hotspot-desc">${escapeHtml(h.desc)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      ` : ""}

      ${relatedLocs.length ? `
        <h3 class="md-section-title">🔗 Địa Điểm Liên Quan</h3>
        <div class="md-related-row">
          ${relatedLocs.map((l) => `<button class="md-related-chip" data-related-id="${l.id}">${escapeHtml(l.name)}</button>`).join("")}
        </div>
      ` : ""}
    </div>
    <div class="md-cta-bar">
      <button class="md-cta-tiktok" data-street-tiktok="${street.id}" style="width:100%;">
        <svg viewBox="0 0 24 24" width="17" height="17"><path fill="currentColor" d="M16.6 5.82c-.9-.83-1.42-2-1.42-3.22h-3.02v14.02c0 1.5-1.22 2.72-2.72 2.72s-2.72-1.22-2.72-2.72 1.22-2.72 2.72-2.72c.28 0 .55.04.8.12v-3.08a5.7 5.7 0 0 0-.8-.06 5.75 5.75 0 1 0 5.75 5.75V9.4a8.7 8.7 0 0 0 5.07 1.62V8c-1.4 0-2.7-.44-3.66-1.18-.02 0-.02-.86 0 0z"/></svg>
        <span>Xem Reel trên TikTok</span>
      </button>
    </div>
  `;

  scroll.querySelectorAll("[data-related-id]").forEach((chip) => {
    chip.addEventListener("click", () => {
      closeModal(document.getElementById("streetModalOverlay"));
      setTimeout(() => openLocationModal(chip.dataset.relatedId), 260);
    });
  });
  const streetTiktokBtn = scroll.querySelector("[data-street-tiktok]");
  if (streetTiktokBtn) {
    streetTiktokBtn.addEventListener("click", () => openTikTok(tiktokSearchUrl(street.name)));
  }

  openModal(overlay);
}

// ===================== MODAL OPEN/CLOSE HELPERS =====================
function openModal(overlay) {
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeModal(overlay) {
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
  if (state.activeGalleryTimer) {
    clearInterval(state.activeGalleryTimer);
    state.activeGalleryTimer = null;
  }
}

function bindModalClose() {
  const locOverlay = document.getElementById("locationModalOverlay");
  const streetOverlay = document.getElementById("streetModalOverlay");

  document.getElementById("modalCloseBtn").addEventListener("click", () => closeModal(locOverlay));
  document.getElementById("streetModalCloseBtn").addEventListener("click", () => closeModal(streetOverlay));

  [locOverlay, streetOverlay].forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(locOverlay);
      closeModal(streetOverlay);
    }
  });
}

// ===================== PRELOADER =====================
window.addEventListener("load", () => {
  const preloader = document.getElementById("appPreloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("is-hidden");
    }, 2000);
  }
});

// ===================== NEW FEATURES =====================

// 1. Weather Widget
async function initWeatherWidget() {
  const tempEl = document.getElementById("weatherTemp");
  const descEl = document.getElementById("weatherDesc");
  const iconEl = document.getElementById("weatherIcon");
  if (!tempEl || !descEl || !iconEl) return;

  const apiKey = "2b28333b72b4de4c38580f25d4496724";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Da%20Lat,VN&units=metric&appid=${apiKey}&lang=vi`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.main) {
      tempEl.textContent = `${Math.round(data.main.temp)}°C`;
      descEl.textContent = data.weather[0].description;
      iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      iconEl.hidden = false;
    } else {
      descEl.textContent = "Không có thông tin";
    }
  } catch (error) {
    descEl.textContent = "Lỗi tải thời tiết";
  }
}

// 2. Leaflet Interactive Map
let daLatMap = null;
let mapMarkers = [];

function initLeafletMap() {
  if (daLatMap) {
    daLatMap.invalidateSize(); // Fix tile loading issue when unhidden
    return;
  }

  const mapContainer = document.getElementById("daLatMap");
  if (!mapContainer || typeof L === "undefined") return;

  // Center around Da Lat
  daLatMap = L.map("daLatMap", { zoomControl: false }).setView([11.940419, 108.458313], 14);
  L.control.zoom({ position: 'bottomright' }).addTo(daLatMap);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    maxZoom: 19
  }).addTo(daLatMap);
  const customIcon = L.divIcon({
    className: 'custom-map-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  LOCATIONS.forEach(loc => {
    if (loc.lat && loc.lng) {
      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(daLatMap);
      const popupHtml = `
        <div style="text-align:center; min-width: 160px;">
          <h4 style="margin:0 0 5px; font-weight:700; color:var(--pine); font-family: var(--font-display);">${loc.name}</h4>
          <img src="${loc.image}" style="width:100%; height:90px; object-fit:cover; border-radius:8px; margin-bottom:8px;">
          <div style="display:flex; gap:6px;">
            <button onclick="openLocationModal('${loc.id}')" style="flex:1; background:var(--pine); color:white; border:none; padding:6px; border-radius:100px; cursor:pointer; font-family:var(--font-medium); font-size:12px;">Xem chi tiết</button>
            <button onclick="window.open(mapDirectionsUrl(findLocationById('${loc.id}')), '_blank')" style="flex:1; background:var(--sun); color:var(--ink); border:none; padding:6px; border-radius:100px; cursor:pointer; font-family:var(--font-medium); font-size:12px;">Chỉ đường</button>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      mapMarkers.push({ loc, marker });
    }
  });

  // Map Search Logic
  const searchInput = document.getElementById("mapSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      let hasMatch = false;
      let firstMatch = null;
      mapMarkers.forEach(item => {
        const match = item.loc.name.toLowerCase().includes(q) || (item.loc.address && item.loc.address.toLowerCase().includes(q));
        if (match) {
          if (!daLatMap.hasLayer(item.marker)) daLatMap.addLayer(item.marker);
          if (!firstMatch) firstMatch = item.marker;
        } else {
          if (daLatMap.hasLayer(item.marker)) daLatMap.removeLayer(item.marker);
        }
      });
      // Optionally zoom to first match if querying
      if (q && firstMatch) {
        daLatMap.flyTo(firstMatch.getLatLng(), 15);
        firstMatch.openPopup();
      } else if (!q) {
        daLatMap.flyTo([11.940419, 108.458313], 14);
        daLatMap.closePopup();
      }
    });
  }
}



// 4. PWA Registration
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('ServiceWorker registered:', reg.scope);
      }).catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
    });
  }
}