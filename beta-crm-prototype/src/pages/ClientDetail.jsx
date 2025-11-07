import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Avatar,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Building2,
  MapPin,
  Globe,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Badge from '../components/core/Badge';

/**
 * Client Detail Page
 * Based on wireframes/04_client_detail.md
 */
const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  // Mock data
  const client = {
    id: id,
    name: 'Acme Corporation',
    industry: 'Technology',
    companyType: 'Parent Company',
    location: 'London, UK',
    website: 'https://acme.com',
    fiscalYearEnd: '12/31',
    status: 'Active',
    engagementScore: 85,
    revenue: '$450K',
    since: 'Jan 2023',
  };

  const contacts = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CEO',
      email: 'sarah.j@acme.com',
      phone: '+44 20 1234 5678',
      lastContact: '2 days ago',
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'CFO',
      email: 'michael.c@acme.com',
      phone: '+44 20 1234 5679',
      lastContact: '1 week ago',
    },
  ];

  const interactions = [
    {
      id: '1',
      type: 'Meeting',
      subject: 'Q4 Budget Review',
      contact: 'Sarah Johnson',
      date: 'Oct 25, 2025',
      sentiment: 'positive',
      notes: 'Discussed budget allocation for next quarter. Client is very satisfied with progress.',
    },
    {
      id: '2',
      type: 'Email',
      subject: 'Project Status Update',
      contact: 'Michael Chen',
      date: 'Oct 20, 2025',
      sentiment: 'neutral',
      notes: 'Sent weekly status update. Awaiting feedback.',
    },
  ];

  const documents = [
    {
      id: '1',
      name: 'Q4 2025 Proposal.pdf',
      size: '2.4 MB',
      uploadedBy: 'Sarah Chen',
      uploadedAt: 'Oct 15, 2025',
    },
    {
      id: '2',
      name: 'Contract_Acme_2025.pdf',
      size: '1.8 MB',
      uploadedBy: 'Sarah Chen',
      uploadedAt: 'Jan 10, 2025',
    },
  ];

  const getEngagementColor = (score) => {
    if (score >= 80) return '#16A34A';
    if (score >= 60) return '#D97706';
    return '#DC2626';
  };

  return (
    <MainLayout title={client.name} showSearch={false}>
      <Box>
        {/* Client Header Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  mr: 3,
                }}
              >
                <Building2 size={40} />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h2" sx={{ mb: 1 }}>
                      {client.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={client.industry}
                        size="small"
                        sx={{
                          backgroundColor: '#F3F4F6',
                          color: '#4B5563',
                        }}
                      />
                      <Chip
                        label={client.companyType}
                        size="small"
                        sx={{
                          backgroundColor: '#F3F4F6',
                          color: '#4B5563',
                        }}
                      />
                      <Badge label={client.status} variant={client.status.toLowerCase()} size="small" />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Edit size={18} />}>
                      Edit
                    </Button>
                    <IconButton color="error">
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Client Info Grid */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={16} color="#9CA3AF" />
                        <Typography variant="body2">{client.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Globe size={16} color="#9CA3AF" />
                        <Typography
                          variant="body2"
                          component="a"
                          href={client.website}
                          target="_blank"
                          sx={{ color: 'primary.main', textDecoration: 'none' }}
                        >
                          {client.website}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={16} color="#9CA3AF" />
                        <Typography variant="body2">
                          Fiscal Year End: {client.fiscalYearEnd}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#F9FAFB',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                        Engagement Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ color: getEngagementColor(client.engagementScore) }}
                        >
                          {client.engagementScore}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          / 100
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          backgroundColor: '#E5E7EB',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${client.engagementScore}%`,
                            height: '100%',
                            backgroundColor: getEngagementColor(client.engagementScore),
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Contacts" />
            <Tab label="Communications" />
            <Tab label="Documents" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {currentTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Key Metrics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4">{client.revenue}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Client Since
                      </Typography>
                      <Typography variant="h4">{client.since}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Last interaction: 2 days ago
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {currentTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Contacts</Typography>
              <Button variant="contained" startIcon={<Plus size={18} />}>
                Add contact
              </Button>
            </Box>
            <Grid container spacing={3}>
              {contacts.map((contact) => (
                <Grid item xs={12} md={6} key={contact.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar sx={{ width: 48, height: 48, mr: 2, backgroundColor: '#4F46E5' }}>
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">{contact.name}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {contact.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Mail size={16} color="#9CA3AF" />
                          <Typography variant="body2">{contact.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone size={16} color="#9CA3AF" />
                          <Typography variant="body2">{contact.phone}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                        Last contact: {contact.lastContact}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {currentTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Communications</Typography>
              <Button variant="contained" startIcon={<Plus size={18} />}>
                Log Interaction
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip label={interaction.type} size="small" />
                          <Badge label={interaction.sentiment} variant={interaction.sentiment} size="small" />
                        </Box>
                        <Typography variant="h6">{interaction.subject}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {interaction.contact} • {interaction.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2">{interaction.notes}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {currentTab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Documents</Typography>
              <Button variant="contained" startIcon={<Plus size={18} />}>
                Upload
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {doc.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                        </Typography>
                      </Box>
                      <Button variant="outlined" size="small">
                        Download
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default ClientDetail;
