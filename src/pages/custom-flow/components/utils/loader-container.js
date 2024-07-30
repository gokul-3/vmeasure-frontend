import React from 'react'
import LoaderDialog from './loader-dialog'
import Loader from './loader'

function LoaderContainer({ isConfigPage }) {
    return (
        <>
            {isConfigPage ? <LoaderDialog /> : <Loader />}
        </>
    )
}

export default LoaderContainer