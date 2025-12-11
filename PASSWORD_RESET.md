# PostgreSQL 17 Password Reset Guide

## Your PostgreSQL Info
- Version: PostgreSQL 17
- Service: postgresql-x64-17
- Status: Running ✅
- Port: 5432

## Reset Password (5 minutes)

### Step 1: Find pg_hba.conf

The file is typically in:
`C:\Program Files\PostgreSQL\17\data\pg_hba.conf`

Or search for it:
```powershell
Get-ChildItem -Path "C:\Program Files\PostgreSQL\" -Recurse -Filter "pg_hba.conf" -ErrorAction SilentlyContinue
```

### Step 2: Edit pg_hba.conf (as Administrator)

1. **Open Notepad as Administrator**
2. **Open** `pg_hba.conf`
3. **Find these lines** (around line 80-100):
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

4. **Change to** (temporarily):
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   ```

5. **Save the file**

### Step 3: Restart PostgreSQL Service

```powershell
Restart-Service postgresql-x64-17
```

### Step 4: Connect and Reset Password

```powershell
# Navigate to PostgreSQL bin folder
cd "C:\Program Files\PostgreSQL\17\bin"

# Connect (no password needed with 'trust' method)
.\psql -U postgres

# In psql prompt, run:
ALTER USER postgres PASSWORD 'postgres';

# Create ledger database:
CREATE DATABASE ledger;

# Exit:
\q
```

### Step 5: Restore Security (IMPORTANT!)

1. **Open `pg_hba.conf` again**
2. **Change back to:**
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
3. **Save**
4. **Restart service:**
   ```powershell
   Restart-Service postgresql-x64-17
   ```

### Step 6: Update .env and Test

Update `backend\.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ledger
```

Test:
```powershell
cd C:\Users\fenil\OneDrive\Desktop\Side\backend
npm run migrate
npm run seed
```

## Alternative: Use Docker Instead

If this seems complicated:

1. **Stop local PostgreSQL:**
   ```powershell
   Stop-Service postgresql-x64-17
   ```

2. **Start Docker Desktop**

3. **Use Docker PostgreSQL:**
   ```powershell
   cd C:\Users\fenil\OneDrive\Desktop\Side\backend
   docker compose up -d
   npm run migrate
   npm run seed
   ```

This way you don't need to deal with local PostgreSQL password.

## Check Current Status

```powershell
# Test API health
curl http://localhost:4000/api/health

# Should return:
# {"status":"ok","database":"connected"}
```
