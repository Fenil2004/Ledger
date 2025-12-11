# Neon + Prisma + Cloudinary Setup Guide

## 🎯 What You Get

This setup provides:
- **Neon PostgreSQL** - Serverless, auto-scaling database with 10GB free tier
- **Prisma ORM** - Type-safe database queries with auto-completion
- **Cloudinary** - Image storage for user profiles, party logos, invoices, and receipts
- **Complete CRUD** - Create, Read, Update, Delete for all entities
- **Advanced Filtering** - Daily, Monthly, Quarterly, Yearly, All Time, and custom date ranges
- **Report Generation** - Save reports with data snapshots

---

## 📦 Step 1: Create Neon Database (Recommended)

### Option A: Neon (Serverless PostgreSQL) - **RECOMMENDED**

1. **Sign up for Neon** (free tier):
   - Go to https://neon.tech
   - Click "Sign Up" (use GitHub or email)
   - Create a new project named "ledger"

2. **Get your connection string**:
   - After creating the project, you'll see a connection string like:
     ```
     postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - Copy this string

3. **Update backend/.env**:
   ```bash
   DATABASE_URL="postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Option B: Local PostgreSQL (For Development)

If you prefer local development:

1. **Install PostgreSQL** (if not installed):
   - Download from https://www.postgresql.org/download/windows/
   - During installation, set password for `postgres` user

2. **Create database**:
   ```powershell
   # Open psql
   psql -U postgres
   
   # Create database
   CREATE DATABASE ledger;
   
   # Exit
   \q
   ```

3. **Update backend/.env**:
   ```bash
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ledger"
   ```

---

## 🖼️ Step 2: Set Up Cloudinary (Image Storage)

1. **Sign up for Cloudinary** (free tier):
   - Go to https://cloudinary.com
   - Click "Sign Up Free"
   - Verify your email

2. **Get your credentials**:
   - Go to Dashboard
   - Copy these values:
     - **Cloud Name** (e.g., `dxxxxx`)
     - **API Key** (e.g., `123456789012345`)
     - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

3. **Update backend/.env**:
   ```bash
   CLOUDINARY_CLOUD_NAME="dxxxxx"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
   ```

---

## 🚀 Step 3: Initialize Database

1. **Generate Prisma Client**:
   ```powershell
   cd backend
   npm run prisma:generate
   ```

2. **Create database tables**:
   ```powershell
   npm run migrate
   ```
   - This will create all tables defined in `prisma/schema.prisma`
   - You'll be prompted to name the migration (e.g., "initial_setup")

3. **Seed with sample data**:
   ```powershell
   npm run seed
   ```
   - Creates 2 users (admin@ledger.com, user@ledger.com)
   - Creates 5 parties
   - Creates 11 transactions (6 buy, 5 sell)

---

## ✅ Step 4: Start the Backend

```powershell
npm run dev
```

Server will start at `http://localhost:4000`

---

## 🧪 Step 5: Test the API

### 1. Health Check
```powershell
curl http://localhost:4000/api/health
```
Expected: `{"status":"ok","database":"connected"}`

### 2. Get Transactions
```powershell
curl http://localhost:4000/api/transactions
```
Should return 11 transactions with proper formatting

### 3. Get Parties
```powershell
curl http://localhost:4000/api/parties
```
Should return 5 parties

### 4. Summary Report
```powershell
curl http://localhost:4000/api/reports/summary
```
Shows buying/selling statistics

---

## 📸 Image Upload Examples

### Upload Party with Image
```powershell
curl -X POST http://localhost:4000/api/parties `
  -F "name=Test Party" `
  -F "phone=1234567890" `
  -F "email=test@example.com" `
  -F "image=@C:\path\to\image.jpg"
```

### Create Transaction with Invoice
```powershell
curl -X POST http://localhost:4000/api/transactions `
  -F "type=buy" `
  -F "date=2025-12-11" `
  -F "party_name=Test Party" `
  -F "phone=1234567890" `
  -F "total_weight=50" `
  -F "total_payment=20000" `
  -F "invoiceImage=@C:\path\to\invoice.jpg"
```

---

## 🎨 Prisma Studio (Visual Database Browser)

View and edit your database visually:

```powershell
npm run prisma:studio
```

Opens at `http://localhost:5555` - Browse all tables, add/edit/delete records

---

## 📊 Database Schema Overview

### Models Created

1. **User** - Application users with profile images
   - Fields: email, name, password, role, profileImage, isActive
   
2. **Party** - Customers/Vendors with logos
   - Fields: name, phone, email, address, notes, image, isActive

3. **Transaction** - Buy/Sell transactions with invoice/receipt images
   - Fields: type, date, totalWeight, totalPayment, notes, invoiceImage, receiptImage
   - Relations: party, creator, buyItems, sellItems

4. **BuyItem** - Items in buying transactions
   - Fields: hnyColor, blackColor

5. **SellItem** - Items in selling transactions
   - Fields: itemCode, payment, shoesHny, sheetHny, shoesBlack, sheetBlack

6. **Report** - Saved reports with JSON data
   - Fields: name, type, startDate, endDate, data, generatedBy

---

## 🔍 API Endpoints Reference

### Users
- `POST /api/users/register` - Create user with profile image
- `GET /api/users/:id` - Get user details

### Parties
- `GET /api/parties` - List all parties
- `POST /api/parties` - Create party (with image upload)
- `PUT /api/parties/:id` - Update party (with image upload)
- `DELETE /api/parties/:id` - Delete party

### Transactions
- `GET /api/transactions` - List with filters: ?type=buy&startDate=2025-12-01&endDate=2025-12-31
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create (with invoice/receipt upload)
- `PUT /api/transactions/:id` - Update (with image upload)
- `DELETE /api/transactions/:id` - Delete

### Reports
- `GET /api/reports/summary` - Get summary stats (supports filters)
- `POST /api/reports/generate` - Generate and save report
- `GET /api/reports` - List saved reports

### Export
- `GET /api/export` - Download CSV of all transactions

---

## 🎯 Filter Features

All implemented in Dashboard:

- ✅ **Daily** - Today's transactions
- ✅ **Monthly** - Current month
- ✅ **Quarterly** - Current quarter
- ✅ **Yearly** - Current year
- ✅ **All Time** - No filter
- ✅ **Date Range** - Custom from/to dates

Backend supports filtering via query params:
```
GET /api/transactions?startDate=2025-12-01&endDate=2025-12-10
```

---

## 🛠️ Useful Commands

```powershell
# Start development server
npm run dev

# Create database migration
npm run migrate

# Seed database
npm run seed

# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Open Prisma Studio
npm run prisma:studio

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# View migrations
npx prisma migrate status
```

---

## 🔐 Security Notes

1. **Password Hashing**: Current seed uses plain text passwords. In production:
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Authentication**: Add JWT or session-based auth:
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
   ```

3. **Image Validation**: Add file type and size checks:
   ```javascript
   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
   if (!allowedTypes.includes(file.mimetype)) throw new Error('Invalid file type');
   ```

---

## 🎉 What's Different from Old Setup

### Before (Old)
- ❌ Plain PostgreSQL with raw SQL
- ❌ No image storage
- ❌ Manual type mapping
- ❌ No type safety
- ❌ Complex query building

### Now (New)
- ✅ Prisma ORM with TypeScript types
- ✅ Cloudinary image storage
- ✅ Automatic type mapping
- ✅ Full type safety
- ✅ Simple, readable queries
- ✅ Built-in migrations
- ✅ Visual database browser (Prisma Studio)

---

## 🚨 Troubleshooting

### Migration fails
```powershell
# Reset and recreate
npx prisma migrate reset
npm run migrate
npm run seed
```

### Cloudinary upload fails
- Check credentials in `.env`
- Ensure file is valid image format
- Check Cloudinary dashboard quota

### Database connection fails
- Verify DATABASE_URL in `.env`
- For Neon: Check project is not suspended
- For local: Ensure PostgreSQL service is running

### "No user found" error
- Run `npm run seed` to create default users
- Or manually create user via Prisma Studio

---

## 📝 Next Steps

1. ✅ Set up Neon database
2. ✅ Configure Cloudinary
3. ✅ Run migrations and seed
4. ✅ Test API endpoints
5. 🔲 Add authentication (JWT)
6. 🔲 Connect frontend to real API
7. 🔲 Add image upload UI in frontend
8. 🔲 Deploy to production (Vercel + Neon)

---

**Status**: ✅ Backend fully configured with Prisma + Neon + Cloudinary  
**Action Required**: Create Neon account, update DATABASE_URL, run migrations
