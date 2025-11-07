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
  ToggleButtonGroup,
  ToggleButton,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { X, Mail, Phone, Video } from 'lucide-react';

/**
 * Log Interaction Modal
 * Based on Modal specification in prototype_ui.md
 */
const LogInteractionModal = ({ open, onClose, onSave, clientId }) => {
  const [formData, setFormData] = useState({
    type: 'Email',
    dateTime: new Date().toISOString().slice(0, 16),
    contact: '',
    subject: '',
    notes: '',
    nextSteps: '',
    sentiment: '',
    attachments: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const interactionTypes = ['Email', 'Call', 'Meeting', 'Other'];

  // Mock contacts - in real app, fetch from API based on clientId
  const contacts = [
    { id: '1', name: 'Sarah Johnson', role: 'CEO' },
    { id: '2', name: 'Michael Chen', role: 'CFO' },
    { id: '3', name: 'Emily Davis', role: 'CTO' },
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    if (!formData.dateTime) {
      newErrors.dateTime = 'Date & time is required';
    }
    if (!formData.contact) {
      newErrors.contact = 'Contact is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
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
      type: 'Email',
      dateTime: new Date().toISOString().slice(0, 16),
      contact: '',
      subject: '',
      notes: '',
      nextSteps: '',
      sentiment: '',
      attachments: [],
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Log Interaction</Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Type */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
                Type *
              </Typography>
              <ToggleButtonGroup
                value={formData.type}
                exclusive
                onChange={(e, value) => value && handleChange('type', value)}
                sx={{ display: 'flex', gap: 1 }}
              >
                {interactionTypes.map((type) => (
                  <ToggleButton
                    key={type}
                    value={type}
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    {type}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {errors.type && (
                <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                  {errors.type}
                </Typography>
              )}
            </Box>

            {/* Date & Time + Contact */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Date & Time *
                </Typography>
                <TextField
                  fullWidth
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleChange('dateTime', e.target.value)}
                  error={!!errors.dateTime}
                  helperText={errors.dateTime}
                  required
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Contact *
                </Typography>
                <TextField
                  fullWidth
                  select
                  placeholder="Select contact..."
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  error={!!errors.contact}
                  helperText={errors.contact}
                  required
                >
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.role}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Subject */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Subject *
              </Typography>
              <TextField
                fullWidth
                placeholder="Q4 Budget Review Meeting"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                error={!!errors.subject}
                helperText={errors.subject}
                required
              />
            </Box>

            {/* Notes */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Add detailed notes about this interaction..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </Box>

            {/* Next Steps */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Next Steps
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Send proposal by Oct 30"
                value={formData.nextSteps}
                onChange={(e) => handleChange('nextSteps', e.target.value)}
              />
            </Box>

            {/* Sentiment */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Sentiment
              </Typography>
              <RadioGroup
                row
                value={formData.sentiment}
                onChange={(e) => handleChange('sentiment', e.target.value)}
              >
                <FormControlLabel
                  value="positive"
                  control={<Radio />}
                  label="Positive"
                />
                <FormControlLabel
                  value="neutral"
                  control={<Radio />}
                  label="Neutral"
                />
                <FormControlLabel
                  value="negative"
                  control={<Radio />}
                  label="Negative"
                />
              </RadioGroup>
            </Box>

            {/* Attachments */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Attachments
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #E5E7EB',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Drag & drop files here or click to upload
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Max 5 files, 10MB each
                </Typography>
              </Box>
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

export default LogInteractionModal;
