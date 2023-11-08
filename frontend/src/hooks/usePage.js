import { useContext } from "react";
import PageInfoContext from "../context/pageInfo";

const usePage = () => useContext(PageInfoContext);

export { usePage }; 