export const controller = new Map<string, number>();

const menu = document.querySelector<HTMLDivElement>('.menu');

export function initController() {
  // Add event to the input
  ['view-angle', 'view-radius', 'separation', 'alignment', 'cohesion', 'wandering'].forEach(
    (id) => {
      addEvent(id);
    },
  );

  // Toggle menu
  window.addEventListener('click', (e) => {
    if ((e.target as Element).matches('#menu')) {
      const show = menu.style.display === 'none' ? 'block' : 'none';
      menu.style.display = show;
    } else {
      menu.style.display = 'none';
    }
  })
}

function addEvent(id: string) {
  const submenu = menu.querySelector<HTMLDivElement>(`#${id}`);

  // Label elements
  const label = submenu.children[0].children[1] as HTMLParagraphElement;

  // Input elements
  const input = submenu.children[1] as HTMLInputElement;
  label.innerText = input.value;
  controller.set(id, +label.innerText);

  // Add event to input
  input.addEventListener('input', () => {
    label.innerText = input.value;
    controller.set(id, +label.innerText);
  });
}
