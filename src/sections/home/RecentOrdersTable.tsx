'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Chip } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

import SharedTable from '@/components/SharedTable/SharedTable';
import { headCellType, cellAlignment, Action } from '@/components/SharedTable/types';
import { getOrders } from 'src/actions/orders';
import type { Order } from 'src/types/order';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'src/i18n/routing';
import { paths } from '@/routes/paths';
import { useToast } from "src/components/toast";
import { STATUS_STYLES } from 'src/sections/orders/status-styles';

const RECENT_ORDERS_LIMIT = 5;

export default function RecentOrdersTable() {
  const tHome = useTranslations('Home');
  const tOrders = useTranslations('Orders');
  const locale = useLocale();
  const router = useRouter();
  const { role, session } = useAuth();
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRecentOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrders({
          skipCount: 0,
          maxResultCount: RECENT_ORDERS_LIMIT,
        });
        if (cancelled) return;
        if (res.success && res.data) {
          setOrders(res.data.items ?? []);
        } else {
          setOrders([]);
          if (!res.success && res.error) {
            toast.error(res.error);
          }
        }
      } catch (err) {
        if (cancelled) return;
        setOrders([]);
        const errMsg = err instanceof Error ? err.message : tOrders('table.load_error');
        if (!errMsg.includes('abort') && !errMsg.includes('AbortError')) {
          toast.error(errMsg);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchRecentOrders();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const tableHead: headCellType[] = [
    { id: 'orderNumber', label: tOrders('table.order_id'), align: cellAlignment.right, width: 100 },
    { id: 'title', label: tOrders('table.order_title'), align: cellAlignment.right },
    { id: 'categoryNameEn', label: tOrders('table.category'), align: cellAlignment.right, hideOnMobile: true },
    // { id: 'classificationNameEn', label: tOrders('table.classification'), align: cellAlignment.right, hideOnMobile: true },
    { id: 'deliveryDate', label: tOrders('table.delivery_date'), align: cellAlignment.right, hideOnMobile: true },
    { id: 'creationTime', label: tOrders('table.creation_date'), align: cellAlignment.right, hideOnMobile: true },
    { id: 'status', label: tOrders('table.status'), align: cellAlignment.center },
  ];

  const customRender = {
    categoryNameEn: (row: Order) => (locale === 'ar' ? row.categoryNameAr : row.categoryNameEn),
    classificationNameEn: (row: Order) =>
      locale === 'ar' ? row.classificationNameAr : row.classificationNameEn,
    deliveryDate: (row: Order) => new Date(row.deliveryDate).toLocaleDateString(locale),
    creationTime: (row: Order) => new Date(row.creationTime).toLocaleDateString(locale),
    status: (row: Order) => {
      const styles = STATUS_STYLES[row.status] ?? { bgcolor: '#F4F6F8', color: '#6B7280' };
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={row.status}
            size="small"
            sx={{
              bgcolor: styles.bgcolor,
              color: styles.color,
              fontWeight: 'bold',
              borderRadius: 1.5,
            }}
          />
        </Box>
      );
    },
  };

  const actions: Action<Order>[] = [
    {
      label: tOrders('table.action_view'),
      icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: 18 }} />,
      onClick: (row) => {
        router.push(`/orders/${row.id}`);
      },
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          bgcolor: '#E4ECE8',
          p: 2,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: { xs: '1rem', md: '1.25rem' } }}>
          {tHome('recent_orders.title')}
        </Typography>
        {role !== 'supplier' && (
          <Button
            variant="contained"
            onClick={() => {
                if (session && !session.profileCompleted) {
                  toast.warning(tOrders("complete_profile_required"));
                  router.push(paths.profile.view);
                  return;
                }
                router.push("/orders/create");
              }}
            sx={{
              bgcolor: '#1B8354',
              '&:hover': { bgcolor: '#146440' },
              borderRadius: 2,
              px: { xs: 2, md: 3 },
              boxShadow: 'none',
              fontWeight: 'bold',
              gap: 1,
            }}
          >
            <AddIcon />
            {tHome('recent_orders.add_new')}
          </Button>
        )}
        
      </Box>

      <Card elevation={0} sx={{ borderRadius: 3, p: 2, bgcolor: '#ffffff' }}>
        <SharedTable
          loading={isLoading}
          data={orders}
          tableHead={tableHead}
          actions={actions}
          customRender={customRender}
          count={orders.length}
        />
      </Card>
    </Box>
  );
}
