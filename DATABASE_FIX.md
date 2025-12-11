# Database Connection Fix Guide

## Current Situation ✅

✅ **Backend server is running** on http://localhost:4000
✅ npm dependencies installed
❌ PostgreSQL authentication failing
❌ Docker Desktop not running

## Issue

You have PostgreSQL installed locally on your system, but the password for the `postgres` user is different from what's in the `.env` file.

## Solutions (Choose ONE)

### Option 1: Use Local PostgreSQL (Recommended - Fastest)

Since PostgreSQL is already installed, just update the credentials:

1. **Find your PostgreSQL password** (check where you installed it, or reset it)

2. **Update `.env` file:**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/ledger
   ```

3. **Create the database** (if it doesn't exist):
   ```powershell
   # Open PostgreSQL command line or use pgAdmin
   psql -U postgres
   # Then run:
   CREATE DATABASE ledger;
   \q
   ```

4. **Run migrations and seed:**
   ```powershell
   npm run migrate
   npm run seed
   ```

5. **Test the connection:**
   ```powershell
   curl http://localhost:4000/api/health
   ```

### Option 2: Reset PostgreSQL Password

If you can't remember your PostgreSQL password:

1. **Find `pg_hba.conf` file** (usually in `C:\Program Files\PostgreSQL\15\data\` or similar)

2. **Edit the file** - Change authentication method temporarily:
   ```
   # Find line like this:
   host    all             all             127.0.0.1/32            scram-sha-256
   
   # Change to:
   host    all             all             127.0.0.1/32            trust
   ```

3. **Restart PostgreSQL service:**
   ```powershell
   # Open Services (Win + R, type services.msc)
   # Find "postgresql-x64-15" or similar
   # Right-click → Restart
   ```

4. **Connect and reset password:**
   ```powershell
   psql -U postgres
   ALTER USER postgres PASSWORD 'postgres';
   \q
   ```

5. **Revert `pg_hba.conf` back** to `scram-sha-256`

6. **Restart PostgreSQL service again**

7. **Test:**
   ```powershell
   npm run migrate
   npm run seed
   ```

### Option 3: Use Docker (If you prefer containers)

1. **Start Docker Desktop application**

2. **Wait for Docker to fully start** (check system tray icon)

3. **Stop your local PostgreSQL** to free port 5432:
   ```powershell
   # Open Services (Win + R, type services.msc)
   # Find "postgresql-x64-15"
   # Right-click → Stop
   ```

4. **Start Docker PostgreSQL:**
   ```powershell
   docker compose up -d
   ```

5. **Run migrations and seed:**
   ```powershell
   npm run migrate
   npm run seed
   ```

### Option 4: Use Different Port for Docker

Keep your local PostgreSQL running and use Docker on a different port:

1. **Update `docker-compose.yml`** - change port to 5433:
   ```yaml
   ports:
     - "5433:5432"  # Changed from 5432:5432
   ```

2. **Update `.env`** for Docker database:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ledger
   ```

3. **Start Docker Desktop and run:**
   ```powershell
   docker compose up -d
   npm run migrate
   npm run seed
   ```

## Quick Test Commands

After fixing the connection, test with:

```powershell
# Check health endpoint
curl http://localhost:4000/api/health

# Should return:
# {"status":"ok","database":"connected"}

# Get parties
curl http://localhost:4000/api/parties

# Get transactions
curl http://localhost:4000/api/transactions
```

## Current Backend Status

Your backend is **ready and running**. It just needs the database connection fixed using one of the options above.

Once you choose a solution and fix the connection:
1. ✅ Backend will connect to PostgreSQL
2. ✅ Migrations will create tables
3. ✅ Seed will populate data
4. ✅ Frontend can connect to real backend (instead of mock data)

## Recommended Path

**For quickest setup:** Use Option 1 (local PostgreSQL)
- Just update `.env` with your actual PostgreSQL password
- Create `ledger` database if it doesn't exist
- Run `npm run migrate` and `npm run seed`

**No password reset needed if you know it!**
