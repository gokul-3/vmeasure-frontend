import React, { useEffect, useRef, useState } from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from 'react-i18next';

function CommonTable(
  {
    id,
    columnsLength,
    data,
    isAPIFetch = false,
    isLoading = false,
    showBorder = true,
    renderColumns,
    renderHeader,
    rowsPerPage = 20,
    onDataNeed,
    maxHeight = '70vh',
    pagination = false,
    currentPage = 0,
    maxLogSize = 100,
    maxPageCount = 20,
    disableNextButton,
    setCurrentPageInfo
  }
) {

  const page = useRef(-1)
  const loading = useRef(false);
  const tableRows = useRef([]);
  const [tableData, setTableData] = useState({ count: -1, rows: [] })

  const getDataFromAPI = async () => {
    if (tableData.count === -1 ||
      (
        !loading.current &&
        tableData.rows.length !== tableData.count
      )
    ) {

      if (pagination) {
        //clear Prvious loaded for new page
        setTableData({
          count: maxLogSize,
          rows: []
        });
      }

      loading.current = true;
      page.current = pagination ? (currentPage - 1) : page.current + 1;
      const apiData = await onDataNeed(page.current, rowsPerPage);

      if (apiData?.rows) {

        if (pagination) {
          //pagination next button handlers
          tableRows.current = [...apiData.rows];
          disableNextButton((!apiData?.rows || apiData?.rows?.length === 0 || apiData?.rows?.length < rowsPerPage || currentPage === maxPageCount))

          //from to count handler
          let from = 0;
          let to = 0;
          if (apiData?.rows?.length > 0) {
            from = (page.current * rowsPerPage) + 1;
            to = (page.current * rowsPerPage) + (apiData?.rows?.length ?? 0)
          }
          setCurrentPageInfo({ from, to });

        }
        else {
          tableRows.current = [...tableRows.current, ...apiData.rows];
        }

        setTableData({
          count: pagination ? maxLogSize : apiData.count,
          rows: [...tableRows.current]
        });

      }
      loading.current = false;
      timeoutRef.current = null;
    }
  }

  useEffect(() => {
    if (isAPIFetch || pagination) {
      getDataFromAPI()
    } else {
      setTableData(data)
    }
  }, [isAPIFetch, data, pagination, currentPage])

  const timeoutRef = useRef()

  const handleScroll = (e) => {
    if (!pagination && Math.ceil(tableRef.current.offsetHeight + tableRef.current.scrollTop) >= (tableRef.current.scrollHeight - 10)) {
      getDataFromAPI()
    }

  }

  const tableRef = useRef()

  const { t, i18n } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ width: '100%', ...(!showBorder && { border: 'none' }) }}>
      <TableContainer ref={tableRef} sx={{ maxHeight: maxHeight, overflow: 'auto' }} onScroll={handleScroll}>
        <Table id={id} stickyHeader aria-label="sticky table" >
          <TableHead>
            <TableRow>
              {renderHeader()}
            </TableRow>
          </TableHead>
          <TableBody >
            {

              isLoading &&
              <TableCell colSpan={columnsLength} sx={{ textAlign: 'center' }}>
                <CircularProgress />
              </TableCell>
            }
            {
              Boolean(!isLoading && !tableData?.rows?.length) &&
              < TableRow >
                <TableCell colSpan={columnsLength} sx={{ textAlign: 'center' }}>
                  {t('common.message.no_data_found')}
                </TableCell>
              </TableRow>
            }
            {
              tableData?.rows?.map((row, index) => (
                <TableRow key={index}>{renderColumns(row, index)}</TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper >

  )
}

export default CommonTable;
