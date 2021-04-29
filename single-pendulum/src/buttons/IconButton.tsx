import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index';
import React, { Component } from 'react';
import '../style.scss';

interface ButtonProps {
  buttonClass: string;
  icon: IconDefinition;
  action?: () => void;
}

class IconButton extends Component<ButtonProps> {
  render() {
    const { buttonClass, icon, action = () => {} } = this.props;
    return (
      <button
        className={`button text-xl ${buttonClass}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          action();
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  }
}

export default IconButton;
