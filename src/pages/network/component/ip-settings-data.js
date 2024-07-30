import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function IPSettingsPair({ title, value }) {

	const { t } = useTranslation();

	return (
		<Grid item xs={6} width={'100%'} display={'flex'} alignItems={'center'} >
			<Typography variant="body5" fontWeight={'bold'} sx={{ width: '50%' }}>
				{t(title)}
			</Typography>
			<Typography variant="body5" >
				{value || ''}
			</Typography>
		</Grid>
	)
}