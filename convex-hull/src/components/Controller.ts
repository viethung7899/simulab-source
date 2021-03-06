const menu = document.querySelector<HTMLDivElement>('.menu');
export const menuButton = document.querySelector<HTMLButtonElement>('#menu');
import { divideConquer } from '../algorithms/divideConquer';
import { giftWrapping } from '../algorithms/giftWrapping';
import { grahamScan } from '../algorithms/grahamScan';
import { monoToneChain } from '../algorithms/monotoneChain';
import { quickHull } from '../algorithms/quickHull';
import { Algorithm } from '../utils/constant';

export const controller = {
  isPlaying: false,
  animationSpeed: new Map<string, number>(),
  algorithm: new Map<string, Algorithm>(),
};

function toggleMenu() {
  menuButton.addEventListener('click', () => {
    const show = menu.style.display === 'none' ? 'block' : 'none';
    menu.style.display = show;
  });
}

function initMenu() {
  (
    [
      ['slow', 500],
      ['medium', 200],
      ['fast', 80],
      ['very-fast', 20],
    ] as [string, number][]
  ).forEach(([key, value]) => {
    controller.animationSpeed.set(key, value);
  });

  (
    [
      ['gift-wrapping', giftWrapping],
      ['graham-scan', grahamScan],
      ['quickhull', quickHull],
      ['monotone', monoToneChain],
      ['divide-conquer', divideConquer]
    ] as [string, Algorithm][]
  ).forEach(([key, value]) => {
    controller.algorithm.set(key, value);
  });
}

export const useMenu = () => {
  toggleMenu();
  initMenu();

  const inputAnimation = document.querySelector<HTMLSelectElement>(
    '#animation-speed select',
  );
  const inputAlgorithm =
    document.querySelector<HTMLSelectElement>('#algorithm select');

  const getAnimationSpeed = () => {
    return controller.animationSpeed.get(inputAnimation.value);
  };

  const getAlgorithm = () => {
    return controller.algorithm.get(inputAlgorithm.value);
  };

  const disableMenu = (status: boolean) => {
    inputAlgorithm.disabled = status;
    inputAnimation.disabled = status;
  };

  return {
    getAnimationSpeed,
    getAlgorithm,
    disableMenu,
  };
};
