import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  IconButton
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Icons from '../../components/ultima-icons'
import NotificationIcon from '@mui/icons-material/Error';
import softwareUpdate from "../../redux/reducers/software-update";
import { useSelector, useDispatch } from "react-redux";
import { checkForUpdates } from "../../services/software-update.service";
import { MenuItems } from "../../components/menu-items";
import { t } from "i18next";

function MenuPage() {

  const dispatch = useDispatch();
  const { pairedStatus } = useSelector(state => state.deviceAPI);
  const { device_test_modes } = useSelector((state) => state.applicationState);
  const { is_update_available } = useSelector(state => state.softwareUpdate);

  const [page, setPage] = useState(0)
  const handleNextPageNavigation = () => {
    setPage(1);
  }

  const handlePrevPageNavigation = () => {
    setPage(0);
  }

  const doCheckForUpdates = async () => {
    let updateData = await checkForUpdates();
    dispatch(softwareUpdate.actions.updateIsUpdateAvailable({ is_update_available: updateData?.data?.is_update_available }))
  }

  useEffect(() => {
    doCheckForUpdates();
  }, []);

  const { workflow } = useSelector((state) => state.workflow);

  return (<>

    <Box display={'flex'} sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ width: '7%', visibility: 'hidden' }}>
        <Grid container sx={{ height: '100%' }} display={'flex'} >
          <IconButton aria-label="delete" size="large" onClick={handlePrevPageNavigation} sx={{ margin: 'auto' }} >
            <ArrowBackIosNewIcon color={'primary'} sx={{ fontSize: '4em' }} />
          </IconButton>
        </Grid>
      </Box>
      <Box sx={{ width: '86%', height: '100%', }} >
        <Grid container sx={{ height: '100%', }}>
          <MenuItems
            Icon={Icons.CalibrationWhiteIcon}
            title={t('menu.calibration')}
            href={'/menu/calibration'}
          />
          <MenuItems
            Icon={Icons.UnitWhiteIcon}
            title={t('menu.units')}
            href={'/menu/units'}
          />
          <MenuItems
            Icon={Icons.ScaleWhiteIcon}
            title={t('menu.scale')}
            href={'/menu/scale'}
          />

          <MenuItems
            Icon={Icons.NetworkWhiteIcon}
            title={t('menu.network')}
            href={'/menu/network'}
          />
          <MenuItems
            Icon={Icons.UpdateWhiteIcon}
            title={t('menu.update')}
            href={'/menu/update'}
            PrefixIcon={is_update_available ? NotificationIcon : null}
            disabled={device_test_modes.is_endurance_testing_enabled}
          />
          <MenuItems
            Icon={Icons.BarcodeWhiteIcon}
            title={t('menu.barcode')}
            href={'/menu/barcode'}
          />
          <MenuItems
            Icon={Icons.ReferenceBoxWhiteIcon}
            title={t('menu.reference_box')}
            href={'/menu/reference-box'}
            disabled={!workflow?.measurement_check?.is_enabled}
          />
          <MenuItems
            Icon={Icons.ConfigurationWhiteIcon}
            title={t('menu.configuration')}
            href={'/menu/configuration'} />
          <MenuItems
            Icon={Icons.TrayAppWhiteIcon}
            title={t('menu.desktop_app')}
            href={'/menu/desktop-app'}
            disabled={!pairedStatus}
          />
        </Grid>
      </Box>
      <Box sx={{ width: '7%', visibility: 'hidden' }}>
        <Grid container sx={{ height: '100%' }} display={'flex'} >
          <IconButton aria-label="delete" size="large" onClick={handleNextPageNavigation} sx={{ margin: 'auto' }} >
            <ArrowForwardIosIcon color={'primary'} sx={{ fontSize: '4em' }} />
          </IconButton>
        </Grid>
      </Box>
    </Box>

  </>)
}

export default MenuPage;
