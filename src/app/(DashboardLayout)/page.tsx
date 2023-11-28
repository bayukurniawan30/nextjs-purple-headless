'use client'
import { Grid, Box } from '@mui/material'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer'
// components
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance'
import { useSettingsStore } from '@/hooks/settings'
import { useEffect } from 'react'
import axios from '@/lib/axios'

const Dashboard = () => {
  const { fetchSettings } = useSettingsStore()

  useEffect(() => {
    const token = localStorage.getItem('yourAuthTokenKey') // replace with your actual key
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchSettings()
    } else {
      // Handle the case where the token is not available
      console.error('Authentication token not found')
    }
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
