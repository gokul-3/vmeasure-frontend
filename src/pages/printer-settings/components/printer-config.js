import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Dialog,
  Select,
  DialogTitle,
  IconButton,
  MenuItem,
  FormControl,
  FormControlLabel,
  DialogContent,
  Alert,
  Button,
  Divider,
  Checkbox,
} from "@mui/material";
import { useTranslation, Trans } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import * as PrinterService from "../../../services/printer.service"

export default function AddPrinterConfig({
  showDialog,
  setShowDialog,
  selectedOption,
  setSelectedOption,
  setIsLoading,
  handleSave
}) {

  const { t } = useTranslation();
  const [manufacturers, setManufacturers] = useState([])
  const [isRequiredFilled, setIsRequiredFilled] = useState(true)
  const [drivers, setDrivers] = useState([])

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick') {
      event.stopPropagation()
    } else {
      setShowDialog(false)
    }
  }

  const selectStyles = {
    textField: {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      paddingRight: 4,
      fontSize: '2em'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      paddingRight: 4,
    },
  }

  const loadAvailableManufacturer = async () => {
    setIsLoading(true)
    const result = await PrinterService.getAvailableManufacturer()
    if (result.status) {
      setManufacturers(result.data.manufacturers)
    }
    setIsLoading(false)
  }

  const loadAvailableDrivers = async (value) => {
    const result = await PrinterService.getAvailableDrivers(value)
    if (result.status) {
      setDrivers(result.data)
    }
    setIsLoading(false)
  }

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setIsRequiredFilled(true);

    if (name) {
      setSelectedOption({
        ...selectedOption,
        [name]: name === 'isDefault' ? checked : value
      });
    }

    if (name === 'make') {
      setIsLoading(true);
      loadAvailableDrivers({ make: value, deviceId: selectedOption["device-id"] });
    }
  }

  const handleConfigSave = () => {
    if (selectedOption?.name &&
      selectedOption['make-and-model'] &&
      selectedOption.driver) {
      setIsRequiredFilled(true)
      handleSave()
    } else {
      setIsRequiredFilled(false)
    }
  }

  useEffect(() => {
    loadAvailableManufacturer()
    loadAvailableDrivers({ make: selectedOption.make, deviceId: selectedOption["device-id"] })
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
        <Typography sx={{ margin: 'auto' }} variant="h3">
          {t('configurations.printer_settings.page_title')}
        </Typography>

        <IconButton onClick={() => setShowDialog(false)}>
          <CloseIcon sx={{ fontSize: '2.5em' }} />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 10, }}>
        <Grid
          container
          item
          xs={12}
          height={'100%'}
          margin={'auto'}
          gap={10}
        >
          <Grid container item xs={12}>
            <Grid item xs={4} sx={selectStyles.label}>
              <Typography variant='body5'>
                <Trans
                  i18nKey="configurations.printer_settings.name"
                  components={[
                    <b></b>,
                    <span style={{ color: 'red' }}></span>,
                  ]}
                />
              </Typography>
            </Grid>
            <Grid item xs={8} sx={selectStyles.textField}>
              <TextField id="outlined-basic" variant="outlined"
                name="name"
                sx={{ fontSize: '1.4em' }}
                value={selectedOption.name}
                required={true}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={4} sx={selectStyles.label}>
              <Typography variant='body5'>
                {t('configurations.printer_settings.description')}
              </Typography>
            </Grid>
            <Grid item xs={8} sx={selectStyles.textField}>
              <TextField id="outlined-basic" variant="outlined"
                name="info"
                sx={{ fontSize: '1.4em' }}
                value={selectedOption.info}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={4} sx={selectStyles.label}>
              <Typography variant='body5'>
                {t('configurations.printer_settings.location')}
              </Typography>
            </Grid>
            <Grid item xs={8} sx={selectStyles.textField}>
              <TextField id="outlined-basic" variant="outlined"
                name="location"
                sx={{ fontSize: '1.4em' }}
                value={selectedOption.location}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={4} sx={selectStyles.label}>
              <Typography variant='body5'>
                {t('configurations.printer_settings.connection')}
              </Typography>
            </Grid>
            <Grid item xs={8} sx={selectStyles.label}>
              <Typography variant='body5'>
                {selectedOption.uri}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={4} sx={selectStyles.label}>
              <Typography variant='body5'>
                {t('configurations.printer_settings.set_as_default')}
              </Typography>
            </Grid>
            <Grid item xs={8} sx={selectStyles.label}>
              <FormControlLabel control=
                {<Checkbox name='isDefault' onChange={handleChange}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
                />}
                label={
                  <Typography variant='body5'>
                    {t('configurations.printer_settings.use_printer_by_default')}
                  </Typography>} />
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={4} sx={selectStyles.label}>
              <Typography variant='body5'>
                <Trans
                  i18nKey="configurations.printer_settings.make"
                  components={[
                    <b></b>,
                    <span style={{ color: 'red' }}></span>,
                  ]}
                />
              </Typography>
            </Grid>
            <Grid item xs={8} alignItems={'center'}>
              <FormControl sx={{ m: 1, width: '96%' }} >
                <Select
                  name='make'
                  value={selectedOption?.make || ''}
                  onChange={handleChange}
                  sx={{ fontSize: '2em' }}
                >
                  {
                    manufacturers.map((make) => (
                      <MenuItem key={make} value={make} > {make} </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={4} sx={selectStyles.label}>
              <Typography variant='body5'>
                <Trans
                  i18nKey="configurations.printer_settings.model"
                  components={[
                    <b></b>,
                    <span style={{ color: 'red' }}></span>,
                  ]}
                />
              </Typography>
            </Grid>
            <Grid item xs={8} alignItems={'center'}>
              <FormControl sx={{ m: 1, width: '96%' }}>
                <Select
                  name='driver'
                  value={selectedOption?.driver || ''}
                  onChange={handleChange}
                  sx={{ fontSize: '2em' }}
                >
                  {
                    drivers.map((driver) => (
                      <MenuItem key={driver.driver} value={driver.driver}> {driver.name} </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid container item display={'flex'} paddingTop={10} paddingRight={5}
          xs={12} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={8} sx={{ minHeight: '2em' }}>
            {
              !isRequiredFilled &&
              <Alert severity="warning" sx={{ padding: 2, fontSize: '2.6em' }}>
                {t('configurations.printer_settings.fill_required_fields')}
              </Alert>
            }
          </Grid>
          <Grid item display='flex' justifyItems={'flex-end'}>
            <Button
              variant="contained"
              sx={{ fontSize: '2.5em', width: '5em', height: '2.5em' }}
              onClick={handleConfigSave}
            >
              {t('common.button.save')}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog >
  )
} 