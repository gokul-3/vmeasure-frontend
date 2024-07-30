import MainLayout from '../layouts/MainLayout';
import MenuPage from '../pages/menu';

import CalibrationPage from '../pages/calibration/calibration-page';
import BarcodePage from '../pages/barcode/barcode-page';
import NetworkPage from '../pages/network/network-page';
import ScalePage from '../pages/scales/scale-page';
import TimezonePage from '../pages/configuration/timezone-config';
import UnitsPage from '../pages/units/units-page';
import UpdatePage from '../pages/update';
import ReferenceBoxPage from '../pages/reference-box/reference-box-page';
import ConfigurationPage from '../pages/configuration/configuration-page';
import MeasurementConfigurationPage from '../pages/configuration/measurement-settings';
import CalibrationConfigurationPage from '../pages/configuration/calibration-settings';
import LanguageSettings from '../pages/configuration/language-settings';
import PrinterSettings from '../pages/printer-settings';
import Ethernet from '../pages/network/ethernet'
import Wifi from '../pages/network/wifi';
import ProxySettings from "../pages/network-proxy/network-proxy";

import { Navigate } from 'react-router-dom';
import SystemInfoPage from '../pages/system-info/information-page';
import LogsPage from '../pages/logs/logs-page';
import LogoutPage from '../pages/logout/logout-page';

import MeasurementPage from '../pages/measurement/measurement-master-page';
import DesktopAppPage from '../pages/desktop-app/desktop-app.page';

import NetworkTesting from '../pages/networkTesting/networkTesting-page'
import ErrorBoundary from '../components/error-boundary/error-boundary';
import NtpServer from '../pages/ntp-server/ntp-server'

import CustomWorkflow from '../pages/custom-flow/';
import { useSelector } from 'react-redux';


const MeasureFlowHandler = () => {
    const { customServiceInfo } = useSelector(state => state.customFlow)
    return <>
        {
            customServiceInfo.isAvailable
                ? <CustomWorkflow />
                : <MeasurementPage />
        }
    </>
}

const routes = [{
    path: "/",
    element: <MainLayout />,
    children: [
        { path: "/", element: <Navigate to='/menu' /> },
        { path: "/menu", element: <MenuPage /> },
        { path: "/menu/calibration", element: <CalibrationPage /> },
        { path: "/menu/units", element: <UnitsPage /> },
        { path: "/menu/scale", element: <ScalePage /> },
        { path: "/menu/network", element: <NetworkPage /> },
        { path: "/menu/network/ethernet", element: <Ethernet /> },
        { path: "/menu/network/wifi", element: <Wifi /> },
        { path: "/menu/network/network-testing", element: <NetworkTesting /> },
        { path: "/menu/network/ntp-server", element: <NtpServer /> },
        { path: "/menu/network/proxy-server", element: <ProxySettings/>},

        { path: "/menu/update", element: <UpdatePage /> },
        { path: "/menu/backup", element: <BarcodePage /> },
        { path: "/menu/barcode", element: <BarcodePage /> },
        { path: "/menu/reference-box", element: <ReferenceBoxPage /> },
        { path: "/menu/configuration", element: <ConfigurationPage /> },

        { path: "/menu/configuration/measurement", element: <MeasurementConfigurationPage /> },
        { path: "/menu/configuration/calibration", element: <CalibrationConfigurationPage /> },
        { path: "/menu/configuration/timezone", element: <TimezonePage /> },
        { path: "/menu/configuration/language", element: <LanguageSettings />},
        { path: "/menu/configuration/printer", element: <PrinterSettings />},
        { path: "/menu/configuration/custom-configuration", element:<CustomWorkflow isConfigPage={true} />},
        { path: "/menu/desktop-app", element: <DesktopAppPage /> },
        { path: "/menu/private-apps", element: <BarcodePage /> },

        { path: "/logs", element: <LogsPage /> },
        { path: "/measurement", element: <ErrorBoundary><MeasureFlowHandler /></ErrorBoundary> },
        { path: "/info", element: <SystemInfoPage /> },
        { path: "/logout", element: <LogoutPage /> },
        { path: '/*', element: <Navigate to='/menu' /> }
    ]
}]


export default routes;
