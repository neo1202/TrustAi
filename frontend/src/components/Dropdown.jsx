import { useState, useEffect, useRef } from "react";
import { GoChevronDown } from "react-icons/go";

function Dropdown({ options, selection, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const divEl = useRef();
  useEffect(() => {
    const handler = (event) => {
      // console.log(event.target);
      // console.log(divEl);
      if (!divEl.current) {
        return;
      }
      if (!divEl.current.contains(event.target)) {
        //如果點擊dropdown之外，就關閉
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handler, true); //capture phase target phase, bubble phase
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);
  const handleClick = () => {
    setIsOpen((currentIsOpen) => !currentIsOpen);
  };
  const handleOptionClick = (option) => {
    console.log(option);
    setIsOpen(false);
    onSelect(option);
  };
  const renderedOptions = options.map((option) => {
    return (
      <div
        className="p-1 rounded cursor-pointer hover:bg-sky-200"
        onClick={() => handleOptionClick(option)}
        key={option.value}
      >
        {option.label}
      </div>
    );
  });
  return (
    <div ref={divEl} className="relative w-48">
      <div
        className="flex items-center justify-between w-full p-3 bg-white border rounded shadow cursor-pointer"
        onClick={handleClick}
      >
        {selection?.label || "select..."}
        <GoChevronDown className="text-lg" />
      </div>
      {isOpen && (
        <div className="absolute w-full p-3 bg-white border rounded shadow top-full">
          {renderedOptions}
        </div>
      )}
    </div>
  );
}
export default Dropdown;
