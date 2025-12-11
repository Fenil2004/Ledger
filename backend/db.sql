-- parties (phonebook)
CREATE TABLE IF NOT EXISTS parties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(200),
  address VARCHAR(500),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- transactions master
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL,
  date DATE NOT NULL,
  party_id INTEGER REFERENCES parties(id),
  phone VARCHAR(20),
  total_weight NUMERIC(10,3) DEFAULT 0,
  total_payment NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- selling-specific details
CREATE TABLE IF NOT EXISTS sell_items (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
  item_code VARCHAR(50),
  payment NUMERIC(12,2) DEFAULT 0,
  shoes_hny NUMERIC(10,3) DEFAULT 0,
  sheet_hny NUMERIC(10,3) DEFAULT 0,
  shoes_black NUMERIC(10,3) DEFAULT 0,
  sheet_black NUMERIC(10,3) DEFAULT 0
);

-- buying-specific details
CREATE TABLE IF NOT EXISTS buy_items (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
  hny_color NUMERIC(10,3) DEFAULT 0,
  black_color NUMERIC(10,3) DEFAULT 0
);
