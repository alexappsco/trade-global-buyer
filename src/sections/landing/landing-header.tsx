'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useTranslations, useLocale } from 'next-intl';

import { useRouter } from 'src/i18n/routing';
import { useAuth } from 'src/contexts/AuthContext';
import Iconify from 'src/components/iconify';
import LandingLanguagePopover from './landing-language-popover';

function getNameInitials(name?: string): string {
  if (!name) return '';

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
}

export default function LandingHeader() {
  const t = useTranslations('Landing');
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, logout, session } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<HTMLElement | null>(null);

  const navItems = [
    { title: t('nav.home'), path: '#hero' },
    { title: t('nav.how_it_works'), path: '#how-it-works' },
    { title: t('nav.about'), path: '#about' },
    { title: t('nav.partners'), path: '#partners' },
    { title: t('nav.faq'), path: '#faq' },
  ];

  const handleAnchor = (path: string) => {
    setOpenMenu(false);
    document.getElementById(path.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => router.push('/auth/login');

  const handleGoToDashboard = () => {
    setAvatarAnchorEl(null);
    router.push('/');
  };

  const handleLogout = async () => {
    setAvatarAnchorEl(null);
    await logout();
    router.refresh();
  };

  const isRtl = locale === 'ar';

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E8ECEB',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          height: { xs: 64, md: 72 },
          px: { xs: 2, md: 5 },
          maxWidth: 1400,
          mx: 'auto',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="a"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleAnchor('#hero');
          }}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }}
        >
          <Box
            component="img"
            src="/landing/logo.png"
            alt="TradeGlobal"
            sx={{ height: { xs: 40, md: 50 }, width: 'auto', objectFit: 'contain' }}
          />
        </Box>

        {/* Desktop nav */}
        <Stack
          component="nav"
          direction="row"
          spacing={4}
          sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => handleAnchor(item.path)}
              sx={{
                color: '#161616',
                fontSize: 15,
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 'auto',
                px: 0,
                '&:hover': { color: '#1B8354', bgcolor: 'transparent' },
              }}
            >
              {item.title}
            </Button>
          ))}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0, alignItems: 'center' }}>
          <LandingLanguagePopover />

          {isAuthenticated ? (
            <>
              <IconButton
                onClick={(e) => setAvatarAnchorEl(e.currentTarget)}
                disableRipple
                sx={{ p: 0.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' } }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#1B8354' }}>
                  {getNameInitials(session?.name) || <PersonRoundedIcon />}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={avatarAnchorEl}
                open={Boolean(avatarAnchorEl)}
                onClose={() => setAvatarAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 220,
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={handleGoToDashboard}
                  sx={{
                    mx: 1,
                    my: 0.75,
                    borderRadius: '8px',
                    color: '#161C24',
                    '&:hover': { bgcolor: 'rgba(27,131,84,0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: '#1B8354' }}>
                    <DashboardRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
                  >
                    {t('nav.go_to_dashboard')}
                  </ListItemText>
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    mx: 1,
                    my: 0.75,
                    borderRadius: '8px',
                    color: '#D32F2F',
                    '&:hover': { bgcolor: 'rgba(211,47,47,0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    <LogoutRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
                  >
                    {t('nav.logout')}
                  </ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                color: '#161616',
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 500,
                '&:hover': { color: '#1B8354', bgcolor: 'transparent' },
              }}
            >
              {t('nav.login')}
              <Iconify icon="solar:user-circle-bold" width={20} />
            </Button>
          )}

          {/* Mobile menu */}
          <IconButton
            onClick={() => setOpenMenu(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: isRtl ? 0 : 1, color: '#161616' }}
          >
            <Iconify icon="solar:hamburger-menu-bold" width={24} />
          </IconButton>
        </Stack>
      </Stack>

      <Drawer
        anchor={isRtl ? 'right' : 'left'}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              pt: 2,
            },
          },
        }}
      >
        <Stack sx={{ px: 2.5, py: 2 }}>
          <Box
            component="img"
            src="/landing/logo.png"
            alt="TradeGlobal"
            sx={{ height: 44, width: 'auto', objectFit: 'contain' }}
          />
        </Stack>
        <Stack spacing={0.5} sx={{ px: 1.5 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => handleAnchor(item.path)}
              sx={{
                justifyContent: 'flex-start',
                color: '#161616',
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 500,
                px: 2,
                '&:hover': { bgcolor: 'rgba(27,131,84,0.08)' },
              }}
            >
              {item.title}
            </Button>
          ))}
        </Stack>
        <Box sx={{ px: 2.5, mt: 3 }}>
          {isAuthenticated ? (
            <Stack spacing={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setOpenMenu(false);
                  handleGoToDashboard();
                }}
                sx={{
                  bgcolor: '#1B8354',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  gap: 1,
                  '&:hover': { bgcolor: '#166343' },
                }}
              >
                <DashboardRoundedIcon fontSize="small" />
                {t('nav.go_to_dashboard')}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={async () => {
                  setOpenMenu(false);
                  await handleLogout();
                }}
                sx={{
                  color: '#D32F2F',
                  borderColor: 'rgba(211,47,47,0.4)',
                  textTransform: 'none',
                  fontWeight: 600,
                  gap: 1,
                  '&:hover': { borderColor: '#D32F2F', bgcolor: 'rgba(211,47,47,0.06)' },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
                {t('nav.logout')}
              </Button>
            </Stack>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setOpenMenu(false);
                handleLogin();
              }}
              sx={{
                bgcolor: '#1B8354',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                gap: 1,
                '&:hover': { bgcolor: '#166343' },
              }}
            >
              <Iconify icon="solar:user-circle-bold" width={20} />
              {t('nav.login')}
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}