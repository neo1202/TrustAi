import { Link, Outlet } from "react-router-dom";

import Logo from "../../assets/logo.jpeg";
import { IoPersonCircle } from "react-icons/io5";

function Header() {
  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center justify-around w-full h-20 py-4 mx-auto bg-white-300"
      >
        <a className="w-16 h-16 mt-1 ml-24 align-center" href="/">
          <img alt="" className="rounded-full" src={Logo} />
        </a>
        <Link to="/" className="w-32">
          Home
        </Link>
        <Link to="/training" className="w-32">
          Active Learning
        </Link>
        <Link to="/shap" className="w-32">
          Shap Explanation
        </Link>
        <a className="w-16 h-16 mr-24 rounded-full" href="/profile">
          <IoPersonCircle size={"4em"} />
        </a>
      </nav>
      <Outlet />
    </>
  );
}

export default Header;
