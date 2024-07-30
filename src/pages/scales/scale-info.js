import React, { useEffect, useState } from 'react'
import * as scaleServices from "../../services/scale.service";
import { Certificates, WeighingScaleReqType } from '../../constants';
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

function ScaleSupportTable({ overallScaleList, ntepScaleList }) {

    const checkScaleSupportivity = (scale, certification) => {
        if (certification === Certificates.NTEP) return ntepScaleList.includes(scale)
        return false
    }

    const { t } = useTranslation();

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 850 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell component="th" style={{ fontWeight: 'bold' }}>
                            <Typography variant="body3" fontWeight="bold">
                                {t('scale_page.scale')}
                            </Typography>
                        </TableCell>
                        <TableCell component="th" style={{ fontWeight: 'bold' }} align='right'>
                            <Typography variant="body3" fontWeight="bold">
                                NTEP
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {overallScaleList.map((scale) => (
                        <TableRow key={scale} >
                            <TableCell component="td" scope="row">
                                <Typography variant="body3">
                                    {scale}
                                </Typography>
                            </TableCell>
                            <TableCell component="td" scope="row" align='right'>
                                {checkScaleSupportivity(scale, Certificates.NTEP)
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

function ScaleInfo({ open, closeHandler }) {

    const [ntepScaleList, setNtepScaleList] = useState([]);
    const [overallScaleList, setOverallScaleList] = useState([]);
    const { t } = useTranslation();

    const loadOverallScaleList = async () => {
        const result = await scaleServices.getScaleList({ type: WeighingScaleReqType.ALL_SCALE }); //get all scales
        if (result.status) {
            setOverallScaleList(result.data.rows);
        }
    }

    const loadNtepSuportScaleList = async () => {
        const result = await scaleServices.getScaleList({ type: WeighingScaleReqType.CERTIFICATE_BASED, certificate: Certificates.NTEP })
        if (result.status) {
            setNtepScaleList(result.data.rows);
        }
    }

    useEffect(() => {
        loadOverallScaleList();
        loadNtepSuportScaleList();
    }, [])

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
                    {t('scale_page.info.title')}
                </DialogTitle>
                {
                    overallScaleList.length > 0
                        ? <ScaleSupportTable overallScaleList={overallScaleList} ntepScaleList={ntepScaleList} />
                        : <Loader />
                }

                <DialogActions sx={{ marginTop: '20px' }}>
                    <Button onClick={closeHandler} variant="contained">
                        <Typography variant="body3">
                            {t('common.button.close')}
                        </Typography>
                    </Button>
                </DialogActions>
            </DialogContent>

        </Dialog>
    )
}

export default ScaleInfo