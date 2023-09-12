import { useState } from "react";
import API_URL from "../../api";

const KDPage = () => {

    const [finishKD, setFinishKD] = useState(false)

    const handleKD = async () => {
        const response = await fetch(
            `${API_URL}/KD/`, 
            {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(setting)
        })
        const data = await response.json()
        console.log("Doing KD...", data)

        setFinishKD(true)
    }

    return <div>
        <h1>KD Page</h1>

        <br/>
        <br/>
        <br/>
        <p>Compress your model?</p>
        <button style={{marginRight:'20px'}} onClick={handleKD}>YES</button> <button>NO</button>
        <br/>
        <br/>
        
        {finishKD? <div>
            <p>KD Result</p>
            <ul>
                <li>Result 1</li>
                <li>Result 2</li>
                <li>Result 3</li>
            </ul>
        </div> : <></>}
    </div>
}

export default KDPage;
