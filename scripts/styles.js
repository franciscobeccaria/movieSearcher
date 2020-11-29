// Show Mobile Menu
document.getElementById('menu-icon').addEventListener('click', () => {
  document.getElementById('item-container').classList.add('show-mobile-menu');
});

document.getElementById('close-icon').addEventListener('click', () => {
  document
    .getElementById('item-container')
    .classList.remove('show-mobile-menu');
});

// Show Modal Custom List
if (document.getElementById('btn-custom-list')) {
  document.getElementById('btn-custom-list').addEventListener('click', () => {
    document.getElementById('modal-custom-list').classList.add('show-flex');
  });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-container')) {
      document
        .getElementById('modal-custom-list')
        .classList.remove('show-flex');
      document.getElementById('modal-searcher-input').value = '';
    }
  });
}

// Show Modal Create List
if (document.getElementById('btn-create-list')) {
  document.getElementById('btn-create-list').addEventListener('click', () => {
    document.getElementById('modal-custom-list').classList.add('show-flex');
  });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-container')) {
      document
        .getElementById('modal-custom-list')
        .classList.remove('show-flex');
      document.getElementById('modal-input').value = '';
    }
  });
}
