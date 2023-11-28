'use client'
import { Grid, Box } from '@mui/material'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer'
// components
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance'
import { useSettingsStore } from '@/hooks/settings'
import { useEffect } from 'react'

const Dashboard = () => {
  const { settings, fetchSettings } = useSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}></Grid>
              <Grid item xs={12} lg={4}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ProductPerformance />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard
