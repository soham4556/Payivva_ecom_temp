# Payivva Technologies - Multi-Vendor eCommerce Marketplace

A production-ready multi-vendor eCommerce platform built with React, Django REST Framework, and MySQL.

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React 19, Tailwind CSS, Axios     |
| Backend  | Django 4.2, Django REST Framework |
| Database | MySQL 8                           |
| Auth     | JWT (SimpleJWT)                   |
| Server   | Nginx + Gunicorn                  |

## Features

### Customer

- Browse & search products with category filters
- Product details with image, price, stock
- Shopping cart with quantity management
- Checkout with shipping address
- Order history with real-time tracking timeline

### Vendor

- Vendor registration and profile
- Product management (CRUD)
- Image upload, price & stock management
- Order management with status updates
- Revenue dashboard with statistics

### Admin

- Vendor approval/rejection/disable
- Product moderation (activate, deactivate, delete)
- Order monitoring across all vendors
- Analytics dashboard with revenue, counts

### Order Tracking

Status workflow: `Order Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered`

Each order gets a unique tracking ID with a visual timeline UI.

---

## Project Structure

```
Ecom/
├── ecom/                    # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── context/         # Auth & Cart context providers
│   │   ├── services/        # API service layer
│   │   └── utils/           # Helpers & constants
│   └── public/              # Static assets, robots.txt, sitemap
├── backend/                 # Django Backend
│   ├── config/              # Django project settings
│   ├── accounts/            # User auth (register, login, JWT)
│   ├── vendors/             # Vendor profiles & management
│   ├── products/            # Products & categories
│   ├── orders/              # Orders, tracking, status history
│   ├── payments/            # Payment placeholder
│   └── core/                # Permissions & utilities
└── deployment/              # Nginx, Gunicorn, deploy script
```

---

## Local Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8

### 1. Database

```sql
CREATE DATABASE ecom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`

### 3. Frontend

```bash
cd ecom
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (proxies API to Django)

### 4. Create Initial Data

1. Go to `http://127.0.0.1:8000/admin/`
2. Log in with superuser credentials
3. Add some categories under Products > Categories
4. Register a vendor account via the frontend

---

## API Endpoints

### Authentication

| Method | Endpoint                 | Description       |
| ------ | ------------------------ | ----------------- |
| POST   | /api/auth/register/      | Register user     |
| POST   | /api/auth/login/         | Login (get JWT)   |
| POST   | /api/auth/token/refresh/ | Refresh JWT token |
| GET    | /api/auth/profile/       | Get user profile  |

### Products

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | /api/products/               | List active products    |
| GET    | /api/products/detail/{slug}/ | Product detail          |
| GET    | /api/products/categories/    | List categories         |
| GET    | /api/products/vendor/        | Vendor's own products   |
| POST   | /api/products/vendor/        | Create product (vendor) |
| PATCH  | /api/products/vendor/{id}/   | Update product (vendor) |
| DELETE | /api/products/vendor/{id}/   | Delete product (vendor) |

### Orders

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | /api/orders/create/             | Place order             |
| GET    | /api/orders/                    | Customer's orders       |
| GET    | /api/orders/{id}/               | Order detail            |
| GET    | /api/orders/{id}/tracking/      | Order tracking timeline |
| GET    | /api/orders/vendor/             | Vendor's orders         |
| PUT    | /api/orders/vendor/{id}/status/ | Update order status     |

### Vendors

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| POST   | /api/vendors/register/ | Register as vendor    |
| GET    | /api/vendors/profile/  | Vendor profile        |
| GET    | /api/vendors/          | List approved vendors |

---

## Production Deployment (Linux VPS)

### Quick Deploy

1. Copy files to server
2. Edit `deployment/deploy.sh` with your actual paths and passwords
3. Run: `bash deployment/deploy.sh`

### Manual Steps

1. Install: Python, Node.js, MySQL, Nginx
2. Create MySQL database `ecom`
3. Set up Python virtualenv, install requirements
4. Run migrations, collect static files
5. Build React frontend: `npm run build`
6. Configure Nginx with `deployment/nginx.conf`
7. Set up Gunicorn with `deployment/gunicorn.service`
8. Enable SSL with Let's Encrypt

### Environment Variables (Production)

```bash
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=payivva.com,www.payivva.com
DB_NAME=ecom
DB_USER=payivva_user
DB_PASSWORD=secure-password
DB_HOST=localhost
DB_PORT=3306
CORS_ALLOWED_ORIGINS=https://payivva.com,https://www.payivva.com
```

---

## Security

- JWT authentication with token refresh rotation
- Role-based access control (Customer/Vendor/Admin)
- Vendors can only manage their own products
- Django CSRF + XSS protection
- HTTPS enforced in production
- Security headers via Nginx
- Input validation on all endpoints
- SQL injection protection via Django ORM

---

## License

© 2026 Payivva Technologies. All rights reserved.
