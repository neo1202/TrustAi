import { useState } from "react";
import API_URL from "../../api";
import ComparisonTable from "../../components/ComparisonTable";

const KDPage = () => {

    const [finishKD, setFinishKD] = useState(false)
    const [finalStudentTestAcc, setFinalStudentTestAcc] = useState(0)
    const [comparison, setComparison] = useState({})

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

        setFinalStudentTestAcc(data.testAcc)
        setComparison(data.comparison)
        setFinishKD(true)
    }

    return <div>
        <h1>KD Page</h1>

        <br/>
        <br/>
        <p>{`Final Student Test Accuracy: ${finalStudentTestAcc? finalStudentTestAcc:'Not yet trained.'}`}</p>

        <br/>
        <p>Compress your model?</p>
        <button style={{marginRight:'20px'}} onClick={handleKD}>YES</button> <button>NO</button>
        <br/>
        <br/>
        
        {finishKD? <div>
            <p>KD Result</p>
            <ComparisonTable comparison={comparison} />
        </div> : <></>}
    </div>
}

export default KDPage;
