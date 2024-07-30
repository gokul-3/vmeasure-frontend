import Button from "../../components/tableItems/button";
import TextBox from "../../components/tableItems/text-box";
import CheckBox from "../../components/tableItems/check-box";
import SelectBox from "../../components/tableItems/select-box";
import ImageData from "../../components/tableItems/image";
import getIcon from "../../widgets/icons/index";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography"
import { TableCellTypes } from "../../../../constants/custom-flow";
import { useEffect, useState, useRef } from "react";
import { ArrowUpwardOutlined, ArrowDownwardOutlined } from "@mui/icons-material";

const TableLayout = ({
    title = "",
    tableHeader = [],
    tableData,
    formData,
    triggerEventAPI,
    layoutId,
    headerContent = { content: [] },
    footerContent = { content: [] },
    focus,
    uiSchema

}) => {

    const tableAddtionalStyleAttributes = {
        display: "flex",
        justifyContent: "left",
        flexDirection: "row",
        alignItem: "center",
        flexWrap: "wrap",
        margin: "2px",
        padding: "2px"
    }

    const tableDivStyles = { minWidth: "200px" }

    const [headerStyle, setHeaderStyle] = useState({ ...tableAddtionalStyleAttributes, ...headerContent?.styles });
    const [footerStyle, setFooterStyle] = useState({ ...tableAddtionalStyleAttributes, ...footerContent?.styles });
    const rowFocus = useRef();
    const [rowData, setRowData] = useState(tableData)
    const [order, setOrder] = useState({});

    const focusStyle = {
        backgroundColor: "#b9f6ca",
    };

    const renderComponent = (cellData, header, rowKey, tableDataIndex) => {
        if (!cellData || !header || !rowKey) { return <></> }

        const fieldData = JSON.parse(JSON.stringify(cellData));
        fieldData.updateFormData = () => { }
        fieldData.getFormData = getFormData
        fieldData.rowKey = rowKey
        fieldData.tableColumnKey = header;
        fieldData.tableIndex = tableDataIndex;
        fieldData.triggerEventAPI = triggerEventAPI
        fieldData.layoutId = layoutId

        switch (fieldData.type) {
            case TableCellTypes.LABEL:
                return (<Typography variant="body8">
                    {fieldData?.data || ""}
                </Typography>)
            case TableCellTypes.SELECT:
                return <SelectBox {...fieldData}></SelectBox>
            case TableCellTypes.CHECKBOX:
                return <CheckBox {...fieldData}></CheckBox>
            case TableCellTypes.TEXT:
                return <TextBox {...fieldData}></TextBox>
            case TableCellTypes.BUTTON:
                return <Button {...fieldData}></Button>
            case TableCellTypes.IMAGE:
                return <ImageData {...fieldData}></ImageData>
            case TableCellTypes.ICON:
                const IconComponent = getIcon(fieldData?.data)
                return <IconComponent sx={{ ...fieldData?.styles, fontSize: '2em' }} />
            default:
                return <>NA</>
        }
    }

    const getFormData = () => {
        return formData
    }

    const sortedData = (column, order) => [...rowData].sort((a, b) => {
        const valueA = typeof (a[column]?.data) == "string" ? (a[column]?.data).trim() : a[column]?.data
        const valueB = typeof (b[column]?.data) == "string" ? (b[column]?.data).trim() : b[column]?.data

        if (order === 'asc') {
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
        } else {
            console.log("in desc")
            if (valueA > valueB) return -1;
            if (valueA < valueB) return 1;
        }

        return 0;
    });

    const handleSort = (column) => {
        const currentOrder = order[column];
        const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
        const data = sortedData(column, newOrder);
        setOrder({ [column]: newOrder });
        setRowData(data);
    };

    useEffect(() => {
        if (rowFocus.current) {
            rowFocus.current.scrollIntoView({ behavior: 'smooth', block: 'center' });


        }
    }, [focus])


    useEffect(() => {
        setRowData(tableData)
    }, [tableData])


    useEffect(() => {
        if (footerContent?.content.length > 1) {
            setFooterStyle({ ...footerStyle, justifyContent: "space-between", ...footerContent?.styles })
        }
        if (headerContent?.content.length > 1) {
            setHeaderStyle({ ...headerStyle, justifyContent: "space-between", ...headerContent?.styles })
        }
    }, [footerContent, footerStyle, headerContent, headerStyle])


    return (
        <>
            {title && <h3 style={{ textAlign: "center" }}> {title}</h3>}
            {
                headerContent?.content?.length > 0 &&
                <div style={{ ...headerStyle, backgroundColor: "blue" }}>
                    {headerContent?.content?.map((data, i) => <p key={i} style={tableDivStyles}>{data}</p>)}
                </div>
            }
            {
                (tableHeader && rowData) &&
                <Box width={"100%"} height={'100%'} style={{ overflow: "auto" }}
                >
                    <Table stickyHeader={true} sx={{ width: "100%" }} aria-label="simple table">
                        <TableBody>

                            <TableRow >
                                {tableHeader.map((data, index) => (
                                    <TableCell sx={{ height: "10px", backgroundColor: '#6ec1e4', paddingLeft: "2.6rem" }} align="left" key={data}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 15, fontSize: "2rem", fontWeight: "600" }} onClick={() => handleSort(data)}>
                                            {data}
                                            {(rowData.length > 1 && uiSchema?.["ui:widgetAttribute"]?.sortingColumns.length) && (uiSchema?.["ui:widgetAttribute"]?.sortingColumns.indexOf(data) != -1) && (
                                                <>
                                                    {order[data] === "desc"
                                                        ?
                                                        <ArrowDownwardOutlined
                                                            style={{ color: "#616161", fontSize: "2rem" }}
                                                            onClick={() => handleSort(data)}
                                                        />
                                                        :
                                                        <ArrowUpwardOutlined
                                                            style={{ color: "#616161", fontSize: "2rem" }}
                                                            onClick={() => handleSort(data)}
                                                        />
                                                    }
                                                </>
                                            )}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>

                            {rowData?.map((tData, tableDataIndex) => (
                                <TableRow key={tableDataIndex} >
                                    {tableHeader?.map((headerKey, index) =>
                                        <TableCell
                                            key={index}
                                            style={{
                                                fontSize: "1.7rem", paddingBottom: "1em", paddingLeft: "2.6rem",
                                                ...(focus?.field === tData?.uuid?.data && focusStyle),
                                                ...(uiSchema?.["ui:widgetStyle"]?.rowStyle && uiSchema?.["ui:widgetStyle"]?.rowStyle[tData?.uuid?.data]),
                                                ...(tData[headerKey]?.styles || {}),
                                                ...(uiSchema?.["ui:widgetStyle"]?.columnStyle && uiSchema?.["ui:widgetStyle"]?.columnStyle[headerKey])
                                            }}
                                            align={"left"}
                                            ref={focus?.field === tData?.uuid?.data ? rowFocus : null}
                                        >
                                            {renderComponent(tData[headerKey], headerKey, tData?.uuid?.data, tableDataIndex)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            }
            {
                footerContent?.content?.length > 0 &&
                <div style={{ ...footerStyle, height: "10%" }}>
                    {footerContent?.content?.map((data, i) => <p key={i} style={tableDivStyles}>{data}</p>)}
                </div>
            }
        </>
    );
}
export default TableLayout;