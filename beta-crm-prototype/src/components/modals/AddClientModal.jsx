import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { X } from 'lucide-react';

/**
 * Add Client Modal
 * Based on Modal specification in prototype_ui.md
 */
const AddClientModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyType: '',
    location: '',
    website: '',
    fiscalYearEnd: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const industries = [
    'Technology',
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Energy',
    'Telecommunications',
    'Real Estate',
    'Other',
  ];

  const companyTypes = [
    'Parent Company',
    'Subsidiary',
    'Independent',
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.companyType) {
      newErrors.companyType = 'Company type is required';
    }
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSave?.(formData);
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setFormData({
      companyName: '',
      industry: '',
      companyType: '',
      location: '',
      website: '',
      fiscalYearEnd: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Add Client</Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Company Name */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Company Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="Acme Corporation"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                error={!!errors.companyName}
                helperText={errors.companyName}
                required
                autoFocus
              />
            </Box>

            {/* Industry */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Industry *
              </Typography>
              <TextField
                fullWidth
                select
                placeholder="Select industry..."
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                error={!!errors.industry}
                helperText={errors.industry}
                required
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Company Type */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Company Type *
              </Typography>
              <TextField
                fullWidth
                select
                placeholder="Select type..."
                value={formData.companyType}
                onChange={(e) => handleChange('companyType', e.target.value)}
                error={!!errors.companyType}
                helperText={errors.companyType}
                required
              >
                {companyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Location */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Location
              </Typography>
              <TextField
                fullWidth
                placeholder="London, UK"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </Box>

            {/* Website */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Website
              </Typography>
              <TextField
                fullWidth
                placeholder="https://acme.com"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                error={!!errors.website}
                helperText={errors.website}
              />
            </Box>

            {/* Fiscal Year End */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Fiscal Year End
              </Typography>
              <TextField
                fullWidth
                placeholder="MM/DD"
                value={formData.fiscalYearEnd}
                onChange={(e) => handleChange('fiscalYearEnd', e.target.value)}
                helperText="e.g., 12/31 or 03-31"
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddClientModal;
