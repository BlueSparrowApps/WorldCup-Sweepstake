import React from 'react';
import PropTypes from 'prop-types'
import { Navbar } from 'react-bootstrap'
import GradientButton from './GradientButton'
import { ReactComponent as ArrowRight } from '../resources/ArrowRight.svg';
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Header = ({ linkText, secondBtnText, secondBtnOnClick, secondBtnDisabled }) => {
    const location = useLocation()

    return (
        <Navbar>
            <Navbar.Collapse className='justify-content-end'>
                <div className='LearnANDBtnContainer flex items-center flex-col sm:flex-row'>
                    <div className='LearnMoreContainer flex pr-3'>                        
                        <a href="https://www.bluesparrowapps.com/world-cup-sweepstake-learn-more/" className='text-base font-inter bg-transparent text-button-violet hover:text-blue-500 focus:outline-none hover:no-underline hidden sm:block'>
                            {linkText}
                        </a>
                        <a href="https://www.bluesparrowapps.com/world-cup-sweepstake-learn-more/">
                            <ArrowRight className='h-6 w-8 hidden sm:block' />
                        </a>
                    </div>
                    <GradientButton className='ml-8 my-2'
                        text={secondBtnText}
                        disabled={secondBtnDisabled}
                        onClick={secondBtnOnClick} />
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}

Header.defaultProps = {
    secondBtnDisabled: false,
  }

Header.propTypes = {
    linkText: PropTypes.string.isRequired,
    secondBtnText: PropTypes.string.isRequired,
    secondBtnOnClick: PropTypes.func,
    secondBtnDisabled: PropTypes.bool
}

export default Header