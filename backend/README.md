# Ledger Backend API

Express.js API server with PostgreSQL database for the Single-App Ledger system.

## Features

- REST API for parties and transactions
- PostgreSQL database with migrations
- Transaction type mapping (frontend `buying`/`selling` ↔ backend `buy`/`sell`)
- CSV export functionality
- Health check endpoint
- CORS enabled for frontend integration

## Prerequisites

- Node.js 16+ 
- PostgreSQL 15+ (or Docker for local development)
- npm or yarn

## Quick Start with Docker

1. **Start PostgreSQL using Docker Compose:**
   ```powershell
   cd backend
   docker compose up -d
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Run database migrations:**
   ```powershell
   npm run migrate
   ```

4. **Seed the database with sample data:**
   ```powershell
   npm run seed
   ```

5. **Start the development server:**
   ```powershell
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## Manual PostgreSQL Setup

If you prefer to install PostgreSQL locally instead of using Docker:

1. Install PostgreSQL 15+
2. Create a database named `ledger`
3. Update `.env` file with your connection string:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/ledger
   ```
4. Continue with steps 2-5 from Quick Start

## API Endpoints

### Health Check
- `GET /api/health` - Check API and database status

### Parties
- `GET /api/parties` - List all parties (supports `?q=search`)
- `POST /api/parties` - Create new party

### Transactions
- `GET /api/transactions` - List all transactions (supports filters)
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Reports & Export
- `GET /api/reports/summary` - Get transaction summaries
- `GET /api/export` - Export transactions as CSV

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ledger
PORT=4000
```

## Database Schema

- **parties** - Customer/vendor information (name, phone, email, address, notes)
- **transactions** - Buy/sell transaction records
- **buy_items** - Buying transaction details (HNY/Black colors)
- **sell_items** - Selling transaction item breakdown

## npm Scripts

```powershell
npm run dev       # Start development server with nodemon
npm start         # Start production server
npm run migrate   # Run database migrations
npm run seed      # Seed database with sample data
```

## Development Notes

### Transaction Type Mapping

The backend stores transaction types as `buy`/`sell` in the database but the API accepts and returns `buying`/`selling` to match frontend expectations. This mapping happens automatically in the API layer.

### Docker Commands

```powershell
# Start database
docker compose up -d

# View logs
docker compose logs -f

# Stop database
docker compose down

# Stop and remove volumes (deletes data)
docker compose down -v
```

## Troubleshooting

**Database connection errors:**
- Ensure PostgreSQL is running (`docker compose ps` or check local service)
- Verify DATABASE_URL in `.env` is correct
- Check firewall allows port 5432

**Migration fails:**
- Ensure database `ledger` exists
- Check user has CREATE TABLE permissions
- Run `docker compose logs db` to see PostgreSQL errors

**Seed fails:**
- Run `npm run migrate` first
- Check database tables exist
- Verify no foreign key constraint violations

## Production Deployment

1. Set proper environment variables
2. Use a managed PostgreSQL service (AWS RDS, Azure Database, etc.)
3. Enable SSL for database connections
4. Add authentication middleware
5. Set up proper logging
6. Configure rate limiting
7. Use process manager (PM2, systemd)

## Next Steps

- [ ] Add JWT authentication
- [ ] Implement pagination for transactions
- [ ] Add input validation with express-validator
- [ ] Set up automated tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement rate limiting
- [ ] Add comprehensive error logging
