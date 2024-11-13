-- V2.0.5__create_orders_tables.sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    total DECIMAL(19,2) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(255) NOT NULL,
    shipping_state VARCHAR(255) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    estimated_delivery_start DATE,
    estimated_delivery_end DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(19,2) NOT NULL,
    total_price DECIMAL(19,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert example orders
INSERT INTO orders (id, user_id, total, shipping_address, shipping_city, shipping_state, 
                   shipping_postal_code, buyer_name, buyer_phone, 
                   estimated_delivery_start, estimated_delivery_end)
VALUES 
(uuid_generate_v4(), 
 (SELECT id FROM users WHERE email = 'user1@example.com'),
 299.99,
 '123 Main St',
 'New York',
 'NY',
 '10001',
 'Bob Johnson',
 '+1234567890',
 CURRENT_DATE + INTERVAL '7 days',
 CURRENT_DATE + INTERVAL '14 days');

-- Insert example order items
INSERT INTO order_items (order_id, product_id, quantity, price, total_price)
SELECT 
    o.id,
    p.id,
    2,
    p.price,
    p.price * 2
FROM orders o
CROSS JOIN products p
WHERE p.name = 'Noise Cancelling Headphones'
LIMIT 1; 