import Logo from "../../assets/logo.jpeg";

function Header() {
  return (
    <nav
      aria-label="Global"
      className="flex items-center justify-between h-20 py-4 mx-auto bg-white-300 max-w-7xl lg:px-8"
    >
      <a className="-m-1.5 p-1.5" href="/">
        <img alt="" className="w-12 h-12" src={Logo} />
      </a>
    </nav>
  );
}

export default Header;
