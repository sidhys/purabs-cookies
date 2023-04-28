import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <div class='footer-links'>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>Contact</h2>
            <Link to='/twitter'>Twitter</Link>
            <Link to='/insta'>Instagram</Link>
            <Link to='/facebook'>Facebook</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>Physical Locations</h2>
            <Link to='/applemaps'>Apple Maps</Link>
            <Link to='/googlemaps'>Google Maps</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
