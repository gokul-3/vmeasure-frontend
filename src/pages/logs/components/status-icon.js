
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

export default function StatusIcon({ status }) {
    return status ?
        <CheckCircleIcon color="success" sx={{ fontSize: '2em' }} />
        :
        <WarningIcon color="warning" sx={{ fontSize: '2em' }} />
}