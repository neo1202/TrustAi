import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function NotFoundPage() {
  const navigate = useNavigate();
  // 3秒後幫你回到上一頁
  useEffect(() => {
    setTimeout(() => {
      navigate(-1);
    }, 3000);
  }, []);
  return <div>NotFoundPage</div>;
}

export default NotFoundPage;
