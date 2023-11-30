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
        

        <br/>
        <br/>
        <h2 style={{ fontSize: '30px', fontFamily: 'Koulen', textAlign: 'center' }}>Final Student Test Accuracy: </h2>
        <p style={{ fontSize: '25px', fontFamily: 'Koulen', textAlign: 'center' }}>{`${finalStudentTestAcc? finalStudentTestAcc:'Not yet trained.'}`}</p>

        <br/>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="p-5 rounded-lg mb-4" style={{ backgroundColor: '#eeeeee', width: '20%', padding: '20px', margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' , boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)'}}>
            <p>Compress your model?</p>
            <div className="mt-4">
                <button 
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                style={{marginRight:'20px'}} onClick={handleKD}>YES</button> 
                <button 
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >NO</button>
            </div>
        </div>
        </div>
        <br/>
        <br/>
        
        {finishKD? <div>
            
            <h2 style={{ fontSize: '30px', fontFamily: 'Koulen', textAlign: 'center' }}>KD Result</h2>
            <ComparisonTable comparison={comparison} />
        </div> : <></>}
    </div>
}

export default KDPage;
