import { Box, Typography } from "@mui/material"
import { Trans } from 'react-i18next';
import { useSelector } from "react-redux";

export default function CalibrationButton({ title, bgColor, color, subTitle, isScaleEnabled, onClick, Icon, disabled }) {
  const { font_size: fontSize } = useSelector((state) => state.applicationState);
  return disabled ? null : (

    <Box
      sx={{ width: (fontSize?.toUpperCase() === "DEFAULT") ? '65%' : '75%', padding: '0.6em', textAlign: 'center', boxShadow: `${color} 3px 3px 3px` }}
      border={'1px solid'}
      borderColor={color}
      borderRadius={4}
      onClick={onClick}
      bgcolor={bgColor}
      display={'flex'}

    >
      <Box sx={{ width: '100%', height: '100%' }}>
        <Typography variant="h2" fontWeight="600" color={color}>
          <Trans
            i18nKey={title}
            values={{ weighing_scale: isScaleEnabled ? "W " : "" }}
          />
        </Typography>
        <Typography variant="h5" color="black">
          <Trans
            i18nKey={subTitle}
            values={{ weighing_scale: isScaleEnabled ? "W " : "" }}
          />
        </Typography>
      </Box>
    </Box>
  )
}
