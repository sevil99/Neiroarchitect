const screens = document.querySelectorAll(".screen");
const navigationControls = document.querySelectorAll("[data-screen]");
const mainElement = document.querySelector(".main");
const roomRequest = document.getElementById("roomRequest");
const productCards = document.querySelectorAll(".product-card");
const totalElement = document.getElementById("total");
const itemsCountElement = document.getElementById("itemsCount");
const checkoutButton = document.getElementById("checkoutButton");
const successMessage = document.getElementById("successMessage");
const homeSearchForm = document.querySelector(".search-panel");
const repairSearchInput = document.getElementById("repairSearch");
const chatInputForm = document.querySelector(".chat-input");
const chatPromptInput = document.getElementById("chatPrompt");
const chatScreen = document.getElementById("chat");
const cartScreen = document.getElementById("cart");
const screenPushDuration = 780;


const roomMessages = {
  "Ванная": "Я хочу сделать ремонт в ванной",
  "Кухня": "Я хочу сделать ремонт на кухне",
  "Гостиная": "Я хочу сделать ремонт в гостиной"
};

function showScreen(screenId, options = {}) {
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen) {
    return;
  }

  screens.forEach((screen) => {
    screen.classList.toggle("screen--active", screen === targetScreen);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (options.updateHash !== false) {
    history.replaceState(null, "", `#${screenId}`);
  }
}

function pushScreen(fromScreen, toScreen, hash) {
  if (mainElement.classList.contains("main--screen-push")) {
    return;
  }

  mainElement.style.minHeight = `${mainElement.offsetHeight}px`;
  mainElement.classList.add("main--screen-push");

  fromScreen.classList.add("screen--leaving");
  toScreen.classList.add("screen--active", "screen--entering");
  history.replaceState(null, "", hash);

  window.setTimeout(() => {
    fromScreen.classList.remove("screen--active", "screen--leaving");
    toScreen.classList.remove("screen--entering");
    mainElement.classList.remove("main--screen-push");
    mainElement.style.minHeight = "";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, screenPushDuration);
}

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} р`;
}

function getProductCount(card) {
  return Number(card.querySelector(".counter__value").textContent);
}

function updateCartSummary() {
  let total = 0;
  let count = 0;

  productCards.forEach((card) => {
    const price = Number(card.dataset.price);
    const productCount = getProductCount(card);

    total += price * productCount;
    count += productCount;
  });

  totalElement.textContent = formatPrice(total);
  itemsCountElement.textContent = `${count} ${getProductsWord(count)}`;
}

function getProductsWord(count) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "товаров";
  }

  if (lastDigit === 1) {
    return "товар";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "товара";
  }

  return "товаров";
}

navigationControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();

    if (control.dataset.room && roomRequest) {
      roomRequest.textContent = roomMessages[control.dataset.room] || roomMessages["Ванная"];
    }

    showScreen(control.dataset.screen);
  });
});

productCards.forEach((card) => {
  const minusButton = card.querySelector(".counter__minus");
  const plusButton = card.querySelector(".counter__plus");
  const valueElement = card.querySelector(".counter__value");

  minusButton.addEventListener("click", () => {
    const currentValue = Number(valueElement.textContent);

    if (currentValue <= 1) {
      return;
    }

    valueElement.textContent = currentValue - 1;
    successMessage.classList.remove("success-message--visible");
    updateCartSummary();
  });

  plusButton.addEventListener("click", () => {
    const currentValue = Number(valueElement.textContent);

    valueElement.textContent = currentValue + 1;
    successMessage.classList.remove("success-message--visible");
    updateCartSummary();
  });
});

checkoutButton.addEventListener("click", () => {
  successMessage.classList.add("success-message--visible");
});

homeSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const requestText = repairSearchInput.value.trim();

  if (!requestText) {
    return;
  }

  roomRequest.textContent = requestText;
  pushScreen(document.getElementById("home"), chatScreen, "#chat");
});

chatInputForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!chatPromptInput.value.trim()) {
    return;
  }

  pushScreen(chatScreen, cartScreen, "#cart");
});

updateCartSummary();

const initialScreen = window.location.hash.replace("#", "");

if (initialScreen) {
  showScreen(initialScreen, { updateHash: false });
}
