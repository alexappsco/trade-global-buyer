'use client';

import { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography, Stack } from '@mui/material';
import { keyframes } from '@mui/system';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useTranslations } from 'next-intl';

export type LandingUserRole = 'buyer' | 'supplier';

interface LandingRoleDialogProps {
  open: boolean;
  currentRole: LandingUserRole;
  targetRole: LandingUserRole;
  onClose: () => void;
  onGoHome: () => void;
  onSwitchRole: () => void;
}

const popIn = keyframes`
  0% { transform: scale(0.72); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const VISUAL = {
  switch: {
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 45%, #22D3EE 100%)',
    shadow: '0 18px 38px -14px rgba(99,102,241,0.65)',
    halo: 'rgba(99,102,241,0.12)',
  },
  logout: {
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)',
    shadow: '0 18px 38px -14px rgba(244,63,94,0.6)',
    halo: 'rgba(244,63,94,0.12)',
  },
};

function RoleVisual({ mode }: { mode: 'switch' | 'logout' }) {
  const visual = VISUAL[mode];

  return (
    <Box
      sx={{
        position: 'relative',
        width: 96,
        height: 96,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        background: visual.gradient,
        boxShadow: `${visual.shadow}, 0 0 0 10px ${visual.halo}`,
        animation: `${popIn} 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) both`,
      }}
    >
      {mode === 'logout' ? (
        <LogoutRoundedIcon sx={{ fontSize: 40, color: '#fff' }} />
      ) : (
        <ManageAccountsRoundedIcon sx={{ fontSize: 40, color: '#fff' }} />
      )}
    </Box>
  );
}

export default function LandingRoleDialog({
  open,
  currentRole,
  targetRole,
  onClose,
  onGoHome,
  onSwitchRole,
}: LandingRoleDialogProps) {
  const t = useTranslations('Landing');
  const [confirming, setConfirming] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    if (open) {
      setConfirming(false);
    }
  }

  const currentLabel = t(currentRole === 'buyer' ? 'roles.buyer' : 'roles.supplier');
  const targetLabel = t(targetRole === 'buyer' ? 'roles.buyer' : 'roles.supplier');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        },
        paper: {
          elevation: 0,
          sx: {
            borderRadius: '14px',
            width: '100%',
            maxWidth: 440,
            m: 2,
          },
        },
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          px: 3,
          py: 4,
          gap: 2.25,
        }}
      >
        <RoleVisual key={confirming ? 'logout' : 'switch'} mode={confirming ? 'logout' : 'switch'} />

        <Typography
          key={`title-${confirming}`}
          sx={{ fontSize: 16, fontWeight: 600, color: '#1F2937', lineHeight: 1.5 }}
        >
          {confirming ? t('role_dialog.warning_title') : t('role_dialog.title')}
        </Typography>

        <Typography
          key={`message-${confirming}`}
          sx={{ mt: -1.25, fontSize: 14, color: '#6B7280', lineHeight: 1.9 }}
        >
          {confirming
            ? t('role_dialog.warning_message', { target: targetLabel })
            : t('role_dialog.message', { current: currentLabel, target: targetLabel })}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 0.5, width: '100%' }}>
          <Button
            onClick={confirming ? () => setConfirming(false) : onGoHome}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#E5E7EB',
              color: '#374151',
              borderRadius: '8px',
              py: 1,
              fontSize: 15,
              fontWeight: 600,
              '&:hover': { borderColor: '#D1D5DB', bgcolor: '#F9FAFB' },
            }}
          >
            {confirming ? t('role_dialog.cancel') : t('role_dialog.go_home')}
          </Button>

          <Button
            onClick={confirming ? onSwitchRole : () => setConfirming(true)}
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              bgcolor: confirming ? '#D32F2F' : '#0F8259',
              color: '#fff',
              borderRadius: '8px',
              py: 1,
              fontSize: 15,
              fontWeight: 600,
              '&:hover': { bgcolor: confirming ? '#B71C1C' : '#0a6645' },
            }}
          >
            {confirming
              ? t('role_dialog.confirm_logout')
              : t('role_dialog.register_as', { target: targetLabel })}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}