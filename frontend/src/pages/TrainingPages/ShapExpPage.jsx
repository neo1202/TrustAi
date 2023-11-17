import { useNavigate } from "react-router-dom";
import { usePage } from "../../hooks/usePage";

const ShapExpPage = () => {
    const navigate = useNavigate();
    const { setCurrentPage } = usePage();

    const handleClick = () => {
        setCurrentPage('shap');
        navigate(`/shap`);
    }

    return <div>
        <h1>Shap Explanation Page</h1>
        <p>Now, we gain some info from previous, bla bla bla</p>
        <p>Put some brief description about SHAP for users(who do not know what SHAP is)</p>
        <button onClick={handleClick}>GO TO SHAP EXPLANATION</button>
    </div>
}

export default ShapExpPage;
