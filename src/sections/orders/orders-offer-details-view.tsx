'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'src/i18n/routing';
import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import ConfirmationDialog from 'src/components/dialog/ConfirmationDialog';
import { getOrderById } from './orders-mock';

interface Props {
  id: string;
  offerId: string;
}

export default function OrdersOfferDetailsView({ id, offerId }: Props) {
  const t = useTranslations('Orders');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const order = useMemo(() => getOrderById(id), [id]);

  // Alert State
  const [showAlert, setShowAlert] = useState(true);

  // Dialog States
  const [openAcceptConfirm, setOpenAcceptConfirm] = useState(false);
  const [openRejectConfirm, setOpenRejectConfirm] = useState(false);

  // Localized values helper
  const translateValue = (val: string) => {
    if (locale === 'en') {
      switch (val) {
        case 'لابتوب': return 'Laptop';
        case 'ماوس': return 'Mouse';
        case 'كيبورد': return 'Keyboard';
        case 'التفاصيل': return 'Details';
        case 'مورد ١': return 'Supplier 1';
        case 'مورد ٢': return 'Supplier 2';
        case 'مورد ٣': return 'Supplier 3';
        case 'الرياض': return 'Riyadh';
        case 'مجاني': return 'Free';
        case 'مفتوح': return 'Open';
        case 'مغلق': return 'Closed';
        case 'في انتظار الرد': return 'Awaiting Response';
        case 'أيام': return 'Days';
        case '3 أيام': return '3 Days';
        case 'نون': return 'Noon';
        case 'ملحقات اجهزة كمبيوتر': return 'Computer Accessories';
        case 'أجهزة كمبيوتر وملحقاته': return 'Computers and Accessories';
        default: return val;
      }
    }
    return val;
  };

  // Static/calculated values matching the design image precisely
  const orderItemsData = [
    { name: 'لابتوب', qty: 5, unitPrice: 500, label: t('offer_details.table.subtotal'), totalVal: '5000' },
    { name: 'ماوس', qty: 7, unitPrice: 765, label: t('offer_details.table.tax_rate'), totalVal: '500' },
    { name: 'كيبورد', qty: 4, unitPrice: 800, label: t('offer_details.table.grand_total'), totalVal: '5500' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Alert Notification Box */}
      <Collapse in={showAlert}>
        <Box
          sx={{
            bgcolor: '#FFF9E6',
            border: '1px solid #FFE699',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Iconify
              icon="solar:danger-triangle-bold"
              width={24}
              sx={{ color: '#FFAB00', mt: 0.25 }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#7A4100', lineHeight: 1.6 }}>
                {t('offer_details.alert_message')}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setShowAlert(false)} sx={{ color: '#7A4100' }}>
            <Iconify icon="eva:close-fill" width={18} />
          </IconButton>
        </Box>
      </Collapse>

      {/* Order Title Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 2,
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#161C24',
          }}
        >
          {t('details.title', { id: order.id })}
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push(`/orders/${order.id}`)}
          sx={{
            bgcolor: '#FF3B30',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#d32f2f',
              boxShadow: 'none',
            },
          }}
        >
          {t('details.close')}
        </Button>
      </Box>

      {/* Order Info Card (5-column layout) */}
      <Card
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          {/* 1. Order Number */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 100px' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.order_id')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {order.orderNumber}
            </Typography>
          </Box>

          {/* 2. Creation Date */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 120px' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.created_at')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {order.creationDate}
            </Typography>
          </Box>

          {/* 3. Order Title */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 150px' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.order_title')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#637381', fontSize: '0.95rem', textAlign: 'center' }}>
              {translateValue('ملحقات اجهزة كمبيوتر')}
            </Typography>
          </Box>

          {/* 4. Category */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 180px' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.category')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#637381', fontSize: '0.95rem', textAlign: 'center' }}>
              {translateValue('أجهزة كمبيوتر وملحقاته')}
            </Typography>
          </Box>

          {/* 5. Status */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 100px' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.status')}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#006838',
              }}
            >
              {order.status === 'open' ? t('status.open') : t('status.closed')}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Items Table Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.item')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.qty')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.details')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#006838', textDecoration: 'underline', cursor: 'pointer' }}>
                    {translateValue(item.name)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {item.qty}
                  </TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ color: 'text.secondary' }}>
                    {t('details.table.detail_link')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Section Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRight: isRtl ? '4px solid #10754E' : 'none',
          borderLeft: isRtl ? 'none' : '4px solid #10754E',
          pr: isRtl ? 1.5 : 0,
          pl: isRtl ? 0 : 1.5,
          mt: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('details.offers_title')}
        </Typography>
      </Box>

      {/* Summary Cards Grid (6 cards) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: 2,
        }}
      >
        
        {/* Card 1: Delivery */}
        <Card sx={{ p: 2, border: '1px solid #F4F6F8', borderRadius: 2, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ bgcolor: 'rgba(0, 104, 56, 0.08)', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <Iconify icon="solar:delivery-bold" width={18} sx={{ color: '#006838' }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#637381' }}>
              {t('offer_details.cards.delivery')}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#006838' }}>
            {t('details.offers.free_delivery')}
          </Typography>
        </Card>

        {/* Card 2: Subtotal */}
        <Card sx={{ p: 2, border: '1px solid #F4F6F8', borderRadius: 2, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ bgcolor: 'rgba(0, 104, 56, 0.08)', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <Iconify icon="solar:banknote-bold" width={18} sx={{ color: '#006838' }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#637381' }}>
              {t('offer_details.cards.total')}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#212B36' }}>
            5000
          </Typography>
        </Card>

        {/* Card 3: Tax included */}
        <Card sx={{ p: 2, border: '1px solid #F4F6F8', borderRadius: 2, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ bgcolor: 'rgba(0, 104, 56, 0.08)', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <Iconify icon="solar:bill-list-bold" width={18} sx={{ color: '#006838' }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#637381' }}>
              {t('offer_details.cards.tax')}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#212B36' }}>
            5000
          </Typography>
        </Card>

        {/* Card 4: Supply Duration */}
        <Card sx={{ p: 2, border: '1px solid #F4F6F8', borderRadius: 2, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ bgcolor: 'rgba(0, 104, 56, 0.08)', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <Iconify icon="solar:clock-circle-bold" width={18} sx={{ color: '#006838' }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#637381' }}>
              {t('offer_details.cards.duration')}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#212B36' }}>
            {translateValue('3 أيام')}
          </Typography>
        </Card>

        {/* Card 5: Offer Date */}
        <Card sx={{ p: 2, border: '1px solid #F4F6F8', borderRadius: 2, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ bgcolor: 'rgba(0, 104, 56, 0.08)', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <Iconify icon="solar:calendar-bold" width={18} sx={{ color: '#006838' }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#637381' }}>
              {t('offer_details.cards.offer_date')}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#212B36' }}>
            2025-11-10
          </Typography>
        </Card>

        {/* Card 6: Status */}
        <Card sx={{ p: 2, border: '1px solid #F4F6F8', borderRadius: 2, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ bgcolor: 'rgba(255, 171, 0, 0.08)', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <Iconify icon="solar:info-circle-bold" width={18} sx={{ color: '#FFAB00' }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#637381' }}>
              {t('offer_details.cards.status')}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFAB00' }}>
            {t('offer_details.cards.awaiting')}
          </Typography>
        </Card>

      </Box>

      {/* Supplier & Address horizontal strip info bar */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: '4px',
          p: 1.5,
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('offer_details.cards.supplier')}:{' '}
          <Box component="span" sx={{ color: '#006838', fontWeight: 700 }}>
            {translateValue('نون')}
          </Box>
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('offer_details.cards.address')}:{' '}
          <Box component="span" sx={{ color: '#006838', fontWeight: 700 }}>
            {translateValue('الرياض')}
          </Box>
        </Typography>
      </Box>

      {/* Offer Calculations Table Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.item')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.table.qty')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('offer_details.table.unit_price')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.offers.delivery')}
                </TableCell>
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('details.offers.free_delivery')}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orderItemsData.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#006838', textDecoration: 'underline', cursor: 'pointer' }}>
                    {translateValue(item.name)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {item.qty}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {item.unitPrice}
                  </TableCell>
                  {/* Summary Rows (Subtotal, Tax, Grand Total) embedded in column 4 and 5 */}
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {item.label}
                  </TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: idx === 2 ? '#006838' : 'text.primary' }}>
                    {item.totalVal}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Decision Action Buttons at the Bottom */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenAcceptConfirm(true)}
            sx={{
              bgcolor: '#10754E',
              color: 'white',
              fontWeight: 700,
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              minWidth: 200,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#0c5b3c',
                boxShadow: 'none',
              },
            }}
          >
            {t('offer_details.buttons.accept')}
          </Button>

          <Button
            variant="contained"
            onClick={() => setOpenRejectConfirm(true)}
            sx={{
              bgcolor: '#FF3B30',
              color: 'white',
              fontWeight: 700,
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              minWidth: 200,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#d32f2f',
                boxShadow: 'none',
              },
            }}
          >
            {t('offer_details.buttons.reject')}
          </Button>
        </Box>

        {/* Download Offer Details Button */}
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:printer-line-duotone" width={18} />}
          sx={{
            borderColor: '#10754E',
            color: '#10754E',
            fontWeight: 700,
            borderRadius: '8px',
            px: 4,
            py: 1.2,
            minWidth: 416,
            '&:hover': {
              borderColor: '#0c5b3c',
              bgcolor: 'rgba(16, 117, 78, 0.04)',
            },
          }}
        >
          {t('offer_details.buttons.download')}
        </Button>
      </Box>

      {/* Accept Offer Confirmation Dialog */}
      <ConfirmationDialog
        open={openAcceptConfirm}
        onClose={() => setOpenAcceptConfirm(false)}
        variant="success"
        title={t('dialog.confirm_accept_offer')}
        confirmLabel={t('dialog.confirm')}
        cancelLabel={t('dialog.cancel')}
        onConfirm={() => {
          setOpenAcceptConfirm(false);
          router.push(`/orders/${order.id}`);
        }}
      />

      {/* Reject Offer Confirmation Dialog */}
      <ConfirmationDialog
        open={openRejectConfirm}
        onClose={() => setOpenRejectConfirm(false)}
        variant="warning"
        title={t('dialog.confirm_reject_offer')}
        confirmLabel={t('dialog.confirm')}
        cancelLabel={t('dialog.cancel')}
        onConfirm={() => {
          setOpenRejectConfirm(false);
          router.push(`/orders/${order.id}`);
        }}
      />
    </Box>
  );
}
