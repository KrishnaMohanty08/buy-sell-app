# 🏛️ Architecture Documentation

> This file is automatically maintained by the AI DevDocs Engine.
> Content inside `<!-- AI:START:* -->` blocks is AI-managed.
> Add your own notes **outside** these blocks.

---

<!-- AI:START:OVERVIEW -->
### 🏛️ Architecture Overview
The system appears to be a full-stack e-commerce application with a client and server, utilizing Docker Compose for containerization. The project involves API interactions, user authentication, listing management, cart operations, and order processing.
<!-- AI:END:OVERVIEW -->

---

<!-- AI:START:STACK -->
### 🔧 Tech Stack
Docker Compose, Node.js, Prisma, Express.js, React, Vite, GitHub Actions, JSON Web Tokens (JWT), Bcrypt.js
<!-- AI:END:STACK -->

---

<!-- AI:START:STRUCTURE -->
### 📁 Project Structure
The project is organized into several directories, including `client` for the frontend, `server` for the backend, `.github` for GitHub Actions workflows, `scripts` for executable scripts, `templates` for document templates, and `ai-docs` for generated documentation. The `server` directory contains subdirectories for routes, controllers, middleware, and Prisma schema. The `client` directory is further divided into `src` for source code, `public` for public assets, and utilizes Vite for development.
<!-- AI:END:STRUCTURE -->

---

<!-- AI:START:FLOW -->
### 🔄 Request / Data Flow
The workflow involves client requests to the server, which handles authentication, routing, and data processing. The flow can be described as: Client → Server → Routes (e.g., authRoutes, listingRoutes, cartRoutes) → Controllers (e.g., authController, listingController) → Services (e.g., Prisma client) → Database. For example, a user's request to create a listing would flow through the `SellPage` component in the client, to the `createListing` function in the server's `listingController`, and then to the Prisma client for database operations.
<!-- AI:END:FLOW -->

---

<!-- AI:START:SCHEMA -->
### 🗃️ Database / Schema Notes
The database schema includes models for Address, Listing, Order, User, Cart, CartItem, and OtpToken. The Listing model has fields for title, description, price, condition, seller, category, images, reviews, and orders. The User model has fields for firstName, lastName, email, password, role, listings, orders, reviews, cart, addresses, and profileImage. The schema also defines relationships between these models, such as a user having many listings and orders, and a listing belonging to one seller.
<!-- AI:END:SCHEMA -->

---

<!-- MANUAL: Add your own architectural decisions below this line -->
