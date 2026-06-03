const screens = document.querySelectorAll('.screen');
const navigationButtons = document.querySelectorAll('[data-screen]');
const productCards = document.querySelectorAll('.product-card');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkoutButton');
const successMessage = document.getElementById('successMessage');

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.remove('screen--active');
  });

  const targetScreen = document.getElementById(screenId);

  if (targetScreen) {
    targetScreen.classList.add('screen--active');
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}

function updateTotal() {
  let total = 0;

  productCards.forEach((card) => {
    const price = Number(card.dataset.price);
    const count = Number(card.querySelector('.counter__value').textContent);

    total += price * count;
  });

  totalElement.textContent = formatPrice(total);
}

navigationButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    showScreen(button.dataset.screen);
  });
});

productCards.forEach((card) => {
  const minusButton = card.querySelector('.counter__minus');
  const plusButton = card.querySelector('.counter__plus');
  const valueElement = card.querySelector('.counter__value');

  minusButton.addEventListener('click', () => {
    const currentValue = Number(valueElement.textContent);

    if (currentValue > 1) {
      valueElement.textContent = currentValue - 1;
      updateTotal();
    }
  });

  plusButton.addEventListener('click', () => {
    const currentValue = Number(valueElement.textContent);

    valueElement.textContent = currentValue + 1;
    updateTotal();
  });
});

checkoutButton.addEventListener('click', () => {
  successMessage.classList.add('success-message--visible');
});

updateTotal();