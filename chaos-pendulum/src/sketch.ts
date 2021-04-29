import p5 from 'p5';
import './buttons/buttons.tsx';
import PlayButton from './buttons/PlayButton';
import ChaosPendulum from './pendulum/ChaosPendulum';

const playButton = <PlayButton>(window as any).playButton;

const Sketch = (pendulum: ChaosPendulum) => (p: p5) => {
  let dimension = { width: 0, height: 0 };
  let chaosPendulum = pendulum;

  const resize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    dimension = { width, height };
  };

  p.setup = () => {
    resize();
    p.createCanvas(dimension.width, dimension.height);
    playButton.setCanvas(p);
    chaosPendulum.move();
    p.noLoop();
  };

  p.draw = () => {
    p.background(51);
    const { width, height } = dimension;
    const origin = p.createVector(width / 2, height / 4);
    chaosPendulum.draw(p, origin);

    if (playButton.isPlaying()) {
      chaosPendulum.move();
    }
  };

  p.windowResized = () => {
    resize();
    p.resizeCanvas(dimension.width, dimension.height);
  };
};

export default Sketch;
