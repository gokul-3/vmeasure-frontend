import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SidebarItem from './sidebar-item';
import { Box } from '@mui/material';
import Icons from '../../components/ultima-icons'
import { useSelector } from 'react-redux';

export default function Sidebar() {

  const theme = useTheme();
  const { device_test_modes } = useSelector((state) => state.applicationState);

  return (
    <Box height={'100vh'} width={'8em'} sx={{ backgroundColor: theme.sidebar.background }}>
      <List sx={{ height: '100vh' }}>
        <ListItem disablePadding sx={{ display: 'block', height: '10%' }}></ListItem>

        <ListItem disablePadding sx={{ display: 'block', height: '18%' }}>
          <SidebarItem Icon={Icons.MenuIcon} href={'/menu'} />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block', height: '18%' }}>
          <SidebarItem Icon={Icons.MeasureIcon} href={'/measurement'} />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block', height: '18%' }}>
          <SidebarItem Icon={Icons.LogsIcon} href={'/logs'} />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block', height: '18%' }}>
          <SidebarItem Icon={Icons.InfoIcon} href={'/info'} />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block', height: '18%' }} >
          <SidebarItem Icon={Icons.LogoutIcon} href={'/logout'} disableCondition={device_test_modes.is_endurance_testing_enabled} />
        </ListItem>

      </List>
    </Box>
  );
}
