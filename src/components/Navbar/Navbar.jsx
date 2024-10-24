import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true); 
  const [showLofiMenu, setShowLofiMenu] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = () => {
      clearTimeout(timeoutId);
      if (!showNavbar) {
        setShowNavbar(true);
      }
      timeoutId = setTimeout(() => {
        setShowNavbar(false);
      }, 6000); 
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId); 
    };
  }, [showNavbar]);

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  const handleLofiMouseEnter = () => {
    setShowLofiMenu(true);
  };

  const handleLofiMouseLeave = () => {
    setShowLofiMenu(false);
  };

  const handleHomeClick = () => {
    navigate('/homepage');
  };

  const handleChillClick = () => {
    navigate('/chillpage');
  };

  const handleAdminClick = () => {
    navigate('/admin')
  }

  const handleSongPageClick = () => {
    navigate('/SongPage');
  };

  const handleArtistPageClick = () => {
    navigate('/ArtistPage')
  }



  return (
    <header className={`header ${!showNavbar ? 'hidden-navbar' : ''}`} style={{background: 'linear-gradient(to top, rgba(28, 39, 48, 0), rgba(28, 39, 48, 0.8))'}}> 
      <a href="/" className='logo'> LOGO </a>

      <nav className='navbar'>
        <a onClick={handleHomeClick}>HOME</a>
        <div 
          className="account-container"
          onMouseEnter={handleLofiMouseEnter}
          onMouseLeave={handleLofiMouseLeave}
        >
          <a className='lofi-link'>LOFI</a>
          {showLofiMenu && (
            <div className="lofi-dropdown-menu">
              <div className="dropdown-item-lofi" onClick={handleSongPageClick}>SONGS</div>
              <div className="dropdown-item-lofi" onClick={handleArtistPageClick}>ARTIST</div>
            </div>
          )}
        </div>
        <a onClick={handleChillClick}>CHILL</a>
      </nav>

      <div 
        className="account-container" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <a className='acc'><FaUser className='icon' /></a>
        {showMenu && (
          <div className="dropdown-menu">
            <a className="dropdown-item">Đổi mật khẩu</a>
            <a className="dropdown-item" onClick={handleAdminClick}>Admin</a>
            <a className="dropdown-item">Đăng xuất</a>
          </div>
        )}
      </div>
    </header>
  )
}