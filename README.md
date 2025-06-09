
# 🛒 E-Commerce Order Management System

A robust full-stack e-commerce system built using **Node.js**, **Express**, **Next.js (Frontend)**, **MongoDB**, and **PostgreSQL (via Prisma)**. This system handles product listings, orders, user accounts, cart functionality, and admin dashboard features.

---

## 🚀 Features

- ✅ Product management
- ✅ Cart & checkout flow
- ✅ Order history
- ✅ Admin panel for product/user/order management
- ✅ Dual-database support (MongoDB + PostgreSQL)

---

## 🧠 Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: 
  - MongoDB (for products, categories, users, etc.)
  - PostgreSQL via Prisma ORM (for orders, cart, addresses)
- **Authentication**: JWT
- **Image Handling**: Multer

---

## 🛠️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aatifShaikh2654/Ecom_mvc.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your_jwt_secret
IMAGE_URL=http://localhost:5000/
```

---

## 📦 Database Setup

### ✅ MongoDB (No migration needed)

MongoDB is schema-less, so no migration is required.

Just ensure MongoDB is running:

```bash
mongod
```

Collections like `users`, `products`, `categories`, etc. will be auto-created.

---

### ✅ PostgreSQL with Prisma (SQL migration)

Install Prisma CLI globally (if not installed):

```bash
npm install -g prisma
```

#### 1. Initialize Prisma (already done in project)

#### 2. Generate Prisma Client

```bash
npx prisma generate
```

#### 3. Run Migrations

To apply schema to your PostgreSQL database:

```bash
npx prisma migrate dev --name init
```

This will create tables for:

- `orders`
- `orderItems`
- `cart`
- `addresses`

You can check the schema in `/prisma/schema.prisma`.

---

## 👤 Create Admin User

You can create an admin user using a script in backend src and file name called createadminuser:

```bash
node createadminuser.js
```

and give the following details for admin

## 🔑 Admin Dashboard

Accessible at:

```
http://localhost:3000/admin/dashboard
```

> This route is protected. Only users with `role: "ADMIN"` can access it.

---

## 💬 Common Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
```

---

## 🧪 Testing

- ✅ REST APIs via Postman
- ✅ Frontend tested in Chrome and Firefox

---

## 📁 Folder Structure (Simplified)

```
/backend
  ├── /controllers
  ├── /models (MongoDB)
  ├── /prisma (PostgreSQL)
  ├── /routes
  ├── index.js
  ├── app.js
/frontend
  ├── /app
      |── (home)
      |── admin
  ├── /components
```

---

## 👨‍💻 Author

- [Aatif Shaikh](https://github.com/aatifShaikh2654)
