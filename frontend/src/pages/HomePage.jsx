import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const handleTrainingButtonClick = () => {
    navigate("/training");
  };
  return (
    <>
      <div>It's HomePage</div>
      <button onClick={handleTrainingButtonClick}>Go to Training</button>
    </>
  );
}
export default HomePage;
