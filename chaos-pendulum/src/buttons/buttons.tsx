import React from 'react';
import { render } from 'react-dom';
import GithubButton from './GithubButton';
import PlayButton from './PlayButton';

const Buttons = () => {
  return (
    <>
      <PlayButton
        ref={(playButton) => {
          (window as any).playButton = playButton;
        }}
      />
      <GithubButton />
    </>
  );
};

render(<Buttons />, document.getElementById('buttons'));
