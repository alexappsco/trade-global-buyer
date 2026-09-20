"use client";

import { useState } from "react";
import { useRouter, usePathname } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonIcon from "@mui/icons-material/Person";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Iconify from "src/components/iconify";
import { useAuth } from "src/contexts/AuthContext";
import { localesSettings, LocaleType, allLocales } from "src/i18n/config-locale";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

interface HeaderProps {
  onMenuClick?: () => void;
}

function formatDisplayPhone(phone?: string): string {
  if (!phone) return "";
  const clean = phone.replace(/[\s\-()]/g, "");
  let national = clean;
  if (clean.startsWith("+966")) national = clean.slice(4);
  else if (clean.startsWith("966")) national = clean.slice(3);

  if (/^\d{9}$/.test(national)) {
    return `+966 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
  }
  if (/^\d{10}$/.test(national)) {
    return `+966 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
  }
  return phone;
}

function getNameInitials(name?: string): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}

export default function Header({ onMenuClick }: HeaderProps) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const currentLocaleSetting = localesSettings[locale as LocaleType];
  const { logout, session } = useAuth();

  const [langAnchorEl, setLangAnchorEl] = useState<HTMLElement | null>(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<HTMLElement | null>(null);

  const handleLangOpen = (e: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(e.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLogout = () => {
    setAvatarAnchorEl(null);
    logout();
    router.push("/auth/login");
  };

  const changeLanguage = (newLocale: string) => {
    handleLangClose();
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: "none" }, color: "#171717" }}
          >
            <MenuIcon />
          </IconButton>

         <Box
            component="img"
            src="/logo_2.png"
            alt="Trade Global"
            sx={{ height: 66, marginInlineStart: { xs: 0, md: "60px" } }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, marginInlineEnd: { xs: 1, md: 2 } }}>
          <Box
            onClick={handleLangOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: "999px",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.06)",
              },
            }}
          >
            <Iconify
              icon={currentLocaleSetting?.icon || "emojione:flag-for-saudi-arabia"}
              width={20}
            />
            <Typography
              sx={{
                color: "#171717",
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {currentLocaleSetting?.label}
            </Typography>
            <ExpandMoreRoundedIcon sx={{ fontSize: 15, color: "#9DA4AE" }} />
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "rgba(0,0,0,0.12)", my: 0.75 }}
          />

          <IconButton
            onClick={(e) => setAvatarAnchorEl(e.currentTarget)}
            disableRipple
            sx={{ p: 0.5, "&:hover": { bgcolor: "rgba(0,0,0,0.06)" } }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#1B8354" }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLangClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 140,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
          },
        }}
      >
        {allLocales.map((loc) => (
          <MenuItem
            key={loc.value}
            selected={loc.value === locale}
            onClick={() => changeLanguage(loc.value)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Iconify icon={loc.icon} width={24} />
            </ListItemIcon>
            <ListItemText>{loc.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={avatarAnchorEl}
        open={Boolean(avatarAnchorEl)}
        onClose={() => setAvatarAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
            textAlign: "center",
            bgcolor: "#F8FBFA",
            borderBottom: "1px solid #E6EFEA",
          }}
        >
          <Avatar
            sx={{
              width: 46,
              height: 46,
              bgcolor: "#1B8354",
              fontSize: 17,
              fontWeight: 700,
            }}
          >
            {getNameInitials(session?.name) || <PersonIcon />}
          </Avatar>
          <Typography
            sx={{
              color: "#161C24",
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            {session?.name || "—"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Iconify icon="solar:phone-calling-rounded-bold" width={16} sx={{ color: "#10754E" }} />
            <Typography
              sx={{
                color: "#637381",
                fontSize: 13,
                fontWeight: 500,
                direction: "ltr",
                unicodeBidi: "plaintext",
                letterSpacing: 0.3,
              }}
            >
              {formatDisplayPhone(session?.phoneNumber)}
            </Typography>
          </Box>
        </Box>

        <MenuItem
          onClick={handleLogout}
          sx={{
            mx: 1,
            my: 0.75,
            borderRadius: "8px",
            color: "#D32F2F",
            "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
          >
            {t("logout")}
          </ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
