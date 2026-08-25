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
  TextField,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import ConfirmationDialog from 'src/components/dialog/ConfirmationDialog';
import { getOrderById } from './orders-mock';
import { MOCK_QUOTATION_REQUESTS } from '../quotations/quotations-mock';

interface Props {
  id: string;
  offerId: string;
}

export default function OrdersOfferDetailsView({ id, offerId }: Props) {
  const tOrders = useTranslations('Orders');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const order = useMemo(() => getOrderById(id), [id]);

  // Load the corresponding quotation request to determine UI state
  const quotationRequest = useMemo(() => {
    return MOCK_QUOTATION_REQUESTS.find((q) => q.id === offerId);
  }, [offerId]);

  const actionType = quotationRequest?.actionType || 'submit';
  const offerStatus = quotationRequest?.offerStatus || 'pending';
  const orderNumber = quotationRequest?.orderNumber || order.orderNumber || '2654';

  // Dialog States
  const [openConfirmSubmit, setOpenConfirmSubmit] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  // Localized values helper
  const translateValue = (val: string) => {
    if (locale === 'en') {
      switch (val) {
        case 'لابتوب': return 'Laptop';
        case 'ماوس': return 'Mouse';
        case 'كيبورد': return 'Keyboard';
        case 'شاشة': return 'Screen';
        case 'الرياض': return 'Riyadh';
        case 'مفتوح': return 'Open';
        case 'مغلق': return 'Closed';
        case 'أجهزة كمبيوتر': return 'Computers';
        default: return val;
      }
    }
    return val;
  };

  // Static/calculated items data matching design Precisely
  const items = useMemo(() => {
    if (id === '5432' || order.id === '5432') {
      return [
        { name: 'لابتوب', qty: 5, details: isRtl ? 'تفاصيل الطلب هنا' : 'Order details here' },
        { name: 'شاشة', qty: 7, details: isRtl ? 'تفاصيل الطلب هنا' : 'Order details here' },
        { name: 'ماوس', qty: 4, details: isRtl ? 'تفاصيل الطلب هنا' : 'Order details here' },
      ];
    }
    // Fallback to order items if defined, else generic defaults
    const list = order.items && order.items.length > 0 ? order.items : [
      { name: 'لابتوب', qty: 5 },
      { name: 'شاشة', qty: 7 },
      { name: 'ماوس', qty: 4 },
    ];
    return list.map(item => ({
      name: item.name,
      qty: item.qty,
      details: isRtl ? 'تفاصيل الطلب هنا' : 'Order details here'
    }));
  }, [id, order.id, order.items, isRtl]);

  // Form Inputs State
  const [unitPrices, setUnitPrices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    items.forEach((item) => {
      // Default mock values for view_submitted matching design: Laptop=500, Screen=765, Mouse=800 (Keyboard fallback to 800)
      if (item.name === 'لابتوب') initial[item.name] = '500';
      else if (item.name === 'شاشة' || item.name === 'ماوس') initial[item.name] = '765';
      else if (item.name === 'كيبورد' || item.name === 'ماوس') initial[item.name] = '800';
      else initial[item.name] = '500';
    });
    return initial;
  });

  const [deliveryPrice, setDeliveryPrice] = useState<string>('500');
  const [supplyDuration, setSupplyDuration] = useState<string>('500');

  // Localized Labels
  const labels = {
    city: isRtl ? 'المدينة' : 'City',
    companyAddress: isRtl ? 'عنوان الشركة' : 'Company Address',
    creationDate: isRtl ? 'تاريخ الانشاء' : 'Creation Date',
    status: isRtl ? 'الحالة' : 'Status',
    open: isRtl ? 'مفتوح' : 'Open',
    closed: isRtl ? 'مغلق' : 'Closed',
    submitTitle: isRtl ? 'تقديم عرض على هذا الطلب' : 'Submit Offer on this Order',
    viewSubmittedTitle: isRtl ? 'العرض المقدم' : 'Submitted Offer',
    orderTitle: isRtl ? 'عنوان الطلب' : 'Order Title',
    category: isRtl ? 'الفئة' : 'Category',
    date: isRtl ? 'التاريخ' : 'Date',
    item: isRtl ? 'الصنف' : 'Item',
    quantity: isRtl ? 'الكمية' : 'Quantity',
    details: isRtl ? 'تفاصيل الطلب' : 'Order Details',
    unitPrice: isRtl ? 'سعر الوحدة' : 'Unit Price',
    delivery: isRtl ? 'التوصيل' : 'Delivery',
    subtotal: isRtl ? 'الاجمالي' : 'Subtotal',
    tax: isRtl ? 'الضريبة 15%' : 'Tax 15%',
    grandTotal: isRtl ? 'الاجمالي شامل الضريبة' : 'Grand Total (Inc. Tax)',
    supplyDuration: isRtl ? 'مدة التوريد' : 'Supply Duration',
    send: isRtl ? 'ارسال' : 'Send',
    cancel: isRtl ? 'الغاء' : 'Cancel',
    confirm: isRtl ? 'تأكيد' : 'Confirm',
    confirmText: isRtl 
      ? 'أنت على وشك ارسال العرض علماً بأنه في حالة قبول المشتري عرضك، سيتم تحصيل عمولة للمنصة قدرها 2 % من اجمالي البيع' 
      : 'You are about to send the offer. Note that if the buyer accepts your offer, a platform commission of 2% of the grand total will be charged.',
    successText: isRtl ? 'تم ارسال العرض بنجاح.' : 'Offer sent successfully.',
    viewNow: isRtl ? 'اطلع عليه الان' : 'View it now',
    skipToOrders: isRtl ? 'التخطي والذهاب الى الطلبات' : 'Skip and go to Orders',
    
    // Banner specific strings
    acceptedText: isRtl ? `تهانينا، تم قبول عرضك على الطلب رقم #${orderNumber}` : `Congratulations, your offer has been accepted on order #${orderNumber}`,
    rejectedText: isRtl ? `تم رفض العرض المقدم على الطلب رقم #${orderNumber} شكرا لمشاركتكم.` : `The offer submitted on order #${orderNumber} was rejected, thank you for participating.`,
    closedText: isRtl ? `تم اغلاق الطلب رقم #${orderNumber}` : `Order #${orderNumber} has been closed`,
    browseBuyer: isRtl ? 'تصفح تفاصيل المشتري' : 'Browse Buyer Details',
    browseOthers: isRtl ? 'تصفح الطلبات الأخرى' : 'Browse Other Orders',
  };

  // Dynamic calculations
  const subtotal = useMemo(() => {
    let sum = 0;
    items.forEach((item) => {
      const price = Number(unitPrices[item.name] || 0);
      sum += item.qty * price;
    });
    sum += Number(deliveryPrice || 0);
    return sum;
  }, [items, unitPrices, deliveryPrice]);

  const tax = useMemo(() => Math.round(subtotal * 0.15), [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handlePriceChange = (itemName: string, val: string) => {
    if (/^\d*$/.test(val)) {
      setUnitPrices((prev) => ({ ...prev, [itemName]: val }));
    }
  };

  const handleDeliveryChange = (val: string) => {
    if (/^\d*$/.test(val)) {
      setDeliveryPrice(val);
    }
  };

  const handleDurationChange = (val: string) => {
    if (/^\d*$/.test(val)) {
      setSupplyDuration(val);
    }
  };

  const handleSend = () => {
    setOpenConfirmSubmit(true);
  };

  const handleCancel = () => {
    router.push('/quotation-requests');
  };

  // Render prices in read-only mode matching design
  const getReadOnlyPrice = (itemName: string) => {
    if (actionType === 'cannot_submit') return '-';
    // Display fixed values matching images (Laptop=500, Screen=765, Mouse=800)
    if (itemName === 'لابتوب') return '500';
    if (itemName === 'شاشة') return '765';
    if (itemName === 'ماوس' || itemName === 'كيبورد') return '800';
    return unitPrices[itemName] || '500';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* 1. Conditional Status Banners on Top (Only for read-only view) */}
      {actionType !== 'submit' && (
        <>
          {/* Green Accepted Banner */}
          {offerStatus === 'accepted' && (
            <Box
              sx={{
                bgcolor: '#E6EFEA',
                border: '1px solid #B7CBB7',
                borderRadius: '8px',
                p: 2,
                px: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0, 104, 56, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:check-circle-bold" width={20} sx={{ color: '#006838' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#006838' }}>
                  {labels.acceptedText}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => router.push('/profile')}
                startIcon={<Iconify icon="solar:eye-bold" width={16} />}
                sx={{
                  bgcolor: '#006838',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '24px',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#00502b', boxShadow: 'none' },
                }}
              >
                {labels.browseBuyer}
              </Button>
            </Box>
          )}

          {/* Yellow/Orange Banner for Rejected */}
          {offerStatus === 'rejected' && (
            <Box
              sx={{
                bgcolor: '#FFF9E6',
                border: '1px solid #FFE699',
                borderRadius: '8px',
                p: 2,
                px: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 171, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:danger-triangle-bold" width={20} sx={{ color: '#FFAB00' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#7A4100' }}>
                  {labels.rejectedText}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => router.push('/quotation-requests')}
                startIcon={<Iconify icon="solar:eye-bold" width={16} />}
                sx={{
                  bgcolor: '#FFAB00',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '24px',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#e09600', boxShadow: 'none' },
                }}
              >
                {labels.browseOthers}
              </Button>
            </Box>
          )}

          {/* Yellow/Orange Banner for Closed or Cannot Submit */}
          {(offerStatus === 'closed' || actionType === 'cannot_submit') && (
            <Box
              sx={{
                bgcolor: '#FFF9E6',
                border: '1px solid #FFE699',
                borderRadius: '8px',
                p: 2,
                px: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 171, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:danger-triangle-bold" width={20} sx={{ color: '#FFAB00' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#7A4100' }}>
                  {labels.closedText}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => router.push('/quotation-requests')}
                startIcon={<Iconify icon="solar:eye-bold" width={16} />}
                sx={{
                  bgcolor: '#FFAB00',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '24px',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#e09600', boxShadow: 'none' },
                }}
              >
                {labels.browseOthers}
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Title Header Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 1,
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#161C24' }}>
          {isRtl ? `الطلب رقم #${orderNumber}` : `Order #${orderNumber}`}
        </Typography>
      </Box>

      {/* Metadata Info Card */}
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
            gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
            gap: 3,
            textAlign: 'center',
          }}
        >
          {/* 1. City */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {labels.city}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {translateValue('الرياض')}
            </Typography>
          </Box>

          {/* 2. Company Address */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {labels.companyAddress}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {isRtl ? 'طريق الملك فهد، حي العليا' : 'King Fahd Rd, Al Olaya'}
            </Typography>
          </Box>

          {/* 3. Creation Date */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {labels.creationDate}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212B36' }}>
              {order.creationDate || '2026-04-10'}
            </Typography>
          </Box>

          {/* 4. Status */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              {labels.status}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: (actionType === 'cannot_submit' || offerStatus === 'closed') ? '#FF3B30' : '#006838',
              }}
            >
              {(actionType === 'cannot_submit' || offerStatus === 'closed') ? labels.closed : labels.open}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Section Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          ...(isRtl
            ? { borderRight: '4px solid #006838', pr: 1.5 }
            : { borderLeft: '4px solid #006838', pl: 1.5 }),
          my: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#161C24' }}>
          {actionType === 'submit' ? labels.submitTitle : labels.viewSubmittedTitle}
        </Typography>
      </Box>

      {/* Green-tinted banner bar */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 1,
          p: 1.5,
          px: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: '#006838', fontWeight: 700 }}>
          {isRtl
            ? `عنوان الطلب: ${translateValue('الرياض')} | الفئة: ${translateValue(order.category || 'أجهزة كمبيوتر')} | التاريخ: ${order.creationDate || '2026-04-10'}`
            : `Order Title: ${translateValue('الرياض')} | Category: ${translateValue(order.category || 'Computers')} | Date: ${order.creationDate || '2026-04-10'}`}
        </Typography>
      </Box>

      {/* Table Form Card */}
      <Card
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid #F4F6F8',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F4F6F8' }}>
                <TableCell sx={{ color: '#6b7280', fontWeight: 600, borderBottom: 'none' }}>{labels.item}</TableCell>
                <TableCell align="center" sx={{ color: '#6b7280', fontWeight: 600, borderBottom: 'none' }}>{labels.quantity}</TableCell>
                <TableCell align="center" sx={{ color: '#6b7280', fontWeight: 600, borderBottom: 'none' }}>{labels.details}</TableCell>
                <TableCell align="center" sx={{ color: '#6b7280', fontWeight: 600, borderBottom: 'none' }}>{labels.unitPrice}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {/* Item Rows */}
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 600, color: '#006838', borderBottom: actionType === 'submit' ? '1px solid #F4F6F8' : 'none' }}>
                    {translateValue(item.name)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: actionType === 'submit' ? '1px solid #F4F6F8' : 'none' }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      {item.qty}
                      <Iconify icon="eva:chevron-down-fill" width={16} sx={{ color: 'text.secondary' }} />
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#637381', borderBottom: actionType === 'submit' ? '1px solid #F4F6F8' : 'none' }}>
                    {item.details}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: actionType === 'submit' ? '1px solid #F4F6F8' : 'none' }}>
                    {actionType === 'submit' ? (
                      <TextField
                        size="small"
                        value={unitPrices[item.name] || ''}
                        onChange={(e) => handlePriceChange(item.name, e.target.value)}
                        slotProps={{
                          htmlInput: {
                            style: { textAlign: 'center' }
                          }
                        }}
                        sx={{
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#fff',
                            '& fieldset': { borderColor: '#EAEFEA' },
                            '&:hover fieldset': { borderColor: '#DFE3E8' },
                            '&.Mui-focused fieldset': { borderColor: '#10754E' },
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={{ fontWeight: 600, color: '#212B36', textAlign: 'center' }}>
                        {getReadOnlyPrice(item.name)}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Summary Rows (Only shown for editable submission flow) */}
              {actionType === 'submit' && (
                <>
                  {/* Delivery Row */}
                  <TableRow>
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#161C24', borderBottom: '1px solid #F4F6F8', py: 2 }}>
                      {labels.delivery}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid #F4F6F8' }}>
                      <TextField
                        size="small"
                        value={deliveryPrice}
                        onChange={(e) => handleDeliveryChange(e.target.value)}
                        slotProps={{
                          htmlInput: {
                            style: { textAlign: 'center' }
                          }
                        }}
                        sx={{
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#fff',
                            '& fieldset': { borderColor: '#EAEFEA' },
                            '&:hover fieldset': { borderColor: '#DFE3E8' },
                            '&.Mui-focused fieldset': { borderColor: '#10754E' },
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Subtotal Row */}
                  <TableRow>
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#161C24', borderBottom: '1px solid #F4F6F8', py: 2 }}>
                      {labels.subtotal}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid #F4F6F8' }}>
                      <TextField
                        disabled
                        size="small"
                        value={subtotal}
                        slotProps={{
                          htmlInput: {
                            style: { textAlign: 'center' }
                          }
                        }}
                        sx={{
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#F4F6F8',
                            '& fieldset': { borderColor: '#EAEFEA' },
                          },
                          '& .MuiInputBase-input.Mui-disabled': {
                            color: '#212B36',
                            WebkitTextFillColor: '#212B36',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Tax Row */}
                  <TableRow>
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#161C24', borderBottom: '1px solid #F4F6F8', py: 2 }}>
                      {labels.tax}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid #F4F6F8' }}>
                      <TextField
                        disabled
                        size="small"
                        value={tax}
                        slotProps={{
                          htmlInput: {
                            style: { textAlign: 'center' }
                          }
                        }}
                        sx={{
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#F4F6F8',
                            '& fieldset': { borderColor: '#EAEFEA' },
                          },
                          '& .MuiInputBase-input.Mui-disabled': {
                            color: '#212B36',
                            WebkitTextFillColor: '#212B36',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Grand Total Row */}
                  <TableRow>
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell sx={{ borderBottom: '1px solid #F4F6F8' }} />
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#161C24', borderBottom: '1px solid #F4F6F8', py: 2 }}>
                      {labels.grandTotal}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid #F4F6F8' }}>
                      <TextField
                        disabled
                        size="small"
                        value={grandTotal}
                        slotProps={{
                          htmlInput: {
                            style: { textAlign: 'center' }
                          }
                        }}
                        sx={{
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#F4F6F8',
                            '& fieldset': { borderColor: '#EAEFEA' },
                          },
                          '& .MuiInputBase-input.Mui-disabled': {
                            color: '#212B36',
                            WebkitTextFillColor: '#212B36',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Supply Duration Row */}
                  <TableRow>
                    <TableCell sx={{ borderBottom: 'none' }} />
                    <TableCell sx={{ borderBottom: 'none' }} />
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#161C24', borderBottom: 'none', py: 2 }}>
                      {labels.supplyDuration}
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: 'none' }}>
                      <TextField
                        size="small"
                        value={supplyDuration}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        slotProps={{
                          htmlInput: {
                            style: { textAlign: 'center' }
                          }
                        }}
                        sx={{
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            bgcolor: '#fff',
                            '& fieldset': { borderColor: '#EAEFEA' },
                            '&:hover fieldset': { borderColor: '#DFE3E8' },
                            '&.Mui-focused fieldset': { borderColor: '#10754E' },
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </>
              )}

            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Buttons (Only shown for editable submission flow) */}
      {actionType === 'submit' && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          
          {/* Send Button */}
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{
              bgcolor: '#10754E',
              color: 'white',
              fontWeight: 700,
              borderRadius: '8px',
              px: 6,
              py: 1.5,
              minWidth: 160,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0c5b3c', boxShadow: 'none' },
            }}
          >
            {labels.send}
          </Button>

          {/* Cancel Button */}
          <Button
            variant="contained"
            onClick={handleCancel}
            sx={{
              bgcolor: '#FF3B30',
              color: 'white',
              fontWeight: 700,
              borderRadius: '8px',
              px: 6,
              py: 1.5,
              minWidth: 160,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#d32f2f', boxShadow: 'none' },
            }}
          >
            {labels.cancel}
          </Button>

        </Box>
      )}

      {/* Confirmation warning platform fee dialog */}
      <ConfirmationDialog
        open={openConfirmSubmit}
        onClose={() => setOpenConfirmSubmit(false)}
        variant="success"
        title={labels.confirmText}
        confirmLabel={labels.confirm}
        cancelLabel={labels.cancel}
        onConfirm={() => {
          setOpenConfirmSubmit(false);
          setOpenSuccess(true);
        }}
      />

      {/* Success Dialog */}
      <ConfirmationDialog
        open={openSuccess}
        onClose={() => {
          setOpenSuccess(false);
          router.push('/quotation-requests');
        }}
        variant="success"
        title={labels.successText}
        confirmLabel={labels.viewNow}
        cancelLabel={labels.skipToOrders}
        cancelVariant="gray"
        onConfirm={() => {
          setOpenSuccess(false);
        }}
      />

    </Box>
  );
}
