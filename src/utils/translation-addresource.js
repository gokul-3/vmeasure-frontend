import i18next from 'i18next';

export const addTranslation = ({ language, translationObject, namespace = 'translation' }) => {
    try {
        i18next.addResourceBundle(language, namespace, translationObject)
        return true
    } catch (error) {
        console.error('Error adding translation:', error)
        return false
    }
};
