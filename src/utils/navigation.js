

export const BlockingNavigations = [
    { path: "/menu/network/network-testing" },
    { path: "/menu/update" },
    { path: "/measurement" }
]

export const checkDialogConditions = (location) => {
    for (const navigation of BlockingNavigations) {
        if (location.pathname == navigation.path) {
            return false
        }
    }
    return true
}
