// import { customBlue, customGrey, customYellow } from '../constants/color'

const defaultComponents = {
    name: "DEFAULT",
    MuiTabs: {
        styleOverrides: {
            root: {
                disableRipple: true,
            }
        }
    },
    MuiTab: {
        styleOverrides: {
            root: {
                fontSize: '2em',
                padding: '1em',
                disableRipple: true
            }
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                fontSize: '1.8em',
                padding: '1em',
                lineHeight: '1.5em'
            }
        },
    },
    MuiButtonBase: {
        defaultProps: {
            disableRipple: true,
            disableTouchRipple: true
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                fontSize: '2em',
            },
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontSize: '3.3em',
            }
        },
    },
    MuiDialogContentText: {
        styleOverrides: {
            root: {
                fontSize: '2.4em',
            }
        },
    },
    MuiAlert: {
        styleOverrides: {
            root: {
                fontSize: '1.8em',

            },
            icon: {
                fontSize: '1.3em'
            }
        }
    },
    MuiSelect: {
        styleOverrides: {
            root: {
                fontSize: '2.2em',
                disableRipple: true
            },
            icon: {
                width: '2.6em',
                height: '2.6em',
                top: 'auto'
            }
        }
    },
    MuiAutocomplete: {
        styleOverrides: {
            root: {
                fontSize: '2.2em',
                disableRipple: true,
            },
            endAdornment: {
                svg: {
                    width: '2.6em',
                    height: '2.6em',
                },
                top: 'auto'
            },
            noOptions: {
                fontSize: '4em',
            }
        }
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                fontSize: '2.2em',
                disableRipple: true,
                padding: 20
            }
        }
    },
    MuiToggleButton: {
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff',
                border: '1px solid #ccc !important',
                '&.Mui-selected': {
                    backgroundColor: '#0288d1',
                    color: 'white',
                    '&:hover': {
                        background: "#1565c0",
                    },
                },
            }

        },
    },
    MuiCircularProgress: {
        defaultProps: {
            disableShrink: true
        }
    },
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                transition: 'none'
            }
        }
    },
}

const largeComponents = {
        name: "LARGE",
        MuiTabs: {
            styleOverrides: {
                root: {
                    disableRipple: true,
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: '2.2em',
                    padding: '1em',
                    disableRipple: true
                }
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '2.2em',
                    padding: '1em',
                    lineHeight: '1.5em'
                }
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
                disableTouchRipple: true
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '2.2em',
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: '4.5em',
                }
            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    fontSize: '3em',
                }
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontSize: '1.8em',

                },
                icon: {
                    fontSize: '1.3em'
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    fontSize: '3em',
                    disableRipple: true
                },
                icon: {
                    width: '2.6em',
                    height: '2.6em',
                    top: 'auto'
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    fontSize: '2.2em',
                    disableRipple: true,
                },
                endAdornment: {
                    svg: {
                        width: '2.6em',
                        height: '2.6em',
                    },
                    top: 'auto'
                },
                noOptions: {
                    fontSize: '4em',
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '3em',
                    disableRipple: true,
                    padding: 20
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    border: '1px solid #ccc !important',
                    '&.Mui-selected': {
                        backgroundColor: '#0288d1',
                        color: 'white',
                        '&:hover': {
                            background: "#1565c0",
                        },
                    },
                }

            },
        },
        MuiCircularProgress: {
            defaultProps: {
                disableShrink: true
            }
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    transition: 'none'
                }
            }
        },
    }

const components = [
    defaultComponents,
    largeComponents
]
export default components;
