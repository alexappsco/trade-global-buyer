'use client';

import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useLocale } from 'next-intl';

import { useRouter } from 'src/i18n/routing';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

const allLangs = [
  {
    label: 'العربية',
    value: 'ar',
    icon: 'flagpack:sa',
  },
  {
    label: 'English',
    value: 'en',
    icon: 'flagpack:gb-nir',
  },
] as const;

export default function LandingLanguagePopover() {
  const popover = usePopover();
  const locale = useLocale();
  const router = useRouter();

  const currentLang = allLangs.find((item) => item.value === locale) ?? allLangs[0];

  const handleChangeLang = (newLang: 'ar' | 'en') => {
    popover.onClose();

    if (newLang !== locale) {
      router.replace('/', { locale: newLang });
    }
  };

  return (
    <>
      <IconButton
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Iconify icon={currentLang.icon} sx={{ borderRadius: 0.65, width: 28 }} />
      </IconButton>

      <Typography variant="button" color="primary.main">
        {`${currentLang.value.toUpperCase()}`}
      </Typography>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        <MenuList sx={{ p: 0.5 }}>
          {allLangs.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === locale}
              onClick={() => handleChangeLang(option.value)}
            >
              <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />

              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}