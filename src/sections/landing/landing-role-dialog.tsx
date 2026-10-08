'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useTranslations } from 'next-intl';
import Iconify from 'src/components/iconify';

export type LandingUserRole = 'buyer' | 'supplier';

interface LandingRoleDialogProps {
  open: boolean;
  currentRole: LandingUserRole;
  targetRole: LandingUserRole;
  onClose: () => void;
  onGoHome: () => void;
  onSwitchRole: () => void;
}

// Dialog entry bounce
const dialogPop = keyframes`
  0% { transform: scale(0.92) translateY(12px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

// Icon pop & spring
const popIn = keyframes`
  0% { transform: scale(0.65) rotate(-6deg); opacity: 0; }
  70% { transform: scale(1.08) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

// Ambient pulsing halo
const pulseGlow = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 0.2; }
`;

// Soft content fade
const fadeInUp = keyframes`
  0% { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

export default function LandingRoleDialog({
  open,
  currentRole,
  targetRole,
  onClose,
  onGoHome,
  onSwitchRole,
}: LandingRoleDialogProps) {
  const theme = useTheme();
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

  const brandColor = '#006838';
  const warningColor = '#E11D48';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
        paper: {
          elevation: 0,
          sx: {
            position: 'relative',
            borderRadius: '24px',
            width: '100%',
            maxWidth: 460,
            m: { xs: 2, sm: 3 },
            p: 0,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 28px 56px -12px rgba(15, 23, 42, 0.22)',
            background: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
            animation: `${dialogPop} 0.35s cubic-bezier(0.16, 1, 0.3, 1) both`,
          },
        },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        aria-label="close"
        size="small"
        sx={{
          position: 'absolute',
          top: 14,
          right: theme.direction === 'rtl' ? 'auto' : 14,
          left: theme.direction === 'rtl' ? 14 : 'auto',
          zIndex: 2,
          color: 'text.secondary',
          bgcolor: alpha(theme.palette.grey[500], 0.08),
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: alpha(theme.palette.grey[500], 0.16),
            color: 'text.primary',
            transform: 'rotate(90deg)',
          },
        }}
      >
        <Iconify icon="eva:close-fill" width={20} />
      </IconButton>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          px: { xs: 2.5, sm: 4 },
          pt: 4,
          pb: 3.5,
        }}
      >
        {/* Animated Badge Icon Container with Glow */}
        <Box
          key={confirming ? 'confirm-badge' : 'switch-badge'}
          sx={{
            position: 'relative',
            width: 82,
            height: 82,
            display: 'grid',
            placeItems: 'center',
            mb: 2.5,
            animation: `${popIn} 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) both`,
          }}
        >
          {/* Animated Glow Aura */}
          <Box
            sx={{
              position: 'absolute',
              inset: -6,
              borderRadius: '28px',
              bgcolor: confirming ? alpha(warningColor, 0.25) : alpha(brandColor, 0.22),
              animation: `${pulseGlow} 2.4s ease-in-out infinite`,
              zIndex: 0,
            }}
          />

          {/* Badge Box */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              display: 'grid',
              placeItems: 'center',
              zIndex: 1,
              background: confirming
                ? 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)'
                : 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              border: '1px solid',
              borderColor: confirming ? alpha(warningColor, 0.3) : alpha(brandColor, 0.25),
              boxShadow: confirming
                ? `0 14px 30px -8px ${alpha(warningColor, 0.35)}`
                : `0 14px 30px -8px ${alpha(brandColor, 0.35)}`,
              color: confirming ? warningColor : brandColor,
            }}
          >
            <Iconify
              icon={
                confirming
                  ? 'solar:logout-2-bold-duotone'
                  : 'solar:user-hand-up-bold-duotone'
              }
              width={44}
            />
          </Box>
        </Box>

        {/* Dialog Title */}
        <Typography
          key={`title-${confirming}`}
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 18, sm: 19.5 },
            color: 'text.primary',
            mb: 1,
            lineHeight: 1.35,
            animation: `${fadeInUp} 0.3s ease both`,
          }}
        >
          {confirming ? t('role_dialog.warning_title') : t('role_dialog.title')}
        </Typography>

        {/* Dialog Description */}
        <Typography
          key={`msg-${confirming}`}
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: { xs: 13.5, sm: 14 },
            maxWidth: 390,
            mb: confirming ? 2.5 : 2,
            animation: `${fadeInUp} 0.35s ease both`,
          }}
        >
          {confirming
            ? t('role_dialog.warning_message', { current: currentLabel, target: targetLabel })
            : t('role_dialog.message', { current: currentLabel, target: targetLabel })}
        </Typography>

        {/* Minimalist Switch Badge (اختصار بدون تعقيد) */}
        {!confirming && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              px: 2,
              py: 0.85,
              mb: 3,
              borderRadius: '50px',
              bgcolor: alpha(theme.palette.grey[500], 0.06),
              border: '1px solid',
              borderColor: alpha(theme.palette.grey[500], 0.16),
              animation: `${fadeInUp} 0.4s ease both`,
            }}
          >
            {/* Current Role Tag */}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: 13,
                textDecoration: 'line-through',
                textDecorationColor: alpha(theme.palette.text.secondary, 0.4),
              }}
            >
              {currentLabel}
            </Typography>

            {/* Transition Arrow */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: brandColor,
                transform: theme.direction === 'rtl' ? 'rotate(180deg)' : 'none',
              }}
            >
              <Iconify icon="solar:arrow-right-linear" width={16} />
            </Box>

            {/* Target Role Pill */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                px: 1.25,
                py: 0.25,
                borderRadius: '50px',
                bgcolor: alpha(brandColor, 0.12),
                color: brandColor,
              }}
            >
              <Iconify
                icon={targetRole === 'buyer' ? 'solar:cart-large-4-bold' : 'solar:shop-2-bold'}
                width={14}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {targetLabel}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            width: '100%',
            mt: confirming ? 1 : 0,
            animation: `${fadeInUp} 0.45s ease both`,
          }}
        >
          <Button
            onClick={confirming ? () => setConfirming(false) : onGoHome}
            variant="outlined"
            fullWidth
            size="medium"
            sx={{
              py: 1.15,
              px: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: { xs: 13, sm: 13.5 },
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: 1,
              borderColor: alpha(theme.palette.grey[500], 0.32),
              color: 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: alpha(theme.palette.grey[500], 0.5),
                bgcolor: alpha(theme.palette.grey[500], 0.06),
                transform: 'translateY(-1px)',
              },
            }}
          >
            {confirming ? t('role_dialog.cancel') : t('role_dialog.go_home')}
          </Button>

          <Button
            onClick={confirming ? onSwitchRole : () => setConfirming(true)}
            variant="contained"
            disableElevation
            fullWidth
            size="medium"
            startIcon={
              <Iconify
                icon={
                  confirming
                    ? 'solar:logout-2-bold'
                    : 'solar:login-2-bold'
                }
                width={17}
              />
            }
            sx={{
              py: 1.15,
              px: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: { xs: 13, sm: 13.5 },
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: 1.25,
              bgcolor: confirming ? warningColor : brandColor,
              color: '#FFFFFF',
              boxShadow: confirming
                ? `0 8px 20px -4px ${alpha(warningColor, 0.45)}`
                : `0 8px 20px -4px ${alpha(brandColor, 0.45)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: confirming ? '#BE123C' : '#00542D',
                boxShadow: confirming
                  ? `0 12px 24px -4px ${alpha(warningColor, 0.5)}`
                  : `0 12px 24px -4px ${alpha(brandColor, 0.5)}`,
                transform: 'translateY(-1px)',
              },
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
