import React, { useState } from 'react';
import { Box, Tab, Tabs, Paper, Typography } from '@mui/material';
import PendingPosts from './PendingPosts';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    console.log(`🪄 Switching tab: ${newValue === 0 ? "Pending Posts" : "User Management"}`);
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
      <Typography variant="caption" sx={{ ml: 2 }}>
        Debug: Current Tab = {tabValue === 0 ? "Pending Posts" : "User Management"}
      </Typography>
      {tabValue === 0 && <PendingPosts />}
      {tabValue === 1 && <UserManagement />}
    </Box>
  );
};

export default AdminPanel;
