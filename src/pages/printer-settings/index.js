import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { PageTitle } from "../../components/custom-text-message/page-title";
import PrinterGrid from "./components/printer-grid";
import * as PrinterServices from '../../services/printer.service'
import LoadingDialog from "../../components/dialogs/loading-dialog";
import { EditPrintingOptionsDialog } from "./components/edit-printing-details";
import { AddPrinterDialog } from "./components/add-printer-dialog";
import AddPrinterConfig from "./components/printer-config";
import JobsDialog from "./components/jobs-dialog";
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import usePermission from "../../hooks/usePermission";
import { PermissionModules } from "../../constants";

export default function PrinterSettings({ successCallback, callbackString, isCustomWorkflow = false }) {

  const { t } = useTranslation();
  const [printerList, setPrinterList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showAddPrintersDialog, setShowAddPrintersDialog] = useState(false)
  const [showPrinterConfigDialog, setShowPrinterConfigDialog] = useState(false)
  const [showJobsDialog, setShowJobsDialog] = useState(false)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState({})
  const [printerSettings, setPrinterSettings] = useState({})
  const [avaliablePrinters, setAvaliablePrinters] = useState({})
  const [printerLabel, setPrinterLabel] = useState('')
  const [activeJobs, setActiveJobs] = useState([])
  const [jobPrinter, setJobPrinter] = useState('')
  const [disableCancel, setDisableCancel] = useState(false)
  const [showMsg, setShowMsg] = useState(false)
  const [showDialogMsg, setShowDialogMsg] = useState(false)
  const [showCallBackString, setShowCallBackString] = useState()

  const [dialogErrorResult, setDialogErrorResult] = useState({
    status: false,
    msg: ''
  })

  const [result, setResult] = useState({
    status: false,
    msg: callbackString?.error?.message ?? ''
  })

  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_SYSTEM_UPDATE);


  const handleTestPrint = async (printerName) => {
    resetShowMsg()
    const result = await PrinterServices.printTestPage({ printerName })

    if (result.status) {
      loadPrinters()
    } else {
      setShowMsg(true)
      setResult({
        status: result.status,
        msg: result.error.message
      })
    }
  }

  const deleteConfirmation = (printerName) => {
    resetShowMsg()
    setPrinterLabel(printerName)
    setIsConfirmationDialogOpen(true)
  }

  const handleRemovePrinter = async (isConfirmed) => {
    resetShowMsg()
    setIsConfirmationDialogOpen(false)

    if (!isConfirmed) return;

    const result = await PrinterServices.deletePrinter({ printerName: printerLabel })
    setShowMsg(true)

    setResult({
      status: result.status,
      msg: result.status ? 'printer_deleted_successfully' : result.error.message
    })

    result.status &&
      setTimeout(() => {
        loadPrinters();
      }, 2000);
  }

  const handleActiveJobs = async (printerName) => {
    resetShowMsg()
    setIsLoading(true)
    setDisableCancel(false)

    const result = await PrinterServices.getJobsDetails({
      status: 'not-completed',
      printerName
    })

    setIsLoading(false)

    if (result.status) {
      setShowJobsDialog(true)
      setShowDialogMsg(false)
      setActiveJobs(result.data)
      setJobPrinter(printerName)
      if (!result?.data?.length) {
        setDisableCancel(true)
      }
    } else {
      setShowMsg(true)
      setResult({
        status: result.status,
        msg: result.error.message
      })
    }
  }

  const handleCancelAllJobs = async () => {
    resetShowMsg()
    const result = await PrinterServices.cancelAllJobs({ printerName: jobPrinter })

    if (result.status) {
      handleActiveJobs(jobPrinter)
    } else {
      setShowDialogMsg(true)
      setDialogErrorResult({
        status: result.status,
        msg: result.error.message
      })
    }
  }

  const handleDeleteJob = async (jobId) => {
    resetShowMsg()
    const result = await PrinterServices.deleteJob({ jobId })

    if (result.status) {
      handleActiveJobs(jobPrinter)
    } else {
      setShowDialogMsg(true)
      setDialogErrorResult({
        status: result.status,
        msg: result.error.message
      })
    }
  }

  const handleSetDefultPrinter = async (printerName, index) => {
    resetShowMsg()
    if (!printerList[index].isDefault) {
      setIsLoading(true)
      const result = await PrinterServices.setDefaultPrinter({ printerName });
      setIsLoading(false)

      if (result.status) {
        loadPrinters()
      } else {
        setShowMsg(true)
        setResult({
          status: result.status,
          msg: result.error.message
        })
      }
    }
    isCustomWorkflow && successCallback()
  }

  const handlePrinterSettings = async (printerName) => {
    resetShowMsg()
    setIsLoading(true)

    const result = await PrinterServices.getPrinterOption({ printerName })

    if (result.status) {
      setShowSettingsDialog(true)
      setPrinterSettings(result.data)
    } else {
      setShowMsg(true)
      setResult({
        status: result.status,
        msg: result.error.message
      })
    }
    setIsLoading(false)
  }

  const handlePrinterOptionsSave = async (arg) => {
    resetShowMsg()
    return await PrinterServices.setPrinterOptions(arg)
  }

  const handleAvailablePrintersList = async () => {
    resetShowMsg()
    setIsLoading(true)
    const result = await PrinterServices.getAvailablePrinters()
    if (result.status) {
      result.data.printers.map((printer, index) => {
        printer['name'] = printer["make-and-model"].replace(/ /g, '_')
      })
      setShowAddPrintersDialog(true)
      setAvaliablePrinters(result.data)
    } else {
      setShowMsg(true)
      setResult({
        status: result.status,
        msg: result.error.message
      })
    }
    setIsLoading(false)
  }

  const handleAddPrinter = async (printer) => {
    resetShowMsg()
    setSelectedOption(printer)
    if (printer.class !== 'network') {
      setShowPrinterConfigDialog(true)
      return
    }

    setIsLoading(true)
    const result = await PrinterServices.addNetworkPrinter(printer)
    setIsLoading(false)
    setShowMsg(true)
    setShowAddPrintersDialog(false)

    setResult({
      status: result.status,
      msg: result.status ? 'printer_added_successfully' : result.error.message
    })

    if (result.status) {
      setTimeout(() => {
        loadPrinters();
      }, 2000);
      isCustomWorkflow && successCallback()
    }
  }

  const handleConfigSubmit = async () => {
    resetShowMsg()
    setShowAddPrintersDialog(false)
    setShowPrinterConfigDialog(false)
    setIsLoading(true)
    const result = await PrinterServices.addNewPrinterConfig(selectedOption)
    setIsLoading(false)
    setShowMsg(true)

    setResult({
      status: result.status,
      msg: result.status ? 'printer_added_successfully' : result.error.message
    })

    if (result.status) {
      setTimeout(() => {
        loadPrinters();
      }, 2000);
      isCustomWorkflow && successCallback()
    }
  }

  const loadPrinters = async () => {
    resetShowMsg()
    setIsLoading(true)
    const result1 = await PrinterServices.getConfiguredPrinters()
    setIsLoading(false)
    setResult({
      ...result,
      status: result1.status,
    })

    if (result1.status) {
      const { configuredList } = result1.data
      setPrinterList(configuredList)
    } else {
      setShowMsg(true)
      setResult({
        ...result,
        msg: result1.error.message
      })
    }
  }

  const handleReload = async () => {
    await loadPrinters()
    isCustomWorkflow && successCallback()
  }

  const resetShowMsg = () => {
    setShowMsg(false)
    setShowCallBackString(false)
  }

  useEffect(() => {
    loadPrinters()
    setShowCallBackString(callbackString?.error?.message)
    if (callbackString) {
      setShowMsg(true)
      setResult({
        status: true,
        msg: callbackString.error?.message
      })
    }
  }, [])

  return (
    <>
      {isLoading && <LoadingDialog open={isLoading} />}

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        content={t('configurations.printer_settings.confirmation_dialog.content')}
        title={t('configurations.printer_settings.confirmation_dialog.title')}
        buttonValue={t('configurations.printer_settings.confirmation_dialog.ok')}
        onClose={handleRemovePrinter}
      />

      <Grid container rowSpacing={5} height={'89vh'} py={isCustomWorkflow && 5}>
        <Grid item xs={12} display={'flex'} height={'10%'}>
          <PageTitle
            title={t('configurations.printer_settings.page_title')}
            isBackNavEnabled={!isCustomWorkflow}
          />

          <IconButton disabled={!hasPermission} onClick={handleReload}>
            <RefreshIcon sx={{ fontSize: '3.5em' }} />
          </IconButton>

          <Button variant="contained" sx={{ width: '25%' }} disabled={!hasPermission} onClick={handleAvailablePrintersList}>
            <Typography fontSize={'1.3em'}>{t('configurations.printer_settings.add_printer')}</Typography>
          </Button>

        </Grid>

        <Grid container item height={'90%'}>
          <Paper variant="outlined"
            sx={{
              width: '100%',
              padding: 10,
              height: '90%',
              overflow: 'auto'
            }}>
            {printerList.length ?
              printerList.map((option, index) => (
                <PrinterGrid
                  option={option}
                  index={index}
                  handleTestPrint={handleTestPrint}
                  handleRemovePrinter={deleteConfirmation}
                  handlePrinterSettings={handlePrinterSettings}
                  handleActiveJobs={handleActiveJobs}
                  handleSetDefultPrinter={handleSetDefultPrinter}
                  setShowMsg={setShowMsg}
                  key={option.name}
                />
              )) :
              <Grid container item style={{ height: '100%' }} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                <PrintIcon sx={{ fontSize: 250 }} color="disabled" />
                <Typography variant='h4'>{t('configurations.printer_settings.no_printers')}</Typography>
              </Grid>
            }

            {showSettingsDialog && (
              <EditPrintingOptionsDialog
                printerSettings={printerSettings}
                setPrinterSettings={setPrinterSettings}
                showDialog={showSettingsDialog}
                setShowDialog={setShowSettingsDialog}
                handleSave={handlePrinterOptionsSave}
              />
            )}

            {showAddPrintersDialog && (
              <AddPrinterDialog
                printerDetails={avaliablePrinters}
                showDialog={showAddPrintersDialog}
                setShowDialog={setShowAddPrintersDialog}
                addPrinter={handleAddPrinter}
                handleReload={handleAvailablePrintersList}
              />
            )}

            {showPrinterConfigDialog && (
              <AddPrinterConfig
                showDialog={showPrinterConfigDialog}
                setShowDialog={setShowPrinterConfigDialog}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleSave={handleConfigSubmit}
              />
            )}

            {showJobsDialog && (
              <JobsDialog
                showDialog={showJobsDialog}
                setShowDialog={setShowJobsDialog}
                activeJobs={activeJobs}
                handleCancelAllJobs={handleCancelAllJobs}
                handleDeleteJob={handleDeleteJob}
                disableCancel={disableCancel}
                showDialogMsg={showDialogMsg}
                result={dialogErrorResult}
              />
            )}

          </Paper>
          <Grid container item xs={12} height={'10%'} py={4}>
            {
              showMsg &&
              <SettingsInfoMessage
                isShow={showMsg}
                message={(showCallBackString && callbackString?.error?.message) ? callbackString?.error?.message : `configurations.printer_settings.printer_error.${result.msg}`}
                status={result.status}
                severity={(showCallBackString && callbackString?.error?.type) ? callbackString?.error?.type : null}
              />
            }
          </Grid>
        </Grid>
      </Grid >
    </>

  )
}

