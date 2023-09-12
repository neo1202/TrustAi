const SelectBlock = ({ blockName, selected, onClick }) => {
    const divStyle = {
        border: selected ? '2px solid black' : 'none',
        padding: '10px',
        cursor: 'pointer',
    };

    return (
        <div style={divStyle} onClick={() => onClick(blockName) /* the selected block will be recorded as `blockName` */}> 
          {blockName}
        </div>
      );
}

export default SelectBlock;
