import { Link, Outlet } from "react-router-dom";

import Logo from "../../assets/logo.jpeg";

function Header() {
  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center justify-between h-20 py-4 mx-auto bg-white-300 max-w-7xl lg:px-8"
      >
        <a className="-m-1.5 p-1.5 mt-16" href="/">
          <img alt="" className="w-24 h-24" src={Logo} />
        </a>
        <Link to="/">HomePage</Link>
        <Link to="/training">TrainingPage</Link>
        <Link to="/shap">ShapPage</Link>
      </nav>
      <Outlet />
    </>
  );
}

export default Header;
