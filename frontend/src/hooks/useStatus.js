import { useContext } from "react";
import StatusContext from "../context/statusContext";

const useStatus = () => useContext(StatusContext);

export { useStatus }; 