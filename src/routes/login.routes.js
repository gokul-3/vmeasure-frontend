import AuthLayout from "../layouts/Auth"
import { Navigate } from 'react-router-dom';
import OperatorPage from '../pages/operators/operator-page';
import LoginPage from '../pages/auth/login-page';
import NetworkPage from '../pages/network/network-page';
import Ethernet from '../pages/network/ethernet';
import Wifi from '../pages/network/wifi';
import NetworkTesting from '../pages/networkTesting/networkTesting-page'
import NtpServer from '../pages/ntp-server/ntp-server'
import ProxySettings from "../pages/network-proxy/network-proxy";

const routes = [{
    path: "/",
    element: <AuthLayout />,
    children: [
        { path: "/", element: <OperatorPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/network", element: <NetworkPage /> },
        { path: "/network/ethernet", element: <Ethernet /> },
        { path: "/network/wifi", element: <Wifi /> },
        { path: "/menu/network/network-testing", element: <NetworkTesting /> },
        { path: "/menu/network/ntp-server", element: <NtpServer /> },
        { path: "/menu/network/proxy-server", element: <ProxySettings/>}
    ]
}]

routes.push({ path: '/*', element: <Navigate to='/' /> });

export default routes;
