import React, { useEffect, useState } from "react";
import * as NetworkPortTesting from '../../services/network-port-testing.service';
import { Grid, Typography, IconButton, Paper, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { NetworkPortStatus } from '../../constants/constants'
import { useNavbar } from "../../hooks/useNavbar";

const NetworkTesting = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [disabledNavBar, enabledNavBar] = useNavbar();
    const [isBackClicked, setIsBackClicked] = useState(false);

    /**
     * @return style to mui components
     */
    const style = {
        validation_font: { display: 'flex' },
        status_code: { marginTop: "3%", minWidth: "20%" },
        result_text: { marginTop: "3%", minWidth: "30%" }
    }

    // State Variables
    const [reportsPage, setReportsPage] = useState(true);
    const [networkStatus, setNetworkStatus] = useState({
        validateConnection: NetworkPortStatus.LOADING,
        validateInternet: NetworkPortStatus.LOADING,
        validateForgeCommunication: NetworkPortStatus.LOADING,
        validateWebsocket: NetworkPortStatus.LOADING,
        validateDownloadSpeed: NetworkPortStatus.LOADING,
        validateUploadSpeed: NetworkPortStatus.LOADING,
    });

    const [networkPort, setNetworkPort] = useState({
        networkPing: { port: "Network Ping", statusCode: "NA", statusMsg: "NA" },
        backendService: { port: "NA", statusCode: "NA", statusMsg: "NA" },
        webService: { port: "NA", statusCode: "NA", statusMsg: "NA" },
        remoteDiagosticService: { port: "NA", statusCode: "NA", statusMsg: "NA" },
        otaService: { port: "NA", statusCode: "NA", statusMsg: "NA" }
    })

    /**
     * useEffect to call the all validation function once when enter into this page
     */
    useEffect(() => {
        disabledNavBar()
        validateConnection();
        validateInternet();
        validateForgeCommunication();
        validateWebsocket();
        validateDownloadSpeed();
        validateUploadSpeed()
    }, [])

    const buttonDisabled = () => {
        return (networkStatus.validateConnection === NetworkPortStatus.LOADING ||
            networkStatus.validateInternet === NetworkPortStatus.LOADING ||
            networkStatus.validateForgeCommunication === NetworkPortStatus.LOADING ||
            networkStatus.validateWebsocket === NetworkPortStatus.LOADING ||
            networkStatus.validateDownloadSpeed === NetworkPortStatus.LOADING ||
            networkStatus.validateUploadSpeed === NetworkPortStatus.LOADING)
            || enabledNavBar() //only when all loadings are complete, navbar should be enabled
    }

    // Set opacity for the back Icon
    const getOpacity = () => {
        const opacityValue = buttonDisabled() ? 0.5 : 1
        return { opacity: opacityValue }
    }
    /**
     * @returns availability of internet
     */
    const validateConnection = async () => {
        const result = await NetworkPortTesting.connectionAvailability()
        setNetworkStatus(prev => { return { ...prev, validateConnection: result.status } })
    }

    /**
     * @returns availability of interface (ethernet or wifi) connection
     */
    const validateInternet = async () => {
        const result = await NetworkPortTesting.internetAvailability()
        setNetworkStatus(prev => { return { ...prev, validateInternet: result.status } })
    }

    const validateForgeCommunication = async () => {
        const result = await NetworkPortTesting.forgeCommunication()
        reportPage(result);
    }

    const reportPage = (obj) => {
        if (!obj.status) {
            setNetworkStatus(prev => { return { ...prev, validateForgeCommunication: obj.status } })
        }
        else {
            let internetConnection = obj?.data?.internet_connection
            let backendService = obj?.data?.backend_service
            let webService = obj?.data?.web_service
            let remoteDiagosticService = obj?.data?.remote_diagostic_service
            let otaService = obj?.data?.ota_service

            if (internetConnection?.status) {
                setNetworkPort(prev => ({ ...prev, networkPing: { ...prev.networkPing, statusCode: (internetConnection?.data?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.SUCCESS } }))
            } else {
                setNetworkPort({ ...networkPort, networkPing: { ...networkPort.networkPing, statusCode: (internetConnection?.error?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.FAILURE } })
            }

            if (backendService?.status) {
                setNetworkPort(prev => ({ ...prev, backendService: { ...prev.backendService, port: (backendService?.data?.port || "NA"), statusCode: (backendService?.data?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.SUCCESS } }))
            } else {
                setNetworkPort(prev => ({ ...prev, backendService: { ...prev.backendService, port: (backendService?.error?.port || "NA"), statusCode: (backendService?.error?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.FAILURE } }))
            }

            if (webService?.status) {
                setNetworkPort(prev => ({ ...prev, webService: { ...prev.webService, port: (webService?.data?.port || "NA"), statusCode: (webService?.data?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.SUCCESS } }))
            } else {
                setNetworkPort(prev => ({ ...prev, webService: { ...prev.webService, port: (webService?.error?.port || "NA"), statusCode: (webService?.error?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.FAILURE } }))
            }

            if (remoteDiagosticService?.status) {
                setNetworkPort(prev => ({ ...prev, remoteDiagosticService: { ...prev.remoteDiagosticService, port: (remoteDiagosticService?.data?.port || "NA"), statusCode: (remoteDiagosticService?.data?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.SUCCESS } }))
            } else {
                setNetworkPort(prev => ({ ...prev, remoteDiagosticService: { ...prev.remoteDiagosticService, port: (remoteDiagosticService?.error?.port || "NA"), statusCode: (remoteDiagosticService?.error?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.FAILURE } }))
            }

            if (otaService?.status) {
                setNetworkPort(prev => ({ ...prev, otaService: { ...prev.otaService, port: (otaService?.data?.port || "NA"), statusCode: (otaService?.data?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.SUCCESS } }))
            } else {
                setNetworkPort(prev => ({ ...prev, otaService: { ...prev.otaService, port: (otaService?.error?.port || "NA"), statusCode: (otaService?.error?.HTTPCode || "NA"), statusMsg: NetworkPortStatus.FAILURE } }))
            }

            let status = ((internetConnection.status && backendService.status && webService.status && remoteDiagosticService.status && otaService.status) || false)
            setNetworkStatus(prev => { return { ...prev, validateForgeCommunication: status } })


        }
    }

    /**
     * @returns websocket communication status
     */
    const validateWebsocket = async () => {
        const result = await NetworkPortTesting.websocketCommunication()
        setNetworkStatus(prev => { return { ...prev, validateWebsocket: result.status } })
    }

    /**
     * @returns download speed from forge to device ("MBPS") 
     */
    const validateDownloadSpeed = async () => {
        const result = await NetworkPortTesting.downloadSpeed()
        setNetworkStatus(prev => { return { ...prev, validateDownloadSpeed: result.status ? parseFloat(result?.data?.mbps) : result.status } })
    }

    /**
     * @returns upload speed from device to forge ("MBPS") 
     */
    const validateUploadSpeed = async () => {
        const result = await NetworkPortTesting.uploadSpeed()
        setNetworkStatus(prev => { return { ...prev, validateUploadSpeed: result.status ? parseFloat(result?.data?.mbps) : result.status } })
    }


    useEffect(() => {
        if (isBackClicked) {
            navigate(-1);
        }
    }, [isBackClicked]);
    /**
     * navigate to network main page.
     */
    const handleBack = () => {
        !buttonDisabled() && setIsBackClicked(true);
    }

    /**
     * @returns status symbol component Success Failure or InProgress
     */
    function GetSpeedMetrics({ speed }) {
        if (typeof (speed) == "number") {
            return speed + "" + NetworkPortStatus.MBPS
        } else {
            return <StatusSymbol value={speed} />
        }
    }

    function StatusSymbol({ value }) {
        if (value == true) {
            return <CheckCircleIcon color="success" sx={{ fontSize: "3.6em" }} />
        } else if (value == false) {
            return <CancelIcon color="error" sx={{ fontSize: "3.8em" }} />
        } else {
            return <CircularProgress />
        }
    }

    function ReportStatus({ value }) {
        if (value == NetworkPortStatus.SUCCESS) {
            return <Chip label="Success" color="success" sx={{ fontSize: "0.9em", padding: "0.9em 0.5em" }} />
        }
        else {
            return <Chip label="Failure" color="error" sx={{ fontSize: "0.9em", padding: "0.9em 0.9em" }} />
        }
    }

    /**
     * @return font colour for download & upload speed
     * return "Greeen" if the downloadspeed is higher than 10 MBPS
     * return "Organge" if the downloadspeed is inBetween 5 to 10 MBPS
     * return "Red" if the downloadspeed is lesser than 5 MBPS
     */
    const getInternetSpeedFontColour = (speed) => {
        if (speed >= 10) {
            return 'green';
        } else if (speed >= 5 && speed < 10) {
            return '#D3721D';
        } else {
            return 'red';
        }
    }

    return (
        <Grid container height={"100%"}>
            <Grid container xs={5} height={'8%'}>
                <IconButton
                    size="large"
                    onClick={handleBack}
                // disabled={buttonDisabled()}
                >
                    <ArrowBackIcon color="primary" sx={{ fontSize: '3em', ...getOpacity() }} />
                </IconButton>
                <Typography variant="h3" sx={{ display: 'flex', alignItems: "center", marginTop: "1%" }} >
                    {t('network_page.network_test.network_validator')}
                </Typography>
            </Grid>
            <Grid container item height={'80%'} xs={10} ml={'13em'}>
                <Paper variant="outlined" sx={{ width: '100%', height: '100%' }}>
                    {reportsPage ? <Grid container item xs={12} sx={{ minHeight: "70%" }} mt={'4.9em'} display={'grid'}>
                        <Grid container item xs={6} ml={'27em'} mt={'1.8em'} justifyContent={'space-between'}>
                            <Typography variant="body5" sx={{ ...style.validation_font }}> {t('network_page.network_test.connection_availability')} </Typography>
                            <StatusSymbol value={networkStatus.validateConnection} />
                        </Grid>
                        <Grid container item xs={6} ml={'27em'} mt={'1.8em'} justifyContent={'space-between'}>
                            <Typography variant="body5" sx={{ ...style.validation_font }}> {t('network_page.network_test.internet_availability')} </Typography>
                            <StatusSymbol value={networkStatus.validateInternet} />
                        </Grid>
                        <Grid container item xs={6} ml={'27em'} mt={'1.8em'} justifyContent={'space-between'}>
                            <Typography variant="body5" sx={{ ...style.validation_font }}> {t('network_page.network_test.forge_communication')} </Typography>
                            <StatusSymbol value={networkStatus.validateForgeCommunication} />
                        </Grid>
                        <Grid container item xs={6} ml={'27em'} mt={'1.8em'} justifyContent={'space-between'}>
                            <Typography variant="body5" sx={{ ...style.validation_font }}> {t('network_page.network_test.websocket_communication')} </Typography>
                            <StatusSymbol value={networkStatus.validateWebsocket} />
                        </Grid>
                        <Grid container item xs={6} ml={'27em'} mt={'1.8em'} justifyContent={'space-between'}>
                            <Typography variant="body5" sx={{ ...style.validation_font }}> {t('network_page.network_test.download_speed')} </Typography>
                            <Typography sx={{ fontSize: (typeof networkStatus.validateDownloadSpeed == "number") ? '2.3em' : "", display: 'flex', marginTop: "0.7%", color: getInternetSpeedFontColour(networkStatus.validateDownloadSpeed) }}>
                                <GetSpeedMetrics speed={networkStatus.validateDownloadSpeed} />
                            </Typography>
                        </Grid>
                        <Grid container item xs={6} ml={'27em'} mt={'1.8em'} justifyContent={'space-between'}>
                            <Typography variant="body5" sx={{ ...style.validation_font }}> {t('network_page.network_test.upload_speed')} </Typography>
                            <Typography sx={{ fontSize: (typeof networkStatus.validateUploadSpeed == 'number') ? '2.3em' : "", display: 'flex', marginTop: "0.7%", color: getInternetSpeedFontColour(networkStatus.validateUploadSpeed) }}>
                                <GetSpeedMetrics speed={networkStatus.validateUploadSpeed} />
                            </Typography>
                        </Grid>
                    </Grid> :
                        <Grid container item xs={10} sx={{ minHeight: "70%", marginTop: "4%", marginLeft: "12%" }} display={'flex'} justifyContent={'center'}>
                            <Grid container item xs={10} display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="h3" xs={4} sx={{ minWidth: "30%" }}> {t('network_page.test_result.sub_domain')} </Typography>
                                <Typography variant="h3" xs={4} sx={{ minWidth: "35%" }}> {t('network_page.test_result.status_code')} </Typography>
                                <Typography variant="h3" xs={4} sx={{ minWidth: "28%" }}> {t('network_page.test_result.response_msg')} </Typography>
                            </Grid>
                            <Grid container item xs={10} display={'flex'} justifyContent={'space-between'}>
                                <Typography xs={6} variant="body5" sx={{ ...style.result_text, marginTop: "5%" }}> {networkPort.networkPing.port} </Typography>
                                <Typography xs={2} variant="body5" sx={{ ...style.status_code, marginTop: "5%" }}> {networkPort.networkPing.statusCode} </Typography>
                                <Typography xs={4} variant="body5" sx={{ ...style.result_text, marginTop: "5%" }}> {<ReportStatus value={networkPort.networkPing.statusMsg} />} </Typography>
                            </Grid>
                            <Grid container item xs={10} display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {networkPort.backendService.port} </Typography>
                                <Typography variant="body5" sx={{ ...style.status_code }}> {networkPort.backendService.statusCode} </Typography>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {<ReportStatus value={networkPort.backendService.statusMsg} />} </Typography>
                            </Grid>
                            <Grid container item xs={10} display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {networkPort.webService.port} </Typography>
                                <Typography variant="body5" sx={{ ...style.status_code }}> {networkPort.webService.statusCode} </Typography>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {<ReportStatus value={networkPort.webService.statusMsg} />} </Typography>
                            </Grid>
                            <Grid container item xs={10} display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {networkPort.remoteDiagosticService.port} </Typography>
                                <Typography variant="body5" sx={{ ...style.status_code }}> {networkPort.remoteDiagosticService.statusCode} </Typography>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {<ReportStatus value={networkPort.remoteDiagosticService.statusMsg} />} </Typography>
                            </Grid>
                            <Grid container item xs={10} display={'flex'} justifyContent={'space-between'}>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {networkPort.otaService.port} </Typography>
                                <Typography variant="body5" sx={{ ...style.status_code }}> {networkPort.otaService.statusCode} </Typography>
                                <Typography variant="body5" sx={{ ...style.result_text }}> {<ReportStatus value={networkPort.otaService.statusMsg} />} </Typography>
                            </Grid>
                        </Grid>
                    }
                    <Grid container display={"flex"} justifyContent={"center"} alignContent={"center"}>
                        <Button disabled={buttonDisabled()} variant="contained" sx={{ width: 'auto', height: "8%", fontSize: '2em', margin:"3%"}} display={"flex"} onClick={() => setReportsPage(!reportsPage)}>
                            <Typography variant="body8">
                                {reportsPage ? t('network_page.network_test.reports') : t('network_page.network_test.hide_reports')}
                            </Typography>
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
        </Grid >
    )
}

export default NetworkTesting;
