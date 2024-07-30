import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";

function usePermission(module) {
    const [hasPermission, setPermission] = useState();
    const { permissions } = useSelector(state => state.applicationState);
    const { userInfo } = useSelector(state => state.userAuth);

    useEffect(() => {
        if (module) {
            if (!userInfo || !permissions.hasOwnProperty(module)) {
                setPermission(true)
            } else {
                setPermission(permissions[module])
            }
        }
    }, [module, permissions]);

    return [hasPermission];
}

export default usePermission