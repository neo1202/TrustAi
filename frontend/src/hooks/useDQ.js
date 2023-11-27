import { useContext } from "react";
import DQContext from "../context/DQContext";

const useDQ = () => useContext(DQContext);

export { useDQ }; 