import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
} from '@mui/material';
import { Plus, Building2, MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import SearchInput from '../components/core/SearchInput';
import EmptyState from '../components/core/EmptyState';
import Badge from '../components/core/Badge';

/**
 * Client List Page
 * Based on wireframes/03_client_list.md
 */
const ClientList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const clients = [
    {
      id: '1',
      name: 'Acme Corporation',
      industry: 'Technology',
      location: 'London, UK',
      status: 'Active',
      engagementScore: 85,
      lastContact: '2 days ago',
      revenue: '$450K',
      contacts: 12,
      openOpportunities: 3,
    },
    {
      id: '2',
      name: 'TechStart Inc',
      industry: 'Software',
      location: 'San Francisco, USA',
      status: 'Active',
      engagementScore: 72,
      lastContact: '1 week ago',
      revenue: '$280K',
      contacts: 8,
      openOpportunities: 2,
    },
    {
      id: '3',
      name: 'Global Industries',
      industry: 'Manufacturing',
      location: 'Berlin, Germany',
      status: 'Active',
      engagementScore: 91,
      lastContact: '1 day ago',
      revenue: '$620K',
      contacts: 15,
      openOpportunities: 5,
    },
    {
      id: '4',
      name: 'FinanceFirst Ltd',
      industry: 'Financial Services',
      location: 'New York, USA',
      status: 'Inactive',
      engagementScore: 45,
      lastContact: '2 months ago',
      revenue: '$180K',
      contacts: 5,
      openOpportunities: 0,
    },
  ];

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEngagementColor = (score) => {
    if (score >= 80) return '#16A34A';
    if (score >= 60) return '#D97706';
    return '#DC2626';
  };

  return (
    <MainLayout title="All Clients" showSearch={false}>
      <Box>
        {/* Header Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <SearchInput
            placeholder="Search clients..."
            onSearch={setSearchQuery}
            fullWidth={false}
          />
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => console.log('Add client modal')}
          >
            Add client
          </Button>
        </Box>

        {/* Client Cards Grid */}
        {filteredClients.length === 0 ? (
          <EmptyState
            type="search"
            title="No clients found"
            description="Try adjusting your search query or add a new client."
            actionLabel="Add client"
            onAction={() => console.log('Add client modal')}
          />
        ) : (
          <Grid container spacing={3}>
            {filteredClients.map((client) => (
              <Grid item xs={12} md={6} key={client.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: '#EEF2FF',
                          color: '#4F46E5',
                          mr: 2,
                        }}
                      >
                        <Building2 size={28} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ mb: 0.5 }}>
                          {client.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Chip
                            label={client.industry}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6875rem',
                              backgroundColor: '#F3F4F6',
                              color: '#4B5563',
                            }}
                          />
                          <Badge
                            label={client.status}
                            variant={client.status.toLowerCase()}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MapPin size={14} color="#9CA3AF" />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {client.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Engagement Score */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          Engagement Score
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: getEngagementColor(client.engagementScore),
                          }}
                        >
                          {client.engagementScore}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          backgroundColor: '#F3F4F6',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${client.engagementScore}%`,
                            height: '100%',
                            backgroundColor: getEngagementColor(client.engagementScore),
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Metrics */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        pt: 2,
                        borderTop: '1px solid #E5E7EB',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Revenue
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {client.revenue}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Contacts
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {client.contacts}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Opportunities
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {client.openOpportunities}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Last Contact */}
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 2, color: 'text.secondary' }}
                    >
                      Last contact: {client.lastContact}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </MainLayout>
  );
};

export default ClientList;
