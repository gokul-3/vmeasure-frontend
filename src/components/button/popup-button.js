import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PopupButton({
    height = '100%',
    minWidth = '27%',
    ml = '0em',
    mr = '1em',
    padding = '0.3em',
    buttonVariant = "contained",
    onClick,
    text,
    fontSize = 'body8',
    disable = false,
}) {
    return (
        <Button
            variant={buttonVariant}
            sx={{
                minWidth: minWidth,
                height: height,
                marginLeft: ml,
                marginRight: mr,
                padding: padding,
            }}
            onClick={onClick}
            disabled={disable}
        >
            <Typography variant={fontSize}>{text}</Typography>
        </Button>
    )
}