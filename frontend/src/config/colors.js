const baseTitleStyle = {
    fontWeight: "bold",
    borderRadius: "8px",
    padding: "8px",
    display: "inline-block",  // Make background width as wide as the text
    marginBottom: "16px", // Add new property to titleStyle
}

const blueTitleStyle = {
    ...baseTitleStyle, 
    color: "#007BFF",  // Blue color
    backgroundColor: "#cce5ff",  // Light blue background color
};

const greenTitleStyle = {
    ...baseTitleStyle, 
    color: "#4CAF50",  // Green color
    backgroundColor: "#e5f9e5",  // Light green background color
};

export { baseTitleStyle, blueTitleStyle, greenTitleStyle }
