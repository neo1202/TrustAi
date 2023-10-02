const QueryTheOracle = ({ data, setQueryResults }) => {

    return <div style={{display:'flex'}}>
        <div>{data}</div>
        <div style={{marginLeft:'20px'}}>__________(text area or options)</div>
        {/* setQueryResults([label1, label2, ...]) */}
    </div>
}

export default QueryTheOracle;
