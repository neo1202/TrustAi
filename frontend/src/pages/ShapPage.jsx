import React, { useState } from "react";
import Dropdown from "../components/Dropdown";

function ShapPage() {
  const [dropdownSelection, setDropdownSelection] = useState(null);
  const dropdownOptions = [
    { label: "One", value: "one" },
    { label: "Two", value: "two" },
  ];
  const handleDropdownSelection = (optionSelected) => {
    setDropdownSelection(optionSelected);
  };
  return (
    <>
      <div>ShapPage</div>
      <Dropdown
        options={dropdownOptions}
        selection={dropdownSelection}
        onSelect={handleDropdownSelection}
      />
    </>
  );
}

export default ShapPage;
