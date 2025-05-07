import React, { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import PendingPosts from './PendingPosts';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pending Posts" />
          <Tab label="User Management" />
        </Tabs>
      </Paper>
      {tabValue === 0 && <PendingPosts />}
      {tabValue === 1 && <UserManagement />}
    </Box>
  );
};

export default AdminPanel;