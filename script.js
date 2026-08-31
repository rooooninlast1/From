const menuItems = [
  {
    id: 1,
    title: "COGNAC COCKTAIL",
    badge: "ALC 40%",
    price: "$24",
    description: "Aged Remy Martin cognac infused with bitter orange peels, dark oak syrup, and artisanal smoke.",
    img: "./public/slide-img-1.jpg",
  },
  {
    id: 2,
    title: "PRIME RIBEYE STEAK",
    badge: "500G DRY-AGED",
    price: "$78",
    description: "USDA Prime dry-aged ribeye served with black truffle butter and roasted garlic bone marrow.",
    img: "./public/slide-img-2.jpg",
  },
  {
    id: 3,
    title: "HERB ROASTED CHICKEN",
    badge: "750G ORGANIC",
    price: "$46",
    description: "Free-range organic chicken marinated in wild rosemary, lemon thyme, and sea salt crust.",
    img: "./public/slide-img-3.jpg",
  },
  {
    id: 4,
    title: "SIGNATURE OLD FASHIONED",
    badge: "ALC 38%",
    price: "$22",
    description: "Single barrel bourbon stirred with Luxardo cherries, Angostura bitters, and gold leaf garnish.",
    img: "./public/slide-img-4.jpg",
  },
  {
    id: 5,
    title: "MEDITERRANEAN SEABASS",
    badge: "WILD CAUGHT",
    price: "$54",
    description: "Pan-seared Chilean seabass accompanied by saffron beurre blanc and roasted heirloom tomatoes.",
    img: "./public/slide-img-5.jpg",
  },
  {
    id: 6,
    title: "TRUFFLE LOBSTER PASTA",
    badge: "FRESH HANDMADE",
    price: "$62",
    description: "Poached Maine lobster tail tossed with fresh tagliolini and shaved black winter truffles.",
    img: "./public/slide-img-6.jpg",
  },
  {
    id: 7,
    title: "SAFFRON PRAWN & RICE",
    badge: "400G SEAFOOD",
    price: "$48",
    description: "Jumbo tiger prawns simmered in Spanish saffron rice, sweet peppers, and smoked paprika.",
    img: "./public/slide-img-7.jpg",
  },
  {
    id: 8,
    title: "GLAZED WAGYU TENDERLOIN",
    badge: "A5 WAGYU 350G",
    price: "$110",
    description: "Japanese A5 Wagyu tenderloin finished with a red wine reduction and baby chanterelles.",
    img: "./public/slide-img-8.jpg",
  },
  {
    id: 9,
    title: "VINTAGE BORDEAUX WINE",
    badge: "ALC 14.5%",
    price: "$140",
    description: "Grand Cru Classé vintage featuring notes of blackberry, dark cocoa, and refined French oak.",
    img: "./public/slide-img-9.jpg",
  },
  {
    id: 10,
    title: "ARTISANAL DESSERT TART",
    badge: "DARK CHOCOLATE",
    price: "$18",
    description: "70% Valrhona dark chocolate ganache, caramelized hazelnuts, and Madagascar vanilla bean cream.",
    img: "./public/slide-img-10.jpg",
  },
];

const container = document.getElementById("sliderContainer");
const track = document.getElementById("sliderTrack");

// We duplicate items enough times to guarantee a seamless infinite scroll loop
const duplicationFactor = 4;
const fullList = [];
for (let i = 0; i < duplicationFactor; i++) {
  fullList.push(...menuItems);
}

function createCardHTML(item) {
  const card = document.createElement("div");
  card.className = "card-item";
  card.innerHTML = `
    <div class="card-image-wrapper">
      <img src="${item.img}" alt="${item.title}" class="card-image" loading="lazy" />
      <span class="card-badge">${item.badge}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${item.title}</h3>
      <p class="card-description">${item.description}</p>
    </div>
    <div class="card-footer">
      <span class="card-price">${item.price}</span>
      <span class="card-action">Order Now</span>
    </div>
  `;
  return card;
}

fullList.forEach((item) => {
  track.appendChild(createCardHTML(item));
});

// Marquee scroll physics & state
let currentX = 0;
let baseSpeed = 1.2; // pixels per frame continuous auto-scroll
let speedMultiplier = 1;
let isHovered = false;
let isDragging = false;
let startX = 0;
let dragStartX = 0;
let dragDeltaX = 0;
let animationFrameId = null;

// One set width calculation (10 items)
function getSingleSetWidth() {
  const cardElements = track.children;
  if (cardElements.length < menuItems.length) return 0;

  let setWidth = 0;
  for (let i = 0; i < menuItems.length; i++) {
    const rect = cardElements[i].getBoundingClientRect();
    const style = window.getComputedStyle(cardElements[i]);
    const marginRight = parseFloat(style.marginRight) || 0;
    setWidth += rect.width + marginRight;
  }
  return setWidth;
}

let singleSetWidth = getSingleSetWidth();
window.addEventListener("resize", () => {
  singleSetWidth = getSingleSetWidth();
});

// Hover handlers
container.addEventListener("mouseenter", () => {
  isHovered = true;
});

container.addEventListener("mouseleave", () => {
  isHovered = false;
  if (isDragging) {
    isDragging = false;
  }
});

// Drag / Touch Handlers
function onPointerDown(e) {
  isDragging = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  dragStartX = currentX;
  dragDeltaX = 0;
}

function onPointerMove(e) {
  if (!isDragging) return;
  const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const delta = clientX - startX;
  dragDeltaX = delta;
  currentX = dragStartX + delta;
}

function onPointerUp() {
  if (!isDragging) return;
  isDragging = false;
}

// Mouse events
container.addEventListener("mousedown", onPointerDown);
window.addEventListener("mousemove", onPointerMove);
window.addEventListener("mouseup", onPointerUp);

// Touch events
container.addEventListener("touchstart", onPointerDown, { passive: true });
window.addEventListener("touchmove", onPointerMove, { passive: true });
window.addEventListener("touchend", onPointerUp);

// Animation Loop
function updateScroll() {
  if (!singleSetWidth) {
    singleSetWidth = getSingleSetWidth();
  }

  if (!isDragging) {
    // Target speed depends on hover
    const targetSpeed = isHovered ? 0 : baseSpeed;
    // Smoothly transition speed
    speedMultiplier += (targetSpeed - speedMultiplier) * 0.08;
    currentX -= speedMultiplier;
  }

  // Ensure seamless wrapping
  if (singleSetWidth > 0) {
    while (currentX <= -singleSetWidth) {
      currentX += singleSetWidth;
      if (isDragging) dragStartX += singleSetWidth;
    }
    while (currentX > 0) {
      currentX -= singleSetWidth;
      if (isDragging) dragStartX -= singleSetWidth;
    }
  }

  track.style.transform = `translate3d(${currentX}px, 0, 0)`;
  animationFrameId = requestAnimationFrame(updateScroll);
}

// Wait for layout/images load for initial width check
window.addEventListener("DOMContentLoaded", () => {
  singleSetWidth = getSingleSetWidth();
});

updateScroll();
