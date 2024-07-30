import React from 'react'
import { Certificates } from '../../constants';
import { useTranslation } from "react-i18next";
import Support from '@mui/icons-material/Done';
import NoSupport from '@mui/icons-material/Close';
import {
    Button,
    Box,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import PopupButton from '../../components/button/popup-button';

function Loader() {
    return (
        <Box sx={{
            width: '100%',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

        }}>
            <CircularProgress sx={{ fontSize: '3em', }} />
        </Box>
    )
}

function UnitSupportTable({ units, ntepUnitList }) {

    const { t } = useTranslation();

    const checkUnitSupportivity = (unit, certification) => {
        if (certification === Certificates.NTEP) return unit?.certifications_support?.includes(Certificates.NTEP)
        return false
    }


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            <Typography variant="body3" fontWeight="bold">
                                {t('units_page.info.unit')}
                            </Typography>
                        </TableCell>
                        <TableCell component="th" align='right'>
                            <Typography variant="body3" fontWeight="bold">
                                NTEP
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {units.map((unit) => (
                        <TableRow key={unit?.id} >
                            <TableCell component="td" scope="row">
                                <Typography variant="body3">
                                    {unit?.label}
                                </Typography>
                            </TableCell>
                            <TableCell component="td" scope="row" align='right'>
                                {checkUnitSupportivity(unit, Certificates.NTEP)
                                    ? <Support color={"success"} fontSize='large' sx={{ stroke: "green", strokeWidth: 1 }} />
                                    : <NoSupport color={"error"} fontSize='large' sx={{ stroke: "#f00", strokeWidth: 1 }} />
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function UnitInfo({ open, closeHandler, units }) {

    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            onClose={closeHandler}
            sx={{
                padding: "30px"
            }}
        >
            <DialogContent>
                <DialogTitle id="alert-dialog-title">
                    {t('units_page.info.title')}
                </DialogTitle>
                {
                    units.length > 0
                        ? <UnitSupportTable units={units} />
                        : <Loader />
                }

                <DialogActions sx={{ marginTop: '20px' }}>
                    <PopupButton
                        onClick={closeHandler}
                        text={t('common.button.close')}
                        fontSize="body3"
                        minWidth="22%"
                    />
                </DialogActions>
            </DialogContent>

        </Dialog>
    )
}

export default UnitInfo