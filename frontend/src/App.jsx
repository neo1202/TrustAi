import Stepper from "./layouts/Stepper/Stepper";
import Header from "./layouts/Header/Header";

function App() {
  return (
    <>
      <div className="flex flex-col justify-start h-screen gap-4 bg-gray-900 item-center">
        <Header />
        <Stepper />
      </div>
    </>
  );
}
export default App;
