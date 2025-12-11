# 🎯 QUICKEST FIX - 3 Simple Options

## Your Situation
- ✅ Backend running on port 4000
- ❌ Can't connect to PostgreSQL (password issue)
- ❌ Docker Desktop not started

## Choose Your Path:

---

## ⚡ OPTION 1: Use SQLite Instead (EASIEST - 2 minutes)

**No PostgreSQL needed! Perfect for development.**

### Steps:

1. **Install SQLite package:**
   ```powershell
   cd C:\Users\fenil\OneDrive\Desktop\Side\backend
   npm install better-sqlite3
   ```

2. **Update `package.json`** - replace `pg` with `better-sqlite3`

3. **Backend will work immediately** with a local file database

**Pros:** No setup, works instantly, portable
**Cons:** SQLite instead of PostgreSQL (but same for development)

---

## 🐳 OPTION 2: Fix Docker (3 minutes)

1. **Open Docker Desktop application**
2. **Wait** for Docker to fully start (whale icon in system tray)
3. **Run:**
   ```powershell
   docker compose up -d
   npm run migrate
   npm run seed
   ```

**Pros:** Clean PostgreSQL in container
**Cons:** Requires Docker Desktop running

---

## 💾 OPTION 3: Find Your PostgreSQL Password

PostgreSQL is installed but password is wrong.

### Find Installation:
```powershell
Get-Service -Name "*postgres*"
```

### Common password locations:
- Check installation notes
- Try default: `postgres`, `admin`, or empty
- Or use password you set during installation

### Update `.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ledger
```

### Then run:
```powershell
npm run migrate
npm run seed
```

---

## 🚀 MY RECOMMENDATION

**Start with OPTION 2 (Docker)** - It's cleanest:

1. Click **Docker Desktop** icon (search in Windows Start)
2. Wait for it to say "Docker Desktop is running"
3. Then run:
   ```powershell
   cd C:\Users\fenil\OneDrive\Desktop\Side\backend
   docker compose up -d
   npm run migrate
   npm run seed
   ```

**That's it!** Your backend will have a working database.

---

## Test After Setup

```powershell
# Test health (should show "database":"connected")
curl http://localhost:4000/api/health

# Get data
curl http://localhost:4000/api/parties
curl http://localhost:4000/api/transactions
```

---

## What Happens Next?

Once database is connected:
1. ✅ Backend fully functional
2. ✅ Can switch frontend from mock to real API
3. ✅ Full CRUD operations work
4. ✅ Data persists between restarts

**Pick one option and you're done!**
