"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Link, usePathname, useRouter } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { scrollbar } from "src/theme/css";
import SvgColor from "src/components/svg-color";
import Iconify from "src/components/iconify";
import { allLocales } from "src/i18n/config-locale";
import { useAuth } from "src/contexts/AuthContext";
import { getNotificationUnreadCount } from "src/actions/notifications";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

interface SidebarIconProps {
  active?: boolean;
  src: string;
}

interface SidebarItem {
  key: string;
  icon: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  {
    key: "home",
    icon: "/icons/main.svg",
    path: "/",
  },
  {
    key: "my_orders",
    icon: "/icons/package.svg",
    path: "/orders",
  },
  {
    key: "quotation_requests",
    icon: "/icons/invoice.svg",
    path: "/quotation-requests",
  },
  {
    key: "invoices",
    icon: "/icons/invoice.svg",
    path: "/invoices",
  },
  {
    key: "profile",
    icon: "/icons/profile.svg",
    path: "/profile",
  },
  {
    key: "notifications",
    icon: "/icons/mingcute--notification-line.svg",
    path: "/notifications",
  },
  {
    key: "support",
    icon: "/icons/suport.svg",
    path: "/support",
  },
];

function SidebarIcon({ active = false, src }: SidebarIconProps) {
  return (
    <SvgColor
      src={src}
      sx={{
        width: 24,
        height: 24,
        color: active ? "#1B8354" : "#9DA4AE",
      }}
    />
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("Sidebar");
  const isRtl = locale === "ar";
  const anchor = isRtl ? "right" : "left";
  const { role } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    const fetchUnread = async () => {
      const res = await getNotificationUnreadCount();
      if (res.success && res.data) {
        setUnreadCount(res.data.unreadCount);
      }
    };
    if (role) {
      fetchUnread();
    }

    const handleUnreadChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      setUnreadCount(customEvent.detail.count);
    };

    window.addEventListener("notification-unread-changed", handleUnreadChanged);
    return () => {
      window.removeEventListener("notification-unread-changed", handleUnreadChanged);
    };
  }, [role]);

const supplierOnlyItems = ["invoices", "quotation_requests"];

const isVisible = (item: SidebarItem) => {
  if (supplierOnlyItems.includes(item.key) && role === "buyer") {
    return false;
  }

  return true;
};


  const isSupplierContext =
    role === "supplier" &&
    ((/^\/orders\/[^/]+\/[^/]+$/.test(pathname) && searchParams.get("role") === "supplier") ||
      (pathname.includes("/counterparty-profile") && searchParams.get("from") === "supplier"));

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    if (isSupplierContext) {
      if (path === "/quotation-requests") return true;
      if (path === "/orders") return false;
    }
    return pathname.startsWith(path);
  };

  const textAlign = isRtl ? "right" : "left";
  const justify = isRtl ? "flex-end" : "flex-start";

  const drawer = (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: { xs: 1.5, sm: 2 },
        pb: { xs: "calc(env(safe-area-inset-bottom) + 8px)", sm: 2 },
        height: "100%",
        bgcolor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <List disablePadding sx={{ flex: 1, minHeight: 0, overflow: "auto", ...scrollbar() }}>
        {sidebarItems.filter(isVisible).map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.key}
              href={item.path}
              style={{ textDecoration: "none" }}
              onClick={() => {
                if (!mdUp && onClose) {
                  onClose();
                }
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  gap: 1.5,
                  justifyContent: justify,
                  mb: { xs: 0.25, sm: 0.08 },
                  pr: 2,
                  pl: 2,
                  "&:hover": {
                    bgcolor: "#1B83541A",
                  },
                  "&.Mui-selected": {
                    bgcolor: "#1B83541A",
                    "&:hover": { bgcolor: "#1B83541A" },
                  },
                }}
                selected={active}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <SidebarIcon active={active} src={item.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: active ? 700 : 500,
                          textAlign,
                          color: active ? "#1B8354" : "#9DA4AE",
                        }}
                      >
                        {t(item.key)}
                      </Typography>
                      {item.key === "notifications" && unreadCount > 0 && (
                        <Box
                          sx={{
                            bgcolor: active ? "#1B83541A" : "#9DA4AE26",
                            color: active ? "#1B8354" : "#9DA4AE",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            borderRadius: "12px",
                            px: 1,
                            py: 0.25,
                            minWidth: 20,
                            textAlign: "center",
                            lineHeight: 1.2,
                          }}
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </Link>
          );
        })}
      </List>

      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pt: 1,
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 1.25,
            py: 1,
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            border: "1px solid #E6EFEA",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Iconify icon="solar:global-linear" width={20} sx={{ color: "#1B8354" }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#161C24" }}>
              {t("language")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {allLocales.map((loc) => {
              const active = loc.value === locale;
              return (
                <Box
                  key={loc.value}
                  onClick={() => changeLanguage(loc.value)}
                  sx={{
                    px: 1,
                    py: 0.4,
                    borderRadius: "999px",
                    fontSize: 11.5,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    border: "1px solid",
                    bgcolor: active ? "#1B8354" : "transparent",
                    borderColor: active ? "#1B8354" : "#E0E0E0",
                    color: active ? "#FFFFFF" : "#637381",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: active ? "#1B8354" : "rgba(27,131,84,0.08)",
                    },
                  }}
                >
                  {loc.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {role && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: 2,
              bgcolor: role === "buyer" ? "rgba(27,131,84,0.06)" : "rgba(124,58,237,0.06)",
              border: "1px solid",
              borderColor: role === "buyer" ? "rgba(27,131,84,0.15)" : "rgba(124,58,237,0.15)",
              direction: isRtl ? "rtl" : "ltr",
            }}
          >
            <ShieldRoundedIcon
              sx={{
                fontSize: 20,
                color: role === "buyer" ? "#1B8354" : "#7C3AED",
              }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: role === "buyer" ? "#1B8354" : "#7C3AED",
              }}
            >
              {t(`role.${role}`)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor={anchor}
      open={mdUp ? true : open}
      onClose={onClose}
      variant={mdUp ? "permanent" : "temporary"}
      ModalProps={{ keepMounted: true }}
      sx={{
        flexShrink: { md: 0 },
        width: { md: 280 },
        "& .MuiDrawer-paper": {
          bgcolor: "#EBEBEB",
          width: 280,
          boxSizing: "border-box",
          borderLeft: "none",
          borderRight: "none",
          top: "64px",
          height: { xs: "calc(100dvh - 64px)", md: "calc(100vh - 64px)" },
          ...scrollbar(),
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
