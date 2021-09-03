const menu = document.querySelector<HTMLDivElement>('.menu');
export const menuButton = document.querySelector<HTMLButtonElement>('#menu');

function toggleMenu() {
  menuButton.addEventListener('click', () => {
    const show = menu.style.display === 'none' ? 'block' : 'none';
    menu.style.display = show;
  });
}

function initMenu() {
  toggleMenu();
}