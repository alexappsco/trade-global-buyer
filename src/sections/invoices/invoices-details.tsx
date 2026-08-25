// 'use client';

// import { useMemo } from 'react';
// import { useLocale, useTranslations } from 'next-intl';
// import { useRouter } from 'src/i18n/routing';
// import {
//   Box,
//   Card,
//   Table,
//   Button,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableContainer,
//   Typography,
// } from '@mui/material';
// import Iconify from 'src/components/iconify';
// import { getInvoiceById } from './invoices-mock';

// interface Props {
//   id: string;
// }

// export default function InvoicesDetailsView({ id }: Props) {
//   const t = useTranslations('Invoices');
//   const locale = useLocale();
//   const router = useRouter();
//   const isRtl = locale === 'ar';

//   const invoice = useMemo(() => getInvoiceById(id), [id]);

//   if (!invoice) {
//     return (
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', py: 8 }}>
//         <Iconify icon="solar:danger-triangle-bold" width={48} sx={{ color: '#FFAB00' }} />
//         <Typography variant="h6" sx={{ color: 'text.secondary' }}>
//           {isRtl ? 'الفاتورة غير موجودة' : 'Invoice not found'}
//         </Typography>
//         <Button
//           variant="contained"
//           onClick={() => router.push('/invoices')}
//           sx={{
//             bgcolor: '#10754E',
//             color: 'white',
//             fontWeight: 600,
//             borderRadius: '8px',
//             px: 3,
//             py: 1,
//             boxShadow: 'none',
//             '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
//           }}
//         >
//           {isRtl ? 'العودة للفواتير' : 'Back to Invoices'}
//         </Button>
//       </Box>
//     );
//   }

//   const items = [
//     { id: 1, item: 'شاشة', quantity: 5, price: 400, total: 5000 },
//     { id: 2, item: 'كمبيوتر', quantity: 4, price: 400, total: 5000 },
//     { id: 3, item: 'لوحة مفاتيح', quantity: 3, price: 400, total: 5000 },
//     { id: 4, item: 'ماوس', quantity: 2, price: 400, total: 5000 },
//   ];

//   const totalAmount = invoice.amountPaid || 5000;

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//       {/* Upper Main Invoice Card */}
//       <Card
//         sx={{
//           borderRadius: 2,
//           p: { xs: 3, md: 5 },
//           boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
//           border: '1px solid #F4F6F8',
//           bgcolor: '#FFFFFF',
//         }}
//       >
//         {/* Header: Logo, Title & Date / Requested From */}
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
//           <Box
//             sx={{
//               display: 'flex',
//               justify: 'space-between',
//               alignItems: 'center',
//             }}
//           >
//             {/* Logo */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Box
//                 component="img"
//                 src="/assets/logo.svg"
//                 alt="TradeGlobal"
//                 sx={{ height: 36, display: 'block' }}
//                 onError={(e) => {
//                   (e.target as HTMLElement).style.display = 'none';
//                 }}
//               />
//               <Typography variant="h6" sx={{ fontWeight: 800, color: '#10754E' }}>
//                 TradeGlobal
//               </Typography>
//             </Box>

//             {/* Title */}
//             <Typography variant="h3" sx={{ fontWeight: 800, color: '#161C24' }}>
//               فاتورة
//             </Typography>
//           </Box>

//           {/* Sub Header info: Date & Company Name */}
//           <Box
//             sx={{
//               display: 'flex',
//               justify: 'space-between',
//               alignItems: 'center',
//               mt: 1,
//             }}
//           >
//             <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#161C24' }}>
//               التاريخ:{' '}
//               <Box component="span" sx={{ color: '#10754E' }}>
//                 {invoice.registeredAt.split(' ')[0] || '2026-04-10'}
//               </Box>
//             </Typography>

//             <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#161C24' }}>
//               المطلوب من:{' '}
//               <Box component="span" sx={{ color: '#10754E' }}>
//                 شركة نون
//               </Box>
//             </Typography>
//           </Box>
//         </Box>

//         {/* Invoice Items Table */}
//         <TableContainer sx={{ mb: 4 }}>
//           <Table sx={{ borderCollapse: 'separate', borderSpacing: '0' }}>
//             <TableHead>
//               <TableRow sx={{ bgcolor: '#F9FAFB' }}>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
//                   م
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
//                   الصنف
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
//                   الكمية
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
//                   السعر
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
//                   الاجمالي
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {items.map((row) => (
//                 <TableRow key={row.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
//                   <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
//                     {row.id}
//                   </TableCell>
//                   <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
//                     {row.item}
//                   </TableCell>
//                   <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
//                     {row.quantity}
//                   </TableCell>
//                   <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
//                     {row.price}
//                   </TableCell>
//                   <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
//                     {row.total}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Total Amount Row */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
//           <Typography variant="h5" sx={{ fontWeight: 800, color: '#161C24' }}>
//             المجموع :
//           </Typography>
//           <Typography variant="h5" sx={{ fontWeight: 800, color: '#10754E' }}>
//             {totalAmount.toLocaleString()}
//           </Typography>
//         </Box>

//         {/* Action Button: Print */}
//         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//           <Button
//             variant="contained"
//             onClick={() => window.print()}
//             startIcon={<Iconify icon="solar:printer-bold" width={18} />}
//             sx={{
//               bgcolor: '#10754E',
//               color: 'white',
//               fontWeight: 700,
//               fontSize: '1rem',
//               borderRadius: '8px',
//               px: 5,
//               py: 1.2,
//               boxShadow: 'none',
//               '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
//             }}
//           >
//             طباعة
//           </Button>
//         </Box>
//       </Card>

//       {/* Order Details Header Banner */}
//       <Box
//         sx={{
//           bgcolor: '#EAEFEA',
//           borderRadius: 2,
//           p: 2,
//           px: 3,
//           display: 'flex',
//           justify: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Typography variant="h6" sx={{ fontWeight: 800, color: '#161C24' }}>
//           الطلب رقم #{invoice.orderNumber || '5432'}
//         </Typography>

//         <Button
//           variant="contained"
//           startIcon={<Iconify icon="solar:eye-bold" width={18} />}
//           onClick={() => router.push(`/orders/${invoice.orderId}`)}
//           sx={{
//             bgcolor: '#10754E',
//             color: 'white',
//             fontWeight: 700,
//             borderRadius: '8px',
//             px: 2.5,
//             py: 0.8,
//             boxShadow: 'none',
//             '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
//           }}
//         >
//           تصفح تفاصيل المشترين
//         </Button>
//       </Box>

//       {/* Order Meta Info Card */}
//       <Card
//         sx={{
//           borderRadius: 2,
//           p: 3,
//           boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
//           border: '1px solid #F4F6F8',
//         }}
//       >
//         <Box
//           sx={{
//             display: 'grid',
//             gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
//             gap: 2,
//             textAlign: 'center',
//           }}
//         >
//           <Box>
//             <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
//               المدينة
//             </Typography>
//             <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
//               الرياض
//             </Typography>
//           </Box>

//           <Box>
//             <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
//               عنوان الشركة
//             </Typography>
//             <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
//               طريق الملك فهد، حي العليا
//             </Typography>
//           </Box>

//           <Box>
//             <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
//               تاريخ الانشاء
//             </Typography>
//             <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
//               {invoice.registeredAt.split(' ')[0] || '2026-04-10'}
//             </Typography>
//           </Box>

//           <Box>
//             <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
//               الحالة
//             </Typography>
//             <Typography variant="body1" sx={{ fontWeight: 700, color: '#FF3B30' }}>
//               مغلق
//             </Typography>
//           </Box>
//         </Box>
//       </Card>

//       {/* Offer Details Section Header */}
//       <Box sx={{ borderRight: '4px solid #10754E', pr: 1.5, my: 1 }}>
//         <Typography variant="h6" sx={{ fontWeight: 800, color: '#161C24' }}>
//           العرض المقدم من خلالك
//         </Typography>
//       </Box>

//       {/* Offer Meta Banner */}
//       <Box
//         sx={{
//           bgcolor: '#EAEFEA',
//           borderRadius: 2,
//           p: 2,
//           px: 3,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 3,
//           flexWrap: 'wrap',
//         }}
//       >
//         <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
//           عنوان الطلب:{' '}
//           <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
//             الرياض
//           </Box>
//         </Typography>

//         <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
//           الفئة:{' '}
//           <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
//             أجهزة كمبيوتر
//           </Box>
//         </Typography>

//         <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
//           التاريخ:{' '}
//           <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
//             2026-04-10
//           </Box>
//         </Typography>
//       </Box>

//       {/* Offer Items Table Card */}
//       <Card
//         sx={{
//           borderRadius: 2,
//           boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
//           border: '1px solid #DFE3E8',
//           overflow: 'hidden',
//         }}
//       >
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ bgcolor: '#F9FAFB' }}>
//               <TableRow>
//                 <TableCell align="right" sx={{ fontWeight: 700, color: '#637381' }}>
//                   الصنف
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
//                   الكمية
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
//                   تفاصيل الطلب
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
//                   سعر الوحدة
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               <TableRow hover>
//                 <TableCell align="right" sx={{ fontWeight: 700, color: '#10754E' }}>
//                   لابتوب
//                 </TableCell>
//                 <TableCell align="center" sx={{ color: '#212B36' }}>
//                   <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
//                     5
//                     <Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ color: '#637381' }} />
//                   </Box>
//                 </TableCell>
//                 <TableCell align="center" sx={{ color: '#212B36' }}>
//                   تفاصيل الطلب هنا
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
//                   500
//                 </TableCell>
//               </TableRow>

//               <TableRow hover>
//                 <TableCell align="right" sx={{ fontWeight: 700, color: '#10754E' }}>
//                   شاشة
//                 </TableCell>
//                 <TableCell align="center" sx={{ color: '#212B36' }}>
//                   <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
//                     7
//                     <Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ color: '#637381' }} />
//                   </Box>
//                 </TableCell>
//                 <TableCell align="center" sx={{ color: '#212B36' }}>
//                   تفاصيل الطلب هنا
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
//                   765
//                 </TableCell>
//               </TableRow>

//               <TableRow hover>
//                 <TableCell align="right" sx={{ fontWeight: 700, color: '#10754E' }}>
//                   ماوس
//                 </TableCell>
//                 <TableCell align="center" sx={{ color: '#212B36' }}>
//                   <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
//                     4
//                     <Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ color: '#637381' }} />
//                   </Box>
//                 </TableCell>
//                 <TableCell align="center" sx={{ color: '#212B36' }}>
//                   تفاصيل الطلب هنا
//                 </TableCell>
//                 <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
//                   800
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Card>
//     </Box>
//   );
// }

'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
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
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { getInvoiceById } from './invoices-mock';

interface Props {
  id: string;
}

export default function InvoicesDetailsView({ id }: Props) {
  const t = useTranslations('Invoices');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const invoice = useMemo(() => getInvoiceById(id), [id]);

  if (!invoice) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', py: 8 }}>
        <Iconify icon="solar:danger-triangle-bold" width={48} sx={{ color: '#FFAB00' }} />
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {isRtl ? 'الفاتورة غير موجودة' : 'Invoice not found'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/invoices')}
          sx={{
            bgcolor: '#10754E',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            px: 3,
            py: 1,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
          }}
        >
          {isRtl ? 'العودة للفواتير' : 'Back to Invoices'}
        </Button>
      </Box>
    );
  }

  const items = [
    { id: 1, item: 'شاشة', quantity: 5, price: 400, total: 5000 },
    { id: 2, item: 'كمبيوتر', quantity: 4, price: 400, total: 5000 },
    { id: 3, item: 'لوحة مفاتيح', quantity: 3, price: 400, total: 5000 },
    { id: 4, item: 'ماوس', quantity: 2, price: 400, total: 5000 },
  ];

  const totalAmount = invoice.amountPaid || 5000;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Upper Main Invoice Card */}
      <Card
        sx={{
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          border: '1px solid #F4F6F8',
          bgcolor: '#FFFFFF',
        }}
      >
        {/* Header: Logo & Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
           {/* Sub Header info: Date & Company Name */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#161C24' }}>
              التاريخ:{' '}
              <Box component="span" sx={{ color: '#10754E' }}>
                {invoice.registeredAt.split(' ')[0] || '2026-04-10'}
              </Box>
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#161C24' }}>
              المطلوب من:{' '}
              <Box component="span" sx={{ color: '#10754E' }}>
                شركة نون
              </Box>
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Title */}
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#161C24' }}>
              فاتورة
            </Typography>
            {/* Logo Image */}
            <Box
              component="img"
              src="/logo.png"
              alt="TradeGlobal Logo"
              sx={{ height: 48, objectFit: 'contain' }}
            />

          </Box>
        </Box>

        {/* Invoice Items Table */}
        <TableContainer sx={{ mb: 4 }}>
          <Table sx={{ borderCollapse: 'separate', borderSpacing: '0' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  م
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  الصنف
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  الكمية
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  السعر
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381', py: 1.5 }}>
                  الاجمالي
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {row.id}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {row.item}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {row.quantity}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {row.price}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#212B36', py: 2 }}>
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total Amount Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#161C24' }}>
            المجموع :
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#10754E' }}>
            {totalAmount.toLocaleString()}
          </Typography>
        </Box>

        {/* Action Button: Print */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => window.print()}
            startIcon={<Iconify icon="solar:printer-bold" width={18} />}
            sx={{
              bgcolor: '#10754E',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '8px',
              px: 5,
              py: 1.2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
            }}
          >
            طباعة
          </Button>
        </Box>
      </Card>

      {/* Order Details Header Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 2,
          p: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#161C24' }}>
          الطلب رقم #{invoice.orderNumber || '5432'}
        </Typography>

        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:eye-bold" width={18} />}
          onClick={() => router.push(`/orders/${invoice.orderId}`)}
          sx={{
            bgcolor: '#10754E',
            color: 'white',
            fontWeight: 700,
            borderRadius: '8px',
            px: 2.5,
            py: 0.8,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#0B5337', boxShadow: 'none' },
          }}
        >
          تصفح تفاصيل المشترين
        </Button>
      </Box>

      {/* Order Meta Info Card */}
      <Card
        sx={{
          borderRadius: 2,
          p: 3,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          border: '1px solid #F4F6F8',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              المدينة
            </Typography>
            <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
              الرياض
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              عنوان الشركة
            </Typography>
            <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
              طريق الملك فهد، حي العليا
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              تاريخ الانشاء
            </Typography>
            <Typography variant="body1" sx={{ color: '#919EAB', fontWeight: 500 }}>
              {invoice.registeredAt.split(' ')[0] || '2026-04-10'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#637381', mb: 1 }}>
              الحالة
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#FF3B30' }}>
              مغلق
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Offer Details Section Header */}
      <Box sx={{ borderRight: '4px solid #10754E', pr: 1.5, my: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#161C24' }}>
          العرض المقدم من خلالك
        </Typography>
      </Box>

      {/* Offer Meta Banner */}
      <Box
        sx={{
          bgcolor: '#EAEFEA',
          borderRadius: 2,
          p: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
          عنوان الطلب:{' '}
          <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
            الرياض
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
          الفئة:{' '}
          <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
            أجهزة كمبيوتر
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 700, color: '#212B36' }}>
          التاريخ:{' '}
          <Box component="span" sx={{ color: '#10754E', ml: 0.5 }}>
            2026-04-10
          </Box>
        </Typography>
      </Box>

      {/* Offer Items Table Card */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          border: '1px solid #DFE3E8',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#637381' }}>
                  الصنف
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  الكمية
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  تفاصيل الطلب
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#637381' }}>
                  سعر الوحدة
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#10754E' }}>
                  لابتوب
                </TableCell>
                <TableCell align="center" sx={{ color: '#212B36' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    5
                    <Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ color: '#637381' }} />
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#212B36' }}>
                  تفاصيل الطلب هنا
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
                  500
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#10754E' }}>
                  شاشة
                </TableCell>
                <TableCell align="center" sx={{ color: '#212B36' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    7
                    <Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ color: '#637381' }} />
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#212B36' }}>
                  تفاصيل الطلب هنا
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
                  765
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#10754E' }}>
                  ماوس
                </TableCell>
                <TableCell align="center" sx={{ color: '#212B36' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    4
                    <Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ color: '#637381' }} />
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#212B36' }}>
                  تفاصيل الطلب هنا
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#212B36' }}>
                  800
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}