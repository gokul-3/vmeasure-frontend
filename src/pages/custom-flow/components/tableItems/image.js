const ImageData = ({ data, isDisabled, label, getFormData, onClick, tableColumnKey, rowKey, layoutId, triggerEventAPI }) => {
    return (
        <img src={data}
            alt={"Image..."} 
            sx={{ fontSize: "2rem" }}
        />
          
    )
}
export default ImageData;