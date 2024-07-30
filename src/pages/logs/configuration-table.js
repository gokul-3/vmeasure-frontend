import * as React from 'react';
import { useState, useEffect } from 'react';
import CommonTable from '../../components/table/common-table';
import { useTranslation } from 'react-i18next';
import { getSystemConfigLogRecords } from '../../services/logs.service';
import { Grid, Paper, Box } from '@mui/material';
import TableBodyCell from '../../components/table/table-body-cell';
import TableHeaderCell from '../../components/table/table-header-cell';
import PendingDataPair from './components/pendig-data-pair';
import { useTheme } from '@emotion/react';
import { useSelector } from "react-redux";
import Pagination from '../../components/pagination/pagination';
import { Certificates } from '../../constants';

function JsonTOList({ jsonDiffObj, fields_changed, text_color }) {

    const [jsonData, setJsonData] = useState({});
    const { t } = useTranslation();
    const customFieldValues = {
        dhcp: "DHCP",
        none: "None",
        spanish: "Spanish",
        english: "English",
        static: "Static"
    }

    //filter out only changed fields
    useEffect(() => {
        if (jsonDiffObj) {
            setJsonData(() => {
                return Object.fromEntries(
                    Object.entries(jsonDiffObj)
                        .filter(([key]) => fields_changed.split(",").includes(key))
                );
            });
        }
    }, [jsonDiffObj])


    const handleCustomFieldValues = (value) => {
        return customFieldValues.hasOwnProperty(value) ? customFieldValues[value] : value
    }

    const parseFieldValue = (fieldName) => {
        return <span style={{ color: text_color, fontWeight: 'bold' }}>
            {
                (fieldName && jsonData[fieldName])
                    ? handleCustomFieldValues(jsonData[fieldName].toString())
                    : 'NA'
            }
        </span>
    }

    return (
        <>
            {
                Object.keys(jsonData).length === 0
                    ? "NA"
                    : <ul style={{ textAlign: 'left' }}>
                        {Object.keys(jsonData).map((fieldName, index) => {
                            return <li key={index}>
                                {t(`logs_page.configuration.fields.${fieldName}`)} : {parseFieldValue(fieldName)}
                            </li>
                        })}
                    </ul>
            }
        </>
    )



}


export default function SystemConfigLogTable() {

    const { t } = useTranslation();
    const theme = useTheme();
    const { metrological_setting } = useSelector(state => state.settings.metrological);
    const isNTEP = (metrological_setting === Certificates.NTEP)

    const rowsPerPage = isNTEP ? 50 : 10;
    const maxLogSize = isNTEP ? 1000 : 100;
    const maxPageCount = Math.ceil(maxLogSize / rowsPerPage);

    const [isSystemConfigDataLoading, setIsSystemConfigDataLoading] = useState(false);
    const [paginationRequired] = useState(metrological_setting === Certificates.NTEP);
    const [page, setPage] = useState(1);
    const [disablePreviousButton, setDisablePreviousButton] = useState(true);
    const [currentPageInfo, setCurrentPageInfo] = useState({ from: 1, to: rowsPerPage })
    const [disableNextButton, setDisableNextButton] = useState(false);
    const [systemConfigPendingData, setSystemConfigPendingData] = useState({ system_config_records: 0 });


    const renderHeader = (data) => {
        return (
            <>
                <TableHeaderCell>{t('logs_page.configuration.table.config_id')}</TableHeaderCell>
                <TableHeaderCell>{t('logs_page.configuration.table.setting_group')}</TableHeaderCell>
                <TableHeaderCell>{t('logs_page.configuration.table.previous_value')}</TableHeaderCell>
                <TableHeaderCell>{t('logs_page.configuration.table.current_value')}</TableHeaderCell>
                <TableHeaderCell>{t('logs_page.configuration.table.updated_user_name')}</TableHeaderCell>
                <TableHeaderCell>{t('logs_page.configuration.table.modified_at')}</TableHeaderCell>
            </>
        )
    }

    const renderColumn = (data) => {
        return (
            <>
                <TableBodyCell>{data['config_id']}</TableBodyCell>
                <TableBodyCell>{t(`logs_page.configuration.settting_group.${data['setting_group']}`)}</TableBodyCell>
                <TableBodyCell><JsonTOList jsonDiffObj={data['previous_data']} fields_changed={data['fields_changed']} text_color={theme.palette.primary.main} /></TableBodyCell>
                <TableBodyCell><JsonTOList jsonDiffObj={data['current_data']} fields_changed={data['fields_changed']} text_color={'green'} /></TableBodyCell>
                <TableBodyCell>{data['creator_name']}</TableBodyCell>
                <TableBodyCell>{data['modified_at']}</TableBodyCell>
            </>
        )
    }

    const handleOnDataNeed = async (page, rowsPerPage) => {
        let result = { rows: [] };
        setIsSystemConfigDataLoading(true);
        try {
            result = await getSystemConfigLogRecords(page, rowsPerPage);
            setSystemConfigPendingData(result.pending_count);
        } catch (error) {
            console.error("Error in handleOnDataNeed function", JSON.stringify(error))
        }
        setIsSystemConfigDataLoading(false);
        return result;
    }


    const nextPageHandler = () => {
        const currentPage = page + 1;
        setIsSystemConfigDataLoading(true);
        setDisableNextButton(currentPage === maxPageCount)
        setDisablePreviousButton(false)
        setPage(currentPage)
    }

    const previousPageHandler = () => {
        const currentPage = page - 1;
        setIsSystemConfigDataLoading(true);
        setDisablePreviousButton(currentPage === 1)
        setDisableNextButton(true)
        setPage(currentPage)
    }

    return (
        <Grid container direction="row" alignItems="center" height={'100%'}>
            <Grid container item xs={12} alignItems="center" height={'15%'} paddingBottom={5}>
                <Paper variant='outlined' sx={{ width: '100%', height: '100%', padding: 4 }}>
                    <Grid container item xs={12} rowSpacing={4} >
                        <Grid item xs={8}>
                            <PendingDataPair
                                label={t('logs_page.configuration.pending.records')}
                                value={systemConfigPendingData?.system_config_records}
                                autowidth
                            />
                        </Grid>
                        <Grid container xs={4} justifyContent={"flex-end"} alignItems={"center"} marginTop={3}>
                            {
                                paginationRequired && <Pagination
                                    page={page}
                                    height={'100%'}
                                    disablePreviousButton={disablePreviousButton || isSystemConfigDataLoading}
                                    disableNextButton={disableNextButton || isSystemConfigDataLoading}
                                    nextPageHandler={nextPageHandler}
                                    previousPageHandler={previousPageHandler}
                                    rowsPerPage={rowsPerPage}
                                    currentPageInfo={currentPageInfo}
                                    isLoading={isSystemConfigDataLoading}
                                />
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} alignItems="center">
                <Box sx={{ width: '90vw' }}>
                    <CommonTable
                        id="system-configuration-table"
                        columnsLength={7}
                        isAPIFetch={true}
                        rowsPerPage={rowsPerPage}
                        onDataNeed={handleOnDataNeed}
                        isLoading={isSystemConfigDataLoading}
                        renderColumns={renderColumn}
                        renderHeader={renderHeader}
                        pagination={paginationRequired}
                        currentPage={page}
                        maxLogSize={maxLogSize}
                        maxPageCount={maxPageCount}
                        disableNextButton={setDisableNextButton}
                        setCurrentPageInfo={setCurrentPageInfo}
                        maxHeight={'63vh'}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}