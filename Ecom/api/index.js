const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const pool = require('./db.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Multer using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Global Logger for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Helpers
const formatProduct = (p) => ({
    ...p,
    image: p.image_url || null,
    is_returnable: !!p.is_returnable,
    is_exchangeable: !!p.is_exchangeable
});

const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
};

// --- DB INIT ---
const initDB = async () => {
    try {
        console.log('Starting DB Init...');
        const connection = await pool.getConnection();
        console.log('Database connected successfully!');
        
        await connection.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role ENUM('customer', 'vendor', 'admin') DEFAULT 'customer', first_name VARCHAR(100), last_name VARCHAR(100), phone VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await connection.query(`CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, slug VARCHAR(100) UNIQUE NOT NULL)`);
        await connection.query(`CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, slug VARCHAR(255) UNIQUE NOT NULL, description TEXT, price DECIMAL(10, 2) NOT NULL, stock INT DEFAULT 0, category_id INT, vendor_id INT, image_url LONGTEXT, is_active BOOLEAN DEFAULT TRUE, is_returnable BOOLEAN DEFAULT TRUE, is_exchangeable BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (category_id) REFERENCES categories(id), FOREIGN KEY (vendor_id) REFERENCES users(id))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, total_price DECIMAL(10, 2) NOT NULL, status ENUM('placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'placed', shipping_address TEXT NOT NULL, phone VARCHAR(20) NOT NULL, tracking_id VARCHAR(100), delivered_at TIMESTAMP NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))`);
        await connection.query(`CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, product_id INT, vendor_id INT, quantity INT NOT NULL, price DECIMAL(10, 2) NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, FOREIGN KEY (product_id) REFERENCES products(id))`);
        
        // Ensure columns exist and are correct type
        try { await connection.query('ALTER TABLE products MODIFY COLUMN image_url LONGTEXT'); } catch(e){}
        try { await connection.query('ALTER TABLE products ADD COLUMN is_returnable BOOLEAN DEFAULT TRUE'); } catch(e){}
        try { await connection.query('ALTER TABLE products ADD COLUMN is_exchangeable BOOLEAN DEFAULT TRUE'); } catch(e){}
        try { await connection.query('ALTER TABLE users ADD COLUMN first_name VARCHAR(100)'); } catch(e){}
        try { await connection.query('ALTER TABLE users ADD COLUMN last_name VARCHAR(100)'); } catch(e){}
        try { await connection.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)'); } catch(e){}
        try { await connection.query('ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMP NULL'); } catch(e){}

        // Seed Categories
        const [cats] = await connection.query('SELECT * FROM categories');
        if (cats.length === 0) {
            await connection.query('INSERT INTO categories (name, slug) VALUES ("Electronics", "electronics"), ("Fashion", "fashion"), ("Home & Living", "home-living"), ("Security", "security"), ("Services", "services")');
        }
        
        connection.release();
        console.log('DB Init Complete.');
    } catch (e) { console.error('DB Init Error:', e); }
};
initDB();

// --- ROUTES ---

// CATEGORIES
app.get('/api/categories', async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.status(200).json(categories);
    } catch (e) { res.status(500).json([]); }
});

// AUTH
app.post(['/api/auth/register', '/api/auth/register/'], async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, phone } = req.body;
        const [existing] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            if (existing[0].username === username) return res.status(400).json({ message: 'Username already exists' });
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, "customer", ?, ?, ?)', 
            [username, email, hashedPassword, first_name, last_name, phone]);
        res.status(201).json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post(['/api/auth/login', '/api/auth/login/'], async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0 || !await bcrypt.compare(password, users[0].password)) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: users[0].id, role: users[0].role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true }).json({ 
            success: true, 
            user: users[0],
            tokens: { access: token }
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// PRODUCTS
app.get('/api/products', async (req, res) => {
    const [products] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1');
    res.json(products.map(formatProduct));
});

app.get('/api/products/detail/:slug/', async (req, res) => {
    const [products] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?', [req.params.slug]);
    if (products.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(formatProduct(products[0]));
});

// ORDERS
app.post(['/api/orders/create', '/api/orders/create/'], authenticate, async (req, res) => {
    const { items, shipping_address, phone } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        let total = 0;
        for (const i of items) {
            const [p] = await conn.query('SELECT price FROM products WHERE id = ?', [i.product_id]);
            total += p[0].price * i.quantity;
        }
        const tid = 'TRK' + Date.now();
        const [orderResult] = await conn.query('INSERT INTO orders (user_id, total_price, status, shipping_address, phone, tracking_id) VALUES (?, ?, "placed", ?, ?, ?)', [req.user.id, total, shipping_address, phone, tid]);
        const orderId = orderResult.insertId;

        for (const i of items) {
            const [p] = await conn.query('SELECT price, vendor_id FROM products WHERE id = ?', [i.product_id]);
            await conn.query('INSERT INTO order_items (order_id, product_id, vendor_id, quantity, price) VALUES (?, ?, ?, ?, ?)', [orderId, i.product_id, p[0].vendor_id, i.quantity, p[0].price]);
            await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [i.quantity, i.product_id]);
        }
        await conn.commit();
        res.status(201).json({ success: true, order_id: orderId });
    } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); } finally { conn.release(); }
});

app.get(['/api/orders', '/api/orders/'], authenticate, async (req, res) => {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    for (let o of orders) {
        const [items] = await pool.query('SELECT p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [o.id]);
        o.items = items.map(i => ({ product_name: i.name }));
    }
    res.json(orders);
});

app.get(['/api/orders/:id/tracking', '/api/orders/:id/tracking/'], authenticate, async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (orders.length === 0) return res.status(404).json({ message: 'Not found' });
        const o = orders[0];
        const [items] = await pool.query('SELECT oi.*, p.name as product_name, p.image_url, p.is_returnable, p.is_exchangeable FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [o.id]);
        o.items = items.map(i => ({ 
            ...i, 
            image: i.image_url || null,
            is_returnable: !!i.is_returnable,
            is_exchangeable: !!i.is_exchangeable
        }));
        res.json(o);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post(['/api/orders/:id/cancel', '/api/orders/:id/cancel/'], authenticate, async (req, res) => {
    try {
        await pool.query('UPDATE orders SET status = "cancelled" WHERE id = ? AND user_id = ? AND status = "placed"', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post(['/api/orders/:id/replace', '/api/orders/:id/replace/'], authenticate, async (req, res) => {
    try {
        // Placeholder for replacement logic
        res.json({ success: true, message: "Replacement request submitted" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// VENDOR ROUTES
app.get(['/api/orders/vendor', '/api/orders/vendor/'], authenticate, async (req, res) => {
    const [orders] = await pool.query('SELECT DISTINCT o.*, u.email as customer_email, u.first_name, u.last_name, u.phone as customer_phone FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN users u ON o.user_id = u.id WHERE oi.vendor_id = ? ORDER BY o.created_at DESC', [req.user.id]);
    for (let o of orders) {
        const [items] = await pool.query('SELECT oi.*, p.name as product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ? AND oi.vendor_id = ?', [o.id, req.user.id]);
        o.items = items;
    }
    res.json(orders);
});

app.put(['/api/orders/vendor/:id/status', '/api/orders/vendor/:id/status/'], authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        let query = 'UPDATE orders SET status = ?';
        let params = [status];
        
        if (status === 'delivered') {
            query += ', delivered_at = NOW()';
        }
        
        query += ' WHERE id = ? AND id IN (SELECT order_id FROM order_items WHERE vendor_id = ?)';
        params.push(req.params.id, req.user.id);
        
        await pool.query(query, params);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get(['/api/orders/vendor/stats', '/api/orders/vendor/stats/'], authenticate, async (req, res) => {
    try {
        const vendorId = req.user.id;
        
        // 1. Total Revenue
        const [revenueRow] = await pool.query('SELECT SUM(oi.price * oi.quantity) as total_revenue FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.vendor_id = ? AND o.status != "cancelled"', [vendorId]);
        
        // 2. Orders count by status
        const [statusRows] = await pool.query('SELECT o.status, COUNT(DISTINCT o.id) as count FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE oi.vendor_id = ? GROUP BY o.status', [vendorId]);
        
        // 3. Products sold count
        const [soldRow] = await pool.query('SELECT SUM(quantity) as total_sold FROM order_items WHERE vendor_id = ?', [vendorId]);
        
        // 4. Monthly sales (last 6 months)
        const [monthlyRows] = await pool.query('SELECT DATE_FORMAT(o.created_at, "%b") as month, SUM(oi.price * oi.quantity) as sales FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.vendor_id = ? AND o.status != "cancelled" GROUP BY month ORDER BY MIN(o.created_at) ASC LIMIT 6', [vendorId]);
        
        // 5. Category distribution
        const [categoryRows] = await pool.query('SELECT c.name as name, SUM(oi.price * oi.quantity) as value FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN categories c ON p.category_id = c.id WHERE oi.vendor_id = ? GROUP BY c.name', [vendorId]);

        res.json({
            total_revenue: parseFloat(revenueRow[0].total_revenue || 0),
            total_sold: parseInt(soldRow[0].total_sold || 0),
            status_counts: statusRows,
            monthly_sales: monthlyRows,
            category_distribution: categoryRows
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get(['/api/products/vendor', '/api/products/vendor/'], authenticate, async (req, res) => {
    const [products] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.vendor_id = ?', [req.user.id]);
    res.json(products.map(formatProduct));
});

app.get(['/api/products/vendor/:id', '/api/products/vendor/:id/'], authenticate, async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products WHERE id = ? AND vendor_id = ?', [req.params.id, req.user.id]);
        if (products.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(formatProduct(products[0]));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post(['/api/products/vendor', '/api/products/vendor/'], authenticate, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock, category, is_returnable, is_exchangeable } = req.body;
        let image_url = null;
        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            image_url = `data:${req.file.mimetype};base64,${base64Image}`;
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
        await pool.query('INSERT INTO products (name, slug, description, price, stock, category_id, vendor_id, image_url, is_returnable, is_exchangeable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [name, slug, description, price, stock, category, req.user.id, image_url, is_returnable === 'true', is_exchangeable === 'true']);
        res.status(201).json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch(['/api/products/vendor/:id', '/api/products/vendor/:id/'], authenticate, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock, category, is_returnable, is_exchangeable, status } = req.body;
        let fields = []; let params = [];
        if (name) { fields.push('name=?'); params.push(name); }
        if (description) { fields.push('description=?'); params.push(description); }
        if (price) { fields.push('price=?'); params.push(price); }
        if (stock) { fields.push('stock=?'); params.push(stock); }
        if (category) { fields.push('category_id=?'); params.push(category); }
        if (is_returnable !== undefined) { fields.push('is_returnable=?'); params.push(is_returnable === 'true' || is_returnable === true); }
        if (is_exchangeable !== undefined) { fields.push('is_exchangeable=?'); params.push(is_exchangeable === 'true' || is_exchangeable === true); }
        if (status) { fields.push('is_active=?'); params.push(status === 'active'); }
        if (req.file) { 
            const base64Image = req.file.buffer.toString('base64');
            const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
            fields.push('image_url=?'); 
            params.push(dataUri); 
        }
        if (fields.length === 0) return res.json({ success: true });
        let query = `UPDATE products SET ${fields.join(', ')} WHERE id=? AND vendor_id=?`;
        params.push(req.params.id, req.user.id);
        await pool.query(query, params);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/products/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE products SET is_active = ? WHERE id = ? AND vendor_id = ?', [status === 'active', req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', authenticate, async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ? AND vendor_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;

