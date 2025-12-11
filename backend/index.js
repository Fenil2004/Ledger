const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Configure Cloudinary (add these to .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(bodyParser.json());

// Helper: Upload image to Cloudinary
async function uploadToCloudinary(file, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

// Helper: Map transaction for frontend
function mapTransaction(tx) {
  return {
    id: tx.id,
    transaction_type: tx.type === 'buy' ? 'buying' : 'selling',
    type: tx.type,
    date: tx.date,
    party_id: tx.partyId,
    party_name: tx.party?.name || 'Unknown',
    phone: tx.phone,
    total_weight: tx.totalWeight,
    total_payment: tx.totalPayment,
    notes: tx.notes,
    invoice_image: tx.invoiceImage,
    receipt_image: tx.receiptImage,
    created_by: tx.createdBy,
    created_date: tx.createdAt,
    buy_items: tx.buyItems?.map(item => ({
      id: item.id,
      hny_color: item.hnyColor,
      black_color: item.blackColor,
    })) || [],
    sell_items: tx.sellItems?.map(item => ({
      id: item.id,
      item_code: item.itemCode,
      payment: item.payment,
      shoes_hny: item.shoesHny,
      sheet_hny: item.sheetHny,
      shoes_black: item.shoesBlack,
      sheet_black: item.sheetBlack,
    })) || [],
  };
}

// ============ HEALTH CHECK ============
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// ============ USER ROUTES ============
app.post('/api/users/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    let profileImage = null;
    
    if (req.file) {
      profileImage = await uploadToCloudinary(req.file, 'users');
    }
    
    const user = await prisma.user.create({
      data: { email, name, password, role: role || 'user', profileImage },
      select: { id: true, email: true, name: true, role: true, profileImage: true, createdAt: true },
    });
    
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, name: true, role: true, profileImage: true, isActive: true, createdAt: true },
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PARTY ROUTES ============
app.get('/api/parties', async (req, res) => {
  try {
    const parties = await prisma.party.findMany({
      orderBy: { createdAt: 'desc' },
      include: { creator: { select: { email: true, name: true } } },
    });
    
    res.json(parties.map(p => ({
      id: p.id,
      name: p.name,
      phone: p.phone,
      email: p.email,
      address: p.address,
      notes: p.notes,
      image: p.image,
      is_active: p.isActive,
      created_at: p.createdAt,
      created_by: p.creator?.email || 'system',
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/parties', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, email, address, notes, createdBy } = req.body;
    let image = null;
    
    if (req.file) {
      image = await uploadToCloudinary(req.file, 'parties');
    }
    
    // Default user if not provided
    const userId = createdBy || (await prisma.user.findFirst())?.id;
    if (!userId) return res.status(400).json({ error: 'No user found. Create a user first.' });
    
    const party = await prisma.party.create({
      data: { name, phone, email, address, notes, image, createdBy: userId },
    });
    
    res.json(party);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/parties/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, email, address, notes, isActive } = req.body;
    const data = { name, phone, email, address, notes };
    
    if (isActive !== undefined) data.isActive = isActive === 'true' || isActive === true;
    if (req.file) {
      data.image = await uploadToCloudinary(req.file, 'parties');
    }
    
    const party = await prisma.party.update({
      where: { id: req.params.id },
      data,
    });
    
    res.json(party);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/parties/:id', async (req, res) => {
  try {
    await prisma.party.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============ TRANSACTION ROUTES ============
app.get('/api/transactions', async (req, res) => {
  try {
    const { type, startDate, endDate, partyId } = req.query;
    const where = {};
    
    if (type && type !== 'all') where.type = type;
    if (partyId && partyId !== 'all') where.partyId = partyId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        party: true,
        buyItems: true,
        sellItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(transactions.map(mapTransaction));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { party: true, buyItems: true, sellItems: true },
    });
    
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(mapTransaction(transaction));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', upload.fields([
  { name: 'invoiceImage', maxCount: 1 },
  { name: 'receiptImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;
    
    // Map type
    let type = data.type || data.transaction_type;
    if (type === 'buying') type = 'buy';
    if (type === 'selling') type = 'sell';
    
    // Find or create party
    let partyId = data.party_id;
    if (!partyId && (data.party_name || data.phone)) {
      const existingParty = await prisma.party.findFirst({
        where: {
          OR: [
            { name: data.party_name },
            { phone: data.phone }
          ]
        }
      });
      
      if (existingParty) {
        partyId = existingParty.id;
      } else {
        const userId = (await prisma.user.findFirst())?.id;
        if (!userId) return res.status(400).json({ error: 'No user found. Create a user first.' });
        
        const newParty = await prisma.party.create({
          data: {
            name: data.party_name || 'Unknown',
            phone: data.phone || '',
            email: data.email,
            address: data.address,
            notes: data.notes,
            createdBy: userId,
          }
        });
        partyId = newParty.id;
      }
    }
    
    // Upload images
    let invoiceImage = null, receiptImage = null;
    if (req.files?.invoiceImage) {
      invoiceImage = await uploadToCloudinary(req.files.invoiceImage[0], 'invoices');
    }
    if (req.files?.receiptImage) {
      receiptImage = await uploadToCloudinary(req.files.receiptImage[0], 'receipts');
    }
    
    // Get user
    const userId = (await prisma.user.findFirst())?.id;
    if (!userId) return res.status(400).json({ error: 'No user found. Create a user first.' });
    
    // Create transaction with items
    const transaction = await prisma.transaction.create({
      data: {
        type,
        date: new Date(data.date),
        partyId,
        phone: data.phone,
        totalWeight: parseFloat(data.total_weight),
        totalPayment: parseFloat(data.total_payment),
        notes: data.notes,
        invoiceImage,
        receiptImage,
        createdBy: userId,
        buyItems: type === 'buy' && data.buy_items ? {
          create: data.buy_items.map(item => ({
            hnyColor: parseFloat(item.hny_color || 0),
            blackColor: parseFloat(item.black_color || 0),
          }))
        } : undefined,
        sellItems: type === 'sell' && data.sell_items ? {
          create: data.sell_items.map(item => ({
            itemCode: item.item_code,
            payment: parseFloat(item.payment),
            shoesHny: parseFloat(item.shoes_hny || 0),
            sheetHny: parseFloat(item.sheet_hny || 0),
            shoesBlack: parseFloat(item.shoes_black || 0),
            sheetBlack: parseFloat(item.sheet_black || 0),
          }))
        } : undefined,
      },
      include: { party: true, buyItems: true, sellItems: true },
    });
    
    res.json(mapTransaction(transaction));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/transactions/:id', upload.fields([
  { name: 'invoiceImage', maxCount: 1 },
  { name: 'receiptImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;
    const updateData = {
      date: data.date ? new Date(data.date) : undefined,
      phone: data.phone,
      totalWeight: data.total_weight ? parseFloat(data.total_weight) : undefined,
      totalPayment: data.total_payment ? parseFloat(data.total_payment) : undefined,
      notes: data.notes,
    };
    
    // Upload new images if provided
    if (req.files?.invoiceImage) {
      updateData.invoiceImage = await uploadToCloudinary(req.files.invoiceImage[0], 'invoices');
    }
    if (req.files?.receiptImage) {
      updateData.receiptImage = await uploadToCloudinary(req.files.receiptImage[0], 'receipts');
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: updateData,
      include: { party: true, buyItems: true, sellItems: true },
    });
    
    res.json(mapTransaction(transaction));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============ REPORTS ============
app.get('/api/reports/summary', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const where = {};
    
    if (type && type !== 'all') where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    
    const buyStats = await prisma.transaction.aggregate({
      where: { ...where, type: 'buy' },
      _count: { id: true },
      _sum: { totalWeight: true, totalPayment: true },
    });
    
    const sellStats = await prisma.transaction.aggregate({
      where: { ...where, type: 'sell' },
      _count: { id: true },
      _sum: { totalWeight: true, totalPayment: true },
    });
    
    res.json({
      buying: {
        count: buyStats._count.id,
        sum_weight: buyStats._sum.totalWeight || 0,
        sum_payment: buyStats._sum.totalPayment || 0,
      },
      selling: {
        count: sellStats._count.id,
        sum_weight: sellStats._sum.totalWeight || 0,
        sum_payment: sellStats._sum.totalPayment || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reports/generate', async (req, res) => {
  try {
    const { name, type, startDate, endDate, generatedBy } = req.body;
    
    const where = {};
    if (startDate) where.date = { gte: new Date(startDate) };
    if (endDate) where.date = { ...where.date, lte: new Date(endDate) };
    
    const transactions = await prisma.transaction.findMany({
      where,
      include: { party: true, buyItems: true, sellItems: true },
    });
    
    const report = await prisma.report.create({
      data: {
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        data: transactions,
        generatedBy,
      }
    });
    
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ EXPORT CSV ============
app.get('/api/export', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { party: true },
      orderBy: { date: 'desc' },
    });
    
    let csv = 'Date,Type,Party,Phone,Weight,Payment\n';
    transactions.forEach(t => {
      csv += `${t.date.toISOString().split('T')[0]},${t.type},${t.party?.name || 'Unknown'},${t.phone},${t.totalWeight},${t.totalPayment}\n`;
    });
    
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Ledger API with Prisma listening on http://localhost:${PORT}`);
});

// Cleanup on exit
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
