import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress } from '@mui/material';
import { TrendingUp, Users, DollarSign, FileText, Clock } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Badge from '../components/core/Badge';

/**
 * Dashboard Page
 * Based on wireframes/02_dashboard.md
 */
const Dashboard = () => {
  // Mock data
  const metrics = [
    {
      label: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      icon: DollarSign,
      color: '#16A34A',
    },
    {
      label: 'Active Clients',
      value: '127',
      change: '+8',
      icon: Users,
      color: '#4F46E5',
    },
    {
      label: 'Opportunities',
      value: '42',
      change: '+5',
      icon: TrendingUp,
      color: '#D97706',
    },
    {
      label: 'Proposals',
      value: '18',
      change: '+3',
      icon: FileText,
      color: '#DC2626',
    },
  ];

  const recentActivity = [
    {
      title: 'New client onboarded',
      client: 'Acme Corporation',
      time: '2 hours ago',
      type: 'success',
    },
    {
      title: 'Proposal sent',
      client: 'TechStart Inc',
      time: '4 hours ago',
      type: 'info',
    },
    {
      title: 'Meeting scheduled',
      client: 'Global Industries',
      time: '1 day ago',
      type: 'neutral',
    },
  ];

  const upcomingDeadlines = [
    {
      title: 'Q4 Budget Review',
      client: 'Acme Corporation',
      dueDate: 'Oct 30, 2025',
      priority: 'high',
    },
    {
      title: 'Compliance Audit',
      client: 'Global Industries',
      dueDate: 'Nov 5, 2025',
      priority: 'medium',
    },
    {
      title: 'Strategy Meeting Prep',
      client: 'TechStart Inc',
      dueDate: 'Nov 10, 2025',
      priority: 'low',
    },
  ];

  return (
    <MainLayout title="Dashboard">
      <Box>
        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          backgroundColor: `${metric.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Icon size={24} color={metric.color} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {metric.label}
                        </Typography>
                        <Typography variant="h3" sx={{ mb: 0.5 }}>
                          {metric.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: metric.change.startsWith('+') ? '#16A34A' : '#DC2626',
                            fontWeight: 500,
                          }}
                        >
                          {metric.change} from last month
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Grid container spacing={3}>
          {/* Pipeline Chart Placeholder */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Pipeline Overview
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Chart visualization would go here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {recentActivity.map((activity, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Clock size={16} color="#9CA3AF" style={{ marginTop: 2 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {activity.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {activity.client}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}
                          >
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Deadlines */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Upcoming Deadlines
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {upcomingDeadlines.map((deadline, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: '#F9FAFB',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {deadline.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {deadline.client}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {deadline.dueDate}
                        </Typography>
                        <Badge label={deadline.priority} variant={deadline.priority} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
