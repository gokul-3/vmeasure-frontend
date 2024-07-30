export const useNetwork = () => {

    const checkForNetwork = () => {
        return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
            ? navigator.onLine
            : true;
    }

    return [checkForNetwork];
};
