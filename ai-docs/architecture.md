# 🏛️ Architecture Documentation

> This file is automatically maintained by the AI DevDocs Engine.
> Content inside `<!-- AI:START:* -->` blocks is AI-managed.
> Add your own notes **outside** these blocks.

---

<!-- AI:START:OVERVIEW -->
### 🏛️ Architecture Overview
The system appears to be a full-stack application with a client and server, utilizing Docker Compose for containerization. The project involves API interactions and document generation.
<!-- AI:END:OVERVIEW -->

---

<!-- AI:START:STACK -->
### 🔧 Tech Stack
Docker Compose, Node.js, Prisma, GitHub Actions
<!-- AI:END:STACK -->

---

<!-- AI:START:STRUCTURE -->
### 📁 Project Structure
The project is organized into several directories, including `client` for the frontend, `server` for the backend, `.github` for GitHub Actions workflows, `scripts` for executable scripts, `templates` for document templates, and `ai-docs` for generated documentation. The `server` directory contains subdirectories for routes, controllers, middleware, and Prisma schema.
<!-- AI:END:STRUCTURE -->

---

<!-- AI:START:FLOW -->
### 🔄 Request / Data Flow
The workflow involves client requests to the server, which handles authentication, routing, and data processing. The flow can be described as: Client → Server → Routes → Controllers → Services → Database.
<!-- AI:END:FLOW -->

---

<!-- AI:START:SCHEMA -->
### 🗃️ Database / Schema Notes
No schema changes detected.
<!-- AI:END:SCHEMA -->

---

<!-- MANUAL: Add your own architectural decisions below this line -->
