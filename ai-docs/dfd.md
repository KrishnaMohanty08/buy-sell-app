# 🗺️ Data Flow Diagrams

> This file is automatically maintained by the AI DevDocs Engine.
> Mermaid diagrams inside `<!-- AI:START:* -->` blocks are AI-managed.
> Add your own diagrams **outside** these blocks.

---

<!-- AI:START:SYSTEM_DFD -->
### 🗺️ System-Level Data Flow

```mermaid
graph TD
    User["👤 User"] --> Frontend["🖥️ Frontend"]
    Frontend --> Backend["⚙️ Backend API"]
    Backend --> Database["🗄️ Database"]
    Backend --> GitHub["🐙 GitHub"]
    GitHub --> Secrets["🔒 Secrets"]
    Secrets -->|uses|> Backend
    GitHub --> Workflow["📝 Workflow"]
    Workflow -->|triggers|> Backend
    Backend --> AI_DevDocs_Engine["🤖 AI DevDocs Engine"]
    AI_DevDocs_Engine -->|generates|> Docs["📄 Docs"]
```
<!-- AI:END:SYSTEM_DFD -->

---

<!-- AI:START:FEATURE_DFD -->
### ⚙️ Feature / Module Data Flow
_Based on: Merge branch 'main' of https://github.com/KrishnaMohanty08/buy-sell-app_

```mermaid
graph LR
    GitHub["🐙 GitHub"] --> Workflow["📝 Workflow"]
    Workflow -->|triggers|> AI_DevDocs_Engine["🤖 AI DevDocs Engine"]
    AI_DevDocs_Engine -->|generates|> Docs["📄 Docs Generation"]
    GitHub --> Backend["⚙️ Backend API"]
    Backend -->|uses|> Secrets["🔒 Secrets"]
```
<!-- AI:END:FEATURE_DFD -->

---

<!-- AI:START:CHANGE_SUMMARY -->
### 📝 Diagram Change Notes
- No changes detected in the system or feature-level data flows.
- The git diff indicates a new GitHub workflow file added, but it does not affect the existing data flows.
<!-- AI:END:CHANGE_SUMMARY -->

---

<!-- MANUAL: Add your own diagrams below -->
