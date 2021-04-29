import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import p5 from 'p5';
import React, { Component } from 'react';
import { lockAll, unlockAll } from '../input';
import IconButton from './IconButton';

type PlayButtonState = {
  playing: boolean;
  canvas?: p5;
};

class PlayButton extends Component<{}, PlayButtonState> {
  state: PlayButtonState = {
    playing: false,
  };

  toggle = () => {
    this.setState((state) => ({ playing: !state.playing }));
  };

  isPlaying = () => {
    return this.state.playing;
  }

  setCanvas = (canvas: p5) => {
    this.setState((state) => ({ ...state, canvas }));
  };

  componentDidUpdate() {
    const { playing, canvas } = this.state;
    if (this.state.canvas) {
      canvas.noLoop();
      unlockAll();
      if (playing) {
        canvas.loop();
        lockAll();
      }
    }
  }

  render() {
    const buttonClass = !this.state.playing ? 'play-button' : 'stop-button';
    const icon = !this.state.playing ? faPlay : faStop;
    return (
      <IconButton action={this.toggle} buttonClass={buttonClass} icon={icon} />
    );
  }
}

export default PlayButton;
