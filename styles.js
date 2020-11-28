document.getElementById('menu-icon').addEventListener('click', () => {
  document.getElementById('item-container').classList.add('show-mobile-menu');
});

document.getElementById('close-icon').addEventListener('click', () => {
  document
    .getElementById('item-container')
    .classList.remove('show-mobile-menu');
});
