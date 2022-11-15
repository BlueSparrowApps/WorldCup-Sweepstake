import React from 'react';
import PropTypes from 'prop-types'

const GradientButton = ({ text, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled} className='font-inter bg-gradient-to-r from-button-dark-red to-button-red text-white hover:text-blue-500 focus:outline-none disabled:cursor-not-allowed rounded-full shadow-2xl shadow-black px-8 py-2'>
      {text}
    </button>
  )
}

GradientButton.defaultProps = {
  disabled: false,
}

GradientButton.propTypes = {
  text: PropTypes.string.isRequired,
  onclick: PropTypes.func,
  disabled: PropTypes.bool
}

export default GradientButton