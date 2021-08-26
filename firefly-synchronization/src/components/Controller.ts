const menu = document.querySelector<HTMLDivElement>('.menu');
const menuButton = document.querySelector<HTMLButtonElement>('#menu');
const attr = ['number-fireflies', 'clock-speed', 'view-radius', 'sync-coeff'];
const checkBox = menu.querySelector<HTMLInputElement>('input[type="checkbox"]');
const syncMenu = menu.querySelector<HTMLDivElement>('.sync');

export const controller = {
  params: new Map<string, number>(),
  sync: false
}


function toggleMenu() {
  menuButton.addEventListener('click', () => {
    const show = menu.style.display === 'none' ? 'block' : 'none';
    menu.style.display = show;
  });
}

function addEvent(id: string) {
  const submenu = menu.querySelector<HTMLDivElement>(`#${id}`);

  // Label elements
  const label = submenu.children[0].children[1] as HTMLParagraphElement;

  // Input elements
  const input = submenu.children[1] as HTMLInputElement;
  label.innerText = input.value;
  controller.params.set(id, +label.innerText);

  // Add event to input
  input.addEventListener('input', () => {
    label.innerText = input.value;
    controller.params.set(id, +label.innerText);
  });
}

function toggleSync() {
  checkBox.addEventListener('input', () => {
    controller.sync = checkBox.checked;
    syncMenu.style.display = checkBox.checked ? 'block' : 'none';
  })
}

export function initController() {
  toggleMenu();
  attr.forEach(id => addEvent(id));
  toggleSync();
}