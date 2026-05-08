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
```
<!-- AI:END:SYSTEM_DFD -->

---

<!-- AI:START:FEATURE_DFD -->
### ⚙️ Feature / Module Data Flow
_Based on: yml file added_

```mermaid
graph LR
    GitHub["🐙 GitHub"] --> Workflow["📝 Workflow"]
    Workflow -->|triggers|> Backend["⚙️ Backend API"]
    Backend --> Scripts["📝 Scripts"]
    Scripts -->|generate-docs|> Docs["📄 Docs Generation"]
```
<!-- AI:END:FEATURE_DFD -->

---

<!-- AI:START:CHANGE_SUMMARY -->
### 📝 Diagram Change Notes
- Updated the system-level data flow to reflect the addition of workflow and its interaction with the backend API.
- Updated the feature-level data flow to show the generation of docs using the workflow trigger.
<!-- AI:END:CHANGE_SUMMARY -->

---

<!-- MANUAL: Add your own diagrams below -->
