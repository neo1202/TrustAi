import { useNavigate } from "react-router-dom";
import { usePage } from "../../hooks/usePage";

const ShapExpPage = () => {
    const navigate = useNavigate();
    const { setCurrentPage } = usePage();

    const handleClick = () => {
        setCurrentPage('shap');
        navigate(`/shap`);
    }

    return <div className="mx-8">
        <div className="bg-gray-200 p-10 rounded-lg mb-4">
        <h1 className="text-3xl font-bold">Summary</h1>
        <p className=" text-xl">In summary, the implementation of active learning and knowledge distillation has 
            significantly enhanced our model's performance in both accuracy 
            and computational efficiency. Building on this foundation, we now turn our attention 
            to understanding the intricate details of model predictions. This brings us to the 
            application of SHAP (SHapley Additive exPlanations), a powerful technique that provides 
            insightful explanations for individual predictions. </p>
        </div>

        <div className="bg-gray-200 p-10 rounded-lg">
        <h1 className="text-3xl font-bold">SHAP Introduction</h1>
        <p className=" text-xl">SHAP assigns values to features in a prediction, revealing their contributions to the model's output. 
            SHAP enables us to identify the driving factors behind model decisions, making them more 
            interpretable and trustworthy.</p>
        </div>
        {/* <button onClick={handleClick}>GO TO SHAP EXPLANATION</button> */}
    </div>
}

export default ShapExpPage;
