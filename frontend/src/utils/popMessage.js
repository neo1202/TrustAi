import { message } from "antd";

const popMessage = (msg) => {
    const content = {
        content: msg, duration: 1.5
    }
    message.success(content); // success: green check, error: red cross
}

export default popMessage;
