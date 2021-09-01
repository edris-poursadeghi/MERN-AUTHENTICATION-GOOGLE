import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Header() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  const { user, isLogged } = auth;

  const handleLogout = async () => {
    try {
      await axios.get("/user/logout", {
        headers: { Authorization: token },
      });

      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
    }
  };

  const userLink = () => {
    return (
      <li className="drop-nav">
        <Link to="#" className="avatar">
          <img src={user.avatar} alt={user.name} />
          {user.name}
          <i className="fas fa-angle-down"> </i>
        </Link>
        <ul className="dropdown">
          <li>
            <Link to="/profile">پروفایل</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              خروج از حساب
            </Link>
          </li>
        </ul>
      </li>
    );
  };

  return (
    <header>
      <div className="logo">
        <h1>
          <Link to="/">سایت x برای تست</Link>
        </h1>
      </div>

      <ul>
        <li>
          <Link to="/">
            <span> سبد شما </span>
            <i className="fas fa-shopping-cart"></i>
          </Link>
        </li>
        {isLogged ? (
          userLink()
        ) : (
          <li>
            <Link to="/login">
              <span> ورود به سایت </span>
              <i className="fas fa-user"></i>
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}

export default Header;
