import { useContext } from "react";
import PageInfoContext from "../context/pageInfoContext";

const usePage = () => useContext(PageInfoContext);

export { usePage }; 