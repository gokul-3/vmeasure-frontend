import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import { addEllipsis } from "../../utils/string-operation";

export function WorkflowInfoGroup({ title, records }) {

  const { t } = useTranslation()

  return (
    <Paper variant='outlined' sx={{ width: '100%', padding: 7, margin: 5, border:'1px solid #ccc' }}>
      <Typography variant='body5' fontWeight={'bold'}>
        {t(title)}
      </Typography>
      <Divider sx={{ marginY: 5 }}  color="#ccc"/>
      {
        Object.keys(records).map((key, index) =>
          <Box key={index} display={'flex'} sx={{ marginY: 10 }}>
            <Typography variant='h5' width={'60%'}>
              {t(key)}
            </Typography>
            <Typography variant='body4'>
              {addEllipsis(records[key], 30, false)}
            </Typography>
          </Box>
        )
      }
    </Paper>
  )

}
