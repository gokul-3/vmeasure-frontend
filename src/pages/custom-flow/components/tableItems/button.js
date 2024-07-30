import Button from "@mui/material/Button";

const TableButton = ({ data, isDisabled, label, getFormData, onClick, tableColumnKey, rowKey, layoutId, triggerEventAPI }) => {

    const handleClick = async () => {
        try {
            const currentFormData = JSON.parse(JSON.stringify(getFormData()));
            if (onClick && tableColumnKey && rowKey && currentFormData && layoutId) {
                triggerEventAPI(onClick, { rowKey: rowKey });
            }
        } catch (err) {
            //consoleerror('Error in handleClick:', err?.response)
        }
    }

    return (
        <Button variant={"contained"}
            disabled={isDisabled}
            onClick={handleClick}
            sx={{ fontSize: "2rem" }}
        >
            {label ?? "Button"}
        </Button>
    )
}

export default TableButton;