import React, {useEffect, useState} from "react";
import axios from "axios";
import "../styles/Navbar.css";
import logo from "../assets/cara.png";
import { FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";


const NavBar = () => {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.post(
            "http://localhost:5050/check",
            { token }
          );
          console.log(response)
          setIsLoggedIn(response.data.loggedIn);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  

  return (
    <div>
      <header className="banner" role="banner">
        <nav className="navbar" role="navigation" aria-label="menu">
          <Link to="/">
            <img src={logo} className=" ml-32" alt="" />
          </Link>

          <ul className="menuNav">
            <Link to={'/forhim'}>
            <li
              className="dropdown nav-link nav-link-fade-up transition-all duration-700"
              
            >
              EXPLORE
              
            </li>
            </Link>

            <Link to={'/forher'}>

            <li
              className="dropdown nav-link nav-link-fade-up"
              
            >
              FOR YOU
              
            </li>
            </Link>

            <li
              className="dropdown nav-link nav-link-fade-up"
             
            >
              ABOUT
              
            </li>

            <p className="navLine absolute bg-red-600 w-1 font-extralight h-9 z-50"></p>
          </ul>

          <Link to="/cart">
            <FaShoppingBag className=" text-2xl text-right ml-10 relative left-24" />
          </Link>

          {isLoggedIn ?  <Link to="/login" className="text-2xl text-right ml-10 relative left-24">LOGOUT</Link> : <Link to="/login" className="text-2xl text-right ml-10 relative left-24">LOGIN</Link>}
        </nav>
      </header>
    </div>
  );
};

export default NavBar;

/*    



          


















             <div className="container">
                <div className="dropdown" onMouseOver={showHandler}>
                    <button className="dropbtn">Dropdown</button>
                    <div className="dropdown-content" onMouseLeave={dontShowHandler}>
                     {show && <BestSellers /> }
                    </div>
                </div>

                <div className="dropdown" onMouseOver={showHandler2}>
                    <button className="dropbtn">Dropdown</button>
                    <div className="dropdown-content" onMouseLeave={dontShowHandler}>
                    {show2 && <GiftSets /> }
                    </div>
                </div>


                <div className="dropdown">
                    <button className="dropbtn">Dropdown</button>
                    <div className="dropdown-content">
                        Link 1
                        Link 2
                        Link 3
                    </div>
                </div>


                <a href="#news">Link</a>
            </div>

            <h3>Dropdown Menu inside a Navigation Bar</h3>
            <p>Hover over the "Dropdown" link to see the dropdown menu.</p>













*/
