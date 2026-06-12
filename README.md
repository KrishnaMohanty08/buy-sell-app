# Buy-Sell Marketplace (Bazaar)

## Overview
Full-stack buy-sell marketplace application with user authentication, product listings, cart, checkout, and order management. Built with React frontend, Node.js/Express backend, Prisma + PostgreSQL.

## Features
### User Management
- Registration and Login with JWT authentication
- Profile management
- Protected routes

### Seller Features
- Create product listings (single or bulk via CSV/JSON)
- Upload images
- Manage listings (update, set active/inactive)
- View sales reports

### Buyer Features
- Browse marketplace
- Search and apply filters
- View product details
- Add to cart
- Cart management
- Checkout with address selection and Razorpay payment
- Order confirmation

### Additional
- Guest browsing
- Responsive UI
- Real-time toast notifications
- Docker support

## Tech Stack
- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **Payments**: Razorpay
- **Email**: Nodemailer
- **Deployment**: Docker Compose

## Architecture
Refer to the workflow diagram for user flows, DFDs for auth/profile, buyer/seller journeys.

## Setup (Docker)
1. Clone the repository
2. Copy provided `docker-compose.yml`, server Dockerfile, etc.
3. Update environment variables in `docker-compose.yml` (DB credentials, JWT secret, Razorpay keys, email)
4. Run: `docker-compose up --build`
5. Access:
   - Client: http://localhost:5173
   - Server: http://localhost:4000
   - DB: localhost:5432

## Manual Setup
- Backend: `cd server && npm install && npx prisma migrate dev && npm run dev`
- Frontend: `cd client && npm install && npm run dev`

## API Routes
- `/api/auth` - Auth endpoints
- `/api/listings` - Product listings
- `/api/cart` - Cart operations
- `/api/orders` - Orders and checkout
- `/api/addresses` - User addresses

## Project Structure
- `/client`: React app
- `/server`: Node/Express backend with Prisma

## Environment Variables
See `docker-compose.yml` for keys: DATABASE_URL, JWT_SECRET, RAZORPAY keys, MAIL credentials.

## Screenshots / Diagrams
[Workflow Image](buy-sell-workflow.png)
