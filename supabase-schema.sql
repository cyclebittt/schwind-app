-- ============================================================
-- SCHWIND Bräu – Supabase Schema
-- In Supabase SQL Editor ausführen
-- ============================================================

-- Benutzer-Profile
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  points      INTEGER DEFAULT 0,
  level       TEXT DEFAULT 'bronze', -- bronze | silver | gold
  role        TEXT DEFAULT 'user',   -- user | admin
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Punkte-Transaktionen
CREATE TABLE IF NOT EXISTS point_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  reason      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Tischreservierungen
CREATE TABLE IF NOT EXISTS table_reservations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name  TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  party_size  INTEGER NOT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  notes       TEXT,
  status      TEXT DEFAULT 'pending', -- pending | confirmed | cancelled
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Menü-Kategorien
CREATE TABLE IF NOT EXISTS menu_categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  TEXT NOT NULL,
  sort  INTEGER DEFAULT 0
);

-- Menü-Gerichte & Getränke
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        DECIMAL(6,2) NOT NULL,
  allergens    TEXT[] DEFAULT '{}',
  available    BOOLEAN DEFAULT true,
  sort         INTEGER DEFAULT 0
);

-- News/Ankündigungen
CREATE TABLE IF NOT EXISTS news_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  image_url    TEXT,
  type         TEXT DEFAULT 'general', -- general | event | special | sport
  pinned       BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now()
);

-- Prämien
CREATE TABLE IF NOT EXISTS rewards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  points_required INTEGER NOT NULL,
  type            TEXT,         -- drink | tour | merch | event
  available       BOOLEAN DEFAULT true
);

-- Eingelöste Prämien
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id   UUID REFERENCES rewards(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  confirmed   BOOLEAN DEFAULT false
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_reservations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards              ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions   ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_own"         ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "profiles_admin_read"  ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Point transactions
CREATE POLICY "pt_own_read"   ON point_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "pt_own_insert" ON point_transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "pt_admin_all"  ON point_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Table reservations
CREATE POLICY "tr_own_read"    ON table_reservations FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "tr_any_insert"  ON table_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "tr_admin_update" ON table_reservations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Menu (public read, admin write)
CREATE POLICY "mc_public_read"  ON menu_categories FOR SELECT USING (true);
CREATE POLICY "mi_public_read"  ON menu_items       FOR SELECT USING (true);
CREATE POLICY "mc_admin_write"  ON menu_categories  FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "mi_admin_write"  ON menu_items       FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- News (public read, admin write)
CREATE POLICY "news_public_read"  ON news_posts FOR SELECT USING (true);
CREATE POLICY "news_admin_write"  ON news_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Rewards (public read, admin write)
CREATE POLICY "rewards_public_read"  ON rewards FOR SELECT USING (true);
CREATE POLICY "rewards_admin_write"  ON rewards FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Redemptions
CREATE POLICY "rr_own_read"    ON reward_redemptions FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "rr_own_insert"  ON reward_redemptions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "rr_admin_update" ON reward_redemptions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- Auto-create profile on registration
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO menu_categories (name, sort) VALUES
  ('Bier vom Fass',              1),
  ('Saisonbier & Spezialitäten', 2),
  ('Brotzeiten & Snacks',        3),
  ('Alkoholfreie Getränke',      4),
  ('Heißgetränke',               5)
ON CONFLICT DO NOTHING;

INSERT INTO rewards (name, description, points_required, type) VALUES
  ('1 Schwindbräu Helles gratis',    '0,5l Helles beim nächsten Besuch',         50,  'drink'),
  ('Frühschoppen-Ticket',             'Eintritt inkl. 2 Bier beim Frühschoppen', 100, 'event'),
  ('Schwindbräu-Masskrug',            'Exklusiver 1-Liter Keramikmasskrug',       150, 'merch'),
  ('Brauerei-Tour für 2',             'Führung + Verkostung für 2 Personen',      200, 'tour')
ON CONFLICT DO NOTHING;
