import {
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  Button,
  Grid,
  DialogContent,
  Select,
  FormControl,
  MenuItem,
  Alert,
  IconButton,
  TextField,
  Divider,
} from '@mui/material'
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import usePermission from '../../../hooks/usePermission';
import { PermissionModules } from '../../../constants';

export function EditPrintingOptionsDialog({ printerSettings, setPrinterSettings, showDialog, setShowDialog, handleSave }) {
  const { t } = useTranslation()
  const [selectedOptions, setSelectedOptions] = useState({})
  const [showMsg, setShowMsg] = useState(false)
  const [result, setResult] = useState({ status: '', msg: '' })
  const [enableButton, setEnableButton] = useState(false)
  const [isCustomPageSize, setIsCustomPageSize] = useState(false)
  const [customSizeUnits, setCustomSizeUnits] = useState('')
  const [customSizeValue, setCustomSizeValue] = useState({
    width: '',
    height: '',
    unit: ''
  })
  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_SYSTEM_UPDATE);

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick') {
      event.stopPropagation()
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const isChangesMade = (newConfig) => {

    for (const option of printerSettings.options) {
      const key = option.key;
      const oldValue = option.defaultValue;
      const newValue = newConfig[key];

      if (oldValue !== newValue) {
        setEnableButton(true)
        return;
      }
    }
    setEnableButton(false)
  }

  const handleOptionsChange = event => {
    setShowMsg(false)
    const { name, value } = event.target;

    const prevOptions = selectedOptions
    prevOptions[name] = value

    if (name === 'PageSize') {
      if (value.startsWith('Custom')) {
        const [, combinedValue] = value.split('.')
        const [width, hunit] = combinedValue.split('x')
        const height = hunit.slice(0, -2)
        const unit = hunit.slice(-2)

        setCustomSizeValue({
          width: width,
          height: height,
          unit: unit
        })
        setIsCustomPageSize(true)
      } else {
        setIsCustomPageSize(false)
      }
    }

    isChangesMade(prevOptions)

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [name]: value,
    }));
  }

  const handleCustomSizePage = (e) => {
    setShowMsg(false)
    setCustomSizeValue({
      ...customSizeValue,
      [e.target.name]: e.target.value
    })

    let reqCustomValue

    if (e.target.name === 'width') {
      reqCustomValue = `Custom.${e.target.value}x${customSizeValue.height}${customSizeValue.unit}`
    } else if (e.target.name === 'height') {
      reqCustomValue = `Custom.${customSizeValue.width}x${e.target.value}${customSizeValue.unit}`
    } else {
      reqCustomValue = `Custom.${customSizeValue.width}x${customSizeValue.height}${e.target.value}`
    }

    let newOptions = { ...selectedOptions }
    newOptions['PageSize'] = reqCustomValue

    isChangesMade(newOptions)

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      ['PageSize']: reqCustomValue,
    }));

    const pageSizeIndex = printerSettings.options.findIndex(option => option.key === "PageSize");
    const updatedOptions = [...printerSettings.options];

    updatedOptions[pageSizeIndex].values = updatedOptions[pageSizeIndex].values.map(option => {
      if (option.label === "Custom") {
        return {
          value: reqCustomValue,
          label: "Custom"
        };
      }
      return option;
    });

    setPrinterSettings(prevState => ({
      ...prevState,
      options: updatedOptions
    }));
  };

  const GeneralSettings = arg => {

    return (
      <>
        {printerSettings?.options?.map((option, index) => (
          <Grid
            container
            item
            xs={12}
            display={'flex'}
            justifyContent='center'
            padding={4}
            spacing={2}
            key={option.key}
          >
            <Grid container item xs={6}>
              <Typography variant='body5' display={'flex'} alignItems={'center'}>
                {option.name}
              </Typography>
            </Grid>
            <Grid container item xs={6}>
              <FormControl sx={{ m: 1, width: '100%' }}>
                <Select
                  name={option.key}
                  value={selectedOptions?.[option.key] || ''}
                  onChange={handleOptionsChange}
                  disabled={!hasPermission}
                >
                  {option.key === 'PageSize' ?
                    option.values.map((valueObj, index) => (
                      <MenuItem key={valueObj.value} value={valueObj.value}>
                        {valueObj.label}
                      </MenuItem>
                    )) :
                    option.values.map((value, index) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            {option.key === 'PageSize' && isCustomPageSize &&
              <Grid container item xs={12}
                display={'flex'}
                justifyContent='center'
              >
                <Grid container
                  display={'flex'}
                  justifyContent={'center'}
                >
                  <Grid item xs={6} paddingTop={2} m={'auto'}>
                    <Typography variant='body5' display={'flex'} alignItems={'center'}>
                      {t('configurations.printer_settings.width')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} p={2}>
                    <TextField
                      name='width'
                      type='number'
                      sx={{ fontSize: '2.5em', width: '80%' }}
                      value={customSizeValue.width}
                      onChange={(e) => handleCustomSizePage(e)}
                    />
                  </Grid>
                </Grid>

                <Grid container
                  display={'flex'}
                  justifyContent={'center'}
                >
                  <Grid item xs={6} paddingTop={2} m={'auto'}>
                    <Typography variant='body5' display={'flex'} alignItems={'center'}>
                      {t('configurations.printer_settings.height')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} p={2}>
                    <TextField
                      name='height'
                      type='number'
                      sx={{ fontSize: '2.5em', width: '80%' }}
                      value={customSizeValue.height}
                      onChange={(e) => handleCustomSizePage(e)}
                    />
                  </Grid>
                </Grid>

                <Grid container
                  display={'flex'}
                  justifyContent={'center'}
                >
                  <Grid item xs={6} paddingTop={2} m={'auto'}>
                    <Typography variant='body5' display={'flex'} alignItems={'center'}>
                      {t('configurations.printer_settings.unit')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} p={2}>
                    <FormControl sx={{ width: '80%' }}>
                      <Select
                        name={'unit'}
                        value={customSizeValue.unit}
                        onChange={(e) => handleCustomSizePage(e)}
                      >
                        {
                          customSizeUnits.map((valueObj, index) => (
                            <MenuItem key={valueObj.value} value={valueObj.value}>
                              {valueObj.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            }
          </Grid>
        ))}
      </>
    )
  }

  const handleDialogSave = async () => {

    if (isCustomPageSize) {
      if (!(customSizeValue.width && customSizeValue.height)) {
        setShowMsg(true)
        setResult({
          status: false,
          msg: "please_fill_width_and_height"
        })
        return
      }
    }

    const arg = {
      oldConfig: printerSettings,
      newConfig: selectedOptions
    }

    const result = await handleSave(arg)
    setShowMsg(true)
    setResult({
      ...result,
      status: result.status,
      msg: result.status ? 'data_saved_successfully' : 'something_went_wrong'
    })
    result.status && setTimeout(handleClose, 2000);
  }

  const setInitialSelectedOptions = () => {
    const defaultOptions = {}
    printerSettings.options.map((option, key) => {
      if (option.isCustomDefault) {
        const [, combinedValue] = option.defaultValue.split('.')
        const [width, hunit] = combinedValue.split('x')
        const height = hunit.slice(0, -2)
        const unit = hunit.slice(-2)

        setCustomSizeValue({
          width: width,
          height: height,
          unit: unit
        })
        setIsCustomPageSize(true)
      }
      defaultOptions[option.key] = option.defaultValue
    })


    setSelectedOptions(defaultOptions)
  }

  useEffect(() => {
    setInitialSelectedOptions()
    setCustomSizeUnits(printerSettings.units.unitOptions)
  }, [])

  return (
    <Dialog
      open={showDialog}
      maxWidth='md'
      fullWidth
      disableEscapeKeyDown
      onClose={(event, reason) => handleDialogClose(event, reason)}
    >
      <DialogTitle
        id='alert-dialog-title'
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant='h3' sx={{ margin: 'auto' }}>{t('configurations.printer_settings.edit_option')}</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon sx={{ fontSize: 60 }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2, height: '75vh' }}>
        <GeneralSettings />
      </DialogContent>
      <DialogActions sx={{ padding: 6, }}>
        <Grid container item xs={12} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={8}>
            {showMsg &&
              <Alert severity={result.status ? 'success' : 'warning'} variant='standard' sx={{ padding: 0, fontSize: '2.4em' }}>
                {t(`configurations.printer_settings.printer_error.${result.msg}`)}
              </Alert>
            }
          </Grid>
          <Grid item display='flex' justifyItems={'flex-end'} paddingRight={15}>
            <Button
              variant='contained'
              onClick={() => handleDialogSave()}
              disabled={!enableButton}
              sx={{ fontSize: '2.5em', width: '5em', height: '2em' }}
            >
              {showMsg && result.status ? t(`configurations.printer_settings.saved`) : t('common.button.save')}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
