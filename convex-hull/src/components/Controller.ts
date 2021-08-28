const menu = document.querySelector<HTMLDivElement>('.menu');
export const menuButton = document.querySelector<HTMLButtonElement>('#menu');

export const controller = {
  isPlaying: false
}

function toggleMenu() {
  menuButton.addEventListener('click', () => {
    const show = menu.style.display === 'none' ? 'block' : 'none';
    menu.style.display = show;
  });
}

export function initController() {
  toggleMenu();
}