"use client";

import Link from "next/link";
import { usePathname } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { scrollbar } from "src/theme/css";
import SvgColor from "src/components/svg-color";
import { useAuth } from "src/contexts/AuthContext";
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
  const locale = useLocale();
  const t = useTranslations("Sidebar");
  const isRtl = locale === "ar";
  const anchor = isRtl ? "right" : "left";
  const { role } = useAuth();

const supplierOnlyItems = ["invoices", "quotation_requests"];

const isVisible = (item: SidebarItem) => {
  if (supplierOnlyItems.includes(item.key) && role === "buyer") {
    return false;
  }

  return true;
};


  const isActive = (path: string) =>
    path === "/" ? pathname === path : pathname.startsWith(path);

  const textAlign = isRtl ? "right" : "left";
  const justify = isRtl ? "flex-end" : "flex-start";

  const drawer = (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: 2,
        height: "100%",
        bgcolor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List disablePadding sx={{ flex: 1 }}>
        {sidebarItems.filter(isVisible).map((item) => {
          const active = isActive(item.path);

          return (
            <Link key={item.key} href={item.path} style={{ textDecoration: "none" }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  gap: 1.5,
                  justifyContent: justify,
                  mb: 0.08,
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
                  }
                />
              </ListItemButton>
            </Link>
          );
        })}
      </List>

      {role && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            p: 1.5,
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
          top: mdUp ? "64px" : undefined,
          height: mdUp ? "calc(100% - 64px)" : "100%",
          ...scrollbar(),
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
