"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonIcon from "@mui/icons-material/Person";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Iconify from "src/components/iconify";
import HeaderNotifications from "src/components/HeaderNotifications";
import { useAuth } from "src/contexts/AuthContext";
import { localesSettings, LocaleType, allLocales } from "src/i18n/config-locale";
import {
  AppBar,
  Avatar,
  Box,
  Collapse,
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
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (!avatarAnchorEl) setLangOpen(false);
  }, [avatarAnchorEl]);

  const handleLangOpen = (e: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(e.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleGoToLanding = () => {
    setAvatarAnchorEl(null);
    router.push("/landing");
  };

  const handleLogout = async () => {
    setAvatarAnchorEl(null);
    await logout();
    window.location.replace(`/${locale}`);
  };

  const changeLanguage = (newLocale: string) => {
    handleLangClose();
    setAvatarAnchorEl(null);
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
      <Toolbar
        sx={{
          minHeight: 64,
          height: 64,
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          flexWrap: "nowrap",
          gap: 1,
        }}
      >
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
            src="/frq_logo.svg"
            alt="COST FRQ"
            sx={{ height: { xs: 34, md: 48 }, marginInlineStart: { xs: 0, md: "60px" } }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2.5 }, marginInlineEnd: { xs: 1, md: 2 } }}>
          <Box
            onClick={handleLangOpen}
            sx={{
              display: { xs: "none", md: "flex" },
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

          <HeaderNotifications />

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
            <Avatar
              src={session?.avatarUrl}
              alt={session?.name}
              sx={{ width: 36, height: 36, bgcolor: "#1B8354" }}
            >
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
            src={session?.avatarUrl}
            alt={session?.name}
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

        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <MenuItem
            onClick={() => setLangOpen((v) => !v)}
            sx={{
              mx: 1,
              my: 0.75,
              borderRadius: "8px",
              color: "#161C24",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.06)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#1B8354" }}>
              <Iconify icon="solar:global-linear" width={22} />
            </ListItemIcon>
            <ListItemText
              slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
            >
              {t("language")}
            </ListItemText>
            <ExpandMoreRoundedIcon
              sx={{
                fontSize: 20,
                color: "#9DA4AE",
                transition: "transform 0.2s ease",
                transform: langOpen ? "rotate(180deg)" : "none",
              }}
            />
          </MenuItem>

          <Collapse in={langOpen} timeout="auto" unmountOnExit>
            {allLocales.map((loc) => (
              <MenuItem
                key={loc.value}
                selected={loc.value === locale}
                onClick={() => changeLanguage(loc.value)}
                sx={{
                  mx: 1,
                  my: 0.75,
                  ml: 3,
                  borderRadius: "8px",
                  color: "#161C24",
                  "&.Mui-selected": {
                    bgcolor: "rgba(27, 131, 84, 0.08)",
                  },
                  "&:hover": { bgcolor: "rgba(27, 131, 84, 0.08)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Iconify icon={loc.icon} width={22} />
                </ListItemIcon>
                <ListItemText
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 14,
                        fontWeight: loc.value === locale ? 700 : 500,
                        color: loc.value === locale ? "#1B8354" : "#161C24",
                      },
                    },
                  }}
                >
                  {loc.label}
                </ListItemText>
                {loc.value === locale && (
                  <Iconify icon="solar:check-circle-bold" width={18} sx={{ color: "#1B8354" }} />
                )}
              </MenuItem>
            ))}
          </Collapse>

          <Divider sx={{ mx: 1.5, my: 0.25 }} />
        </Box>

        <MenuItem
          onClick={handleGoToLanding}
          sx={{
            mx: 1,
            my: 0.75,
            borderRadius: "8px",
            color: "#161C24",
            "&:hover": { bgcolor: "rgba(27, 131, 84, 0.08)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "#1B8354" }}>
            <Iconify icon="solar:shop-2-linear" width={20} />
          </ListItemIcon>
          <ListItemText
            slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600, color: "#1B8354" } } }}
          >
            {t("landing_page")}
          </ListItemText>
        </MenuItem>

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
