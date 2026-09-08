'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from 'src/components/toast';
import {
  getQuotationOfferDetails,
  acceptQuotationOffer,
  declineQuotationOffer,
} from 'src/actions/quotations';
import type { QuotationOffer } from 'src/types/quotation';

interface Props {
  id: string;
  offerId: string;
}

export default function OrdersOfferDetailsView({ id, offerId }: Props) {
  const t = useTranslations('Orders');
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const isRtl = locale === 'ar';
  const currency = locale === 'ar' ? 'ر.س' : 'SAR';

  const [offer, setOffer] = useState<QuotationOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);

  const [showAlert, setShowAlert] = useState(true);
  const [openAcceptConfirm, setOpenAcceptConfirm] = useState(false);
  const [openRejectConfirm, setOpenRejectConfirm] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      setIsLoading(true);
      const res = await getQuotationOfferDetails(offerId);
      if (res.success && res.data) {
        setOffer(res.data);
      }
      setIsLoading(false);
    };
    fetchOffer();
  }, [offerId]);

  const formatMoney = (value: number) =>
    `${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

  const formatDate = (value: string) =>
    value ? new Date(value).toLocaleDateString(locale) : '—';

  const statusMeta: Record<QuotationOffer['status'], { label: string; color: string; bg: string }> = {
    pending: {
      label: t('offer_details.cards.awaiting'),
      color: '#B76E00',
      bg: 'rgba(255, 171, 0, 0.08)',
    },
    accepted: {
      label: t('details.offers.accepted'),
      color: '#006838',
      bg: 'rgba(0, 104, 56, 0.08)',
    },
    declined: {
      label: t('details.offers.rejected'),
      color: '#FF3B30',
      bg: 'rgba(255, 59, 48, 0.08)',
    },
    closed: {
      label: t('details.offers.closed'),
      color: '#637381',
      bg: 'rgba(99, 115, 129, 0.08)',
    },
  };

  const handleAccept = async () => {
    setOpenAcceptConfirm(false);
    setIsActing(true);
    const res = await acceptQuotationOffer(offerId);
    setIsActing(false);
    if (!res.success) {
      toast.error(res.error || (locale === 'ar' ? 'تعذر قبول العرض' : 'Unable to accept the offer'));
      return;
    }
    toast.success(locale === 'ar' ? 'تم قبول العرض بنجاح' : 'Offer accepted successfully');
    setOffer(res.data);
  };

  const handleReject = async () => {
    setOpenRejectConfirm(false);
    setIsActing(true);
    const res = await declineQuotationOffer(offerId);
    setIsActing(false);
    if (!res.success) {
      toast.error(res.error || (locale === 'ar' ? 'تعذر رفض العرض' : 'Unable to decline the offer'));
      return;
    }
    toast.success(locale === 'ar' ? 'تم رفض العرض' : 'Offer declined');
    setOffer(res.data);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </Typography>
      </Box>
    );
  }

  if (!offer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {locale === 'ar' ? 'لم يتم العثور على العرض' : 'Offer not found'}
        </Typography>
      </Box>
    );
  }

  const status = statusMeta[offer.status];
  const supplier = offer.counterparty;
  const showDecision = offer.status === 'pending' && !isActing;

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
            <Iconify icon="solar:danger-triangle-bold" width={24} sx={{ color: '#FFAB00', mt: 0.25 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#7A4100', lineHeight: 1.6 }}>
              {t('offer_details.alert_message')}
            </Typography>
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
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('details.title', { id: offer.orderNumber })}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => router.push('/orders')}
          sx={{
            borderColor: '#10754E',
            color: '#10754E',
            fontWeight: 600,
            borderRadius: '8px',
            px: 2.5,
            py: 1,
            gap: 1,
            textTransform: 'none',
            '&:hover': { borderColor: '#0c5b3c', bgcolor: 'rgba(16,117,78,0.04)' },
          }}
        >
          <Iconify icon="solar:arrow-left-bold" width={16} />
          {t('dialog.go_to_orders')}
        </Button>
      </Box>

      {/* Order Info Card */}
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
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 3,
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.order_id')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              #{offer.orderNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.created_at')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36', fontSize: '0.95rem' }}>
              {formatDate(offer.orderCreationTime)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.order_title')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36', fontSize: '0.95rem' }}>
              {offer.orderTitle}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.category')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36', fontSize: '0.95rem' }}>
              {locale === 'ar' ? offer.categoryNameAr : offer.categoryNameEn}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {t('details.info.status')}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: offer.orderStatus === 'open' ? '#006838' : '#637381' }}
            >
              {offer.orderStatus === 'open' ? t('status.open') : t('status.closed')}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Order Items Table Card */}
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
              {offer.items?.map((item, idx) => (
                <TableRow key={item.id ?? idx} hover>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#006838' }}>
                    {item.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ color: 'text.secondary' }}>
                    {item.details}
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
          mt: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('details.offers_title')}
        </Typography>
      </Box>

      {/* Summary Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: 2,
        }}
      >
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
            {offer.deliveryFee === 0 ? t('details.offers.free_delivery') : formatMoney(offer.deliveryFee)}
          </Typography>
        </Card>

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
            {formatMoney(offer.subtotal)}
          </Typography>
        </Card>

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
            {formatMoney(offer.grandTotal)}
          </Typography>
        </Card>

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
            {offer.deliveryDurationDays} {locale === 'ar' ? 'يوم' : 'days'}
          </Typography>
        </Card>

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
            {formatDate(offer.submissionTime)}
          </Typography>
        </Card>

        <Card sx={{ p: 2, border: '1px solid #F4F6F8', borderRadius: 2, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ bgcolor: status.bg, borderRadius: 1, p: 0.5, display: 'flex' }}>
              <Iconify icon="solar:info-circle-bold" width={18} sx={{ color: status.color }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#637381' }}>
              {t('offer_details.cards.status')}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: status.color }}>
            {status.label}
          </Typography>
        </Card>
      </Box>

      {/* Supplier & Address Strip */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 1,
          p: 1.5,
          px: 2.5,
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('offer_details.cards.supplier')}:{' '}
          <Box component="span" sx={{ color: '#006838', fontWeight: 700 }}>
            {supplier?.legalCompanyName || '—'}
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#161C24' }}>
          {t('offer_details.cards.address')}:{' '}
          <Box component="span" sx={{ color: '#006838', fontWeight: 700 }}>
            {supplier?.companyAddress || supplier?.city || '—'}
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
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('submit_offer.item_total')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offer.items?.map((item, idx) => (
                <TableRow key={item.id ?? idx} hover>
                  <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 600, color: '#006838' }}>
                    {item.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {formatMoney(item.unitPrice)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {formatMoney(item.itemTotal)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('offer_details.cards.delivery')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {formatMoney(offer.deliveryFee)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('offer_details.table.subtotal')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {formatMoney(offer.subtotal)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#637381' }}>
                  {t('offer_details.table.tax_rate')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {formatMoney(offer.tax)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#161C24' }}>
                  {t('offer_details.table.grand_total')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#006838' }}>
                  {formatMoney(offer.grandTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Decision Action Buttons */}
      {showDecision && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            mt: 1,
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
              gap: 1,
              minWidth: 180,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0c5b3c', boxShadow: 'none' },
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={18} />
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
              gap: 1,
              minWidth: 180,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#d32f2f', boxShadow: 'none' },
            }}
          >
            <Iconify icon="solar:close-circle-bold" width={18} />
            {t('offer_details.buttons.reject')}
          </Button>
        </Box>
      )}

      {/* Accept Offer Confirmation Dialog */}
      <ConfirmationDialog
        open={openAcceptConfirm}
        onClose={() => setOpenAcceptConfirm(false)}
        variant="success"
        title={t('dialog.confirm_accept_offer')}
        confirmLabel={t('dialog.confirm')}
        cancelLabel={t('dialog.cancel')}
        onConfirm={handleAccept}
      />

      {/* Reject Offer Confirmation Dialog */}
      <ConfirmationDialog
        open={openRejectConfirm}
        onClose={() => setOpenRejectConfirm(false)}
        variant="warning"
        title={t('dialog.confirm_reject_offer')}
        confirmLabel={t('dialog.confirm')}
        cancelLabel={t('dialog.cancel')}
        onConfirm={handleReject}
      />
    </Box>
  );
}