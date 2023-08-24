import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";

function MethodSelectPage() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount((prev) => prev + 1);
  }, []);
  console.log(count);
  console.log("進入MethodSelectPage!!wc");
  console.log("對就是MethodSelect");
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const actionBar = (
    <div>
      <button onClick={handleCloseModal}>I got it</button>
    </div>
  );
  const modal = (
    <Modal onClose={handleCloseModal} actionBar={actionBar}>
      <p>這個Model是CNN架構, 可以處理中等複雜的數據</p>
    </Modal>
  );
  return (
    <div className="relative">
      <div>ChooseModelPage</div>
      <button onClick={handleClick}>openModal</button>
      {showModal && modal}
    </div>
  );
}

export default MethodSelectPage;
