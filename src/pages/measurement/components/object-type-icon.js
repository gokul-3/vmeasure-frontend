import React from "react"
import { Grid, Avatar, Box, IconButton } from "@mui/material";
import { ObjectType } from '../../../constants/constants'
import Icons from '../../../components/ultima-icons'


export function ObjectTypeIcon({ objectType }) {
    return (
        <Grid>
            {
                (objectType === ObjectType.IRREGULAR) ?
                    <IconButton
                        sx={{
                            backgroundColor: 'white',
                            padding: 2,
                            border: '1px solid #ccc',
                            borderRadius: '1px',
                            height: 110,
                            width: 110,
                        }}
                        variant='square'>
                        <Box
                            sx={{
                                width: '90%',
                                height: '90%'
                            }}>
                            <Icons.IrregularObjectIcon />
                        </Box>
                    </IconButton>
                    :
                    <IconButton
                        sx={{
                            backgroundColor: 'white',
                            padding: 2,
                            border: '1px solid #ccc',
                            borderRadius: '1px',
                            height: 110,
                            width: 110,
                        }}
                        variant='square'>
                        <Box
                            sx={{
                                width: '90%',
                                height: '90%'
                            }}>
                            <Icons.RegularObjectIcon />
                        </Box>
                    </IconButton>
            }
        </Grid>
    )
}