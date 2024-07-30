import * as React from 'react';
import { useState } from 'react';
import { Paper, Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SystemInformation from './system-info';
import DimensionSpecification from './dims-spec';
import WorkflowInformation from './wokflow-info';
import { useTranslation } from 'react-i18next';

export default function SystemInfoPage() {

  const { t } = useTranslation()

  const [selectedTab, setSelectedTab] = useState('system_info')

  const handleTabChange = (event, value) => {

    setSelectedTab(value);
  }

  const tabStyle = {
    width : '33%'
  }

  return (
    <Paper variant="outlined" sx={{ width: '100%', height: '87vh', }}>
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} >
            <Tab style={{ minWidth: tabStyle.width }} label={t('information_page.tab_title.system_info')} value="system_info" />
            <Tab style={{ minWidth: tabStyle.width }} label={t('information_page.tab_title.dims_spec')} value="dims_spec" />
            <Tab style={{ minWidth: tabStyle.width }} label={t('information_page.tab_title.workflow_info')} value="workflow" />
          </TabList>
        </Box>
        <TabPanel value="system_info">
          <SystemInformation />
        </TabPanel>
        <TabPanel value="dims_spec">
          <DimensionSpecification />
        </TabPanel>
        <TabPanel value="workflow">
          <WorkflowInformation />
        </TabPanel>
      </TabContext>
    </Paper>
  )
}

