import { Link, Outlet } from "react-router-dom";

import Logo from "../../assets/logo.jpeg";
import { IoPersonCircle } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import { usePage } from "../../hooks/usePage";

const pageRoutes = ['', 'dataquality', 'training', 'shap']
const headerLabels = { // 'routes':'header label shown'
    '':'Home', 
    'dataquality':'Data Quality',
    'training':'Active Learning',
    'shap':'SHAP Explanation',
}

const Header = () => {
  const navigate = useNavigate()
  const { currentPage, setCurrentPage, setCurrentContextStep } = usePage();
  
  const handleClickLink = (route) => {
    setCurrentPage(route);
    setCurrentContextStep(1);
    navigate(`/${route}`)
  }
  
  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center justify-around w-full h-16 pt-6 pb-2 mx-auto bg-white-300"
      >
        <a
          className="flex items-center justify-center w-16 h-16 mt-1 ml-24 align-center"
          href="/"
        >
          <img alt="" className="rounded-full" src={Logo} />
        </a>
        {pageRoutes.map((route, i) => {
          return (
          <Link to={`/${route}`} 
                className={`flex items-center justify-center w-40 hover:cursor-pointer ${route === currentPage? "text-indigo-800":""}`}
                onClick={() => {
                    handleClickLink(route)
                }}
                key={i} >
            {headerLabels[route]}
          </Link> )
        })}
        <a
          className="flex items-center justify-center w-16 h-16 mr-24 rounded-full"
          href="/profile"
        >
          <IoPersonCircle size={"4em"} />
        </a>
      </nav>
      <Outlet />
    </>
  );
}

export default Header;
