import { faGithub } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import IconButton from './IconButton';

const GithubButton = () => {
  const redirect = () => {
    window.location.href = 'https://github.com/viethung7899/science-lab/tree/main/src/01-single-pendulum';
  };

  return (
    <IconButton buttonClass="normal-button" icon={faGithub} action={redirect} />
  );
};

export default GithubButton;
