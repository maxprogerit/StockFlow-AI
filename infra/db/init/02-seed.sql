INSERT INTO users (full_name, email, password, role) VALUES
('Admin User', 'admin@stockflow.ai', '$2a$10$3Q1kL9bifM5J7zfx8NVoKe4Dvb/6bFs6To2j9Q7s3RyQNN8sB6f6W', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Electronics', 'Devices and smart hardware'),
('Office', 'Office supplies and equipment'),
('Food', 'Perishable goods')
ON CONFLICT (name) DO NOTHING;

INSERT INTO suppliers (name, contact_email, contact_phone, address, rating) VALUES
('Neo Supply Co', 'sales@neosupply.io', '+1-555-100-100', 'New York, NY', 4.6),
('Quantum Goods', 'ops@quantumgoods.io', '+1-555-100-200', 'Chicago, IL', 4.3)
ON CONFLICT DO NOTHING;

INSERT INTO warehouses (name, location, capacity, active) VALUES
('Central Hub', 'Berlin', 12000, TRUE),
('East Node', 'Warsaw', 8000, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO products (sku, name, description, image_url, price, cost, low_stock_threshold, barcode, category_id, supplier_id)
SELECT
    'SF-ULTRA-12',
    'Ultra Sensor 12',
    'Industrial IoT sensor',
    'https://images.example.com/ultra12.png',
    199.00,
    120.00,
    25,
    '1234567890123',
    c.id,
    s.id
FROM categories c CROSS JOIN suppliers s
WHERE c.name = 'Electronics'
LIMIT 1
ON CONFLICT (sku) DO NOTHING;

INSERT INTO alerts (type, severity, message, resolved, metadata) VALUES
('LOW_STOCK', 'HIGH', 'Ultra Sensor 12 reached threshold in East Node', FALSE, '{"warehouse":"East Node"}'),
('WAREHOUSE', 'MEDIUM', 'Loading dock maintenance needed', FALSE, '{"dock":"D3"}')
ON CONFLICT DO NOTHING;

INSERT INTO analytics (metric_name, metric_value, period, recorded_at) VALUES
('monthly_revenue', 75210.55, '2026-05', NOW()),
('inventory_turnover', 6.20, '2026-Q2', NOW())
ON CONFLICT DO NOTHING;

