export const angleInput = document.querySelector<HTMLInputElement>('input[name=angle]');
export const velocityInput = document.querySelector<HTMLInputElement>('input[name=velocity]');
export const lengthInput = document.querySelector<HTMLInputElement>('input[name=length]');

const controller = document.querySelector<HTMLDivElement>('.controller');

export const lockAll = () => {
  angleInput.disabled = true; 
  velocityInput.disabled = true; 
  lengthInput.disabled = true; 
}

export const unlockAll = () => {
  angleInput.disabled = false; 
  velocityInput.disabled = false; 
  lengthInput.disabled = false; 
}

export const toggleMenu = () => {
  console.log(controller);
}