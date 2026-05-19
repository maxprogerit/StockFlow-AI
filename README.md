# StockFlow AI

Fullstack AI-powered inventory and warehouse management platform with a premium dark SaaS dashboard style.

## Stack

- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT + refresh), Spring Data JPA, PostgreSQL, WebSocket, Swagger/OpenAPI, MapStruct, Lombok
- **Frontend:** React + TypeScript, Vite, TailwindCSS, shadcn-style component patterns, Recharts, Zustand, Axios, React Router
- **AI Forecasting:** FastAPI + scikit-learn (+ pandas/Prophet dependency-ready)
- **Infra:** Docker + Docker Compose + seeded PostgreSQL

## Project Structure

```text
backend/      Spring Boot API (clean layered modules)
frontend/     React dashboard app
ml-service/   Forecast microservice
infra/db/init PostgreSQL schema + seed SQL
```

## Run with Docker

1. Copy `.env.example` to `.env`.
2. Start all services:
   ```bash
   docker compose up --build
   ```
3. URLs:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080`
   - Swagger: `http://localhost:8080/swagger-ui.html`
   - ML Service: `http://localhost:8000/health`

## Demo Access

- Seeded user email: `admin@stockflow.ai`
- Seeded user password hash is preloaded in DB (login via API once backend starts and issue JWT tokens).

## Core API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/dashboard/metrics`
- `GET|POST|PUT|DELETE /api/products`
- `GET|POST /api/inventory` and `PATCH /api/inventory/{id}/quantity`
- `GET|POST|PUT|DELETE /api/warehouses`
- `GET|POST|PUT|DELETE /api/suppliers`
- `GET|POST /api/orders/purchase`
- `GET|POST /api/orders/customer`
- `GET|POST /api/analytics`
- `GET|POST /api/alerts`
- `POST /api/forecasting/{productId}`
- `GET /api/forecasting/{productId}/history`
- `GET|POST /api/reports`
- `GET /api/settings`

## Notes

- JWT RBAC roles: `ADMIN`, `MANAGER`, `EMPLOYEE`
- WebSocket alerts topic: `/topic/alerts` (STOMP endpoint `/ws`)
- Product listing supports pagination and search query parameters (`page`, `size`, `q`)

## Local (non-Docker) run

1. **Backend**  
   `cd backend && mvn spring-boot:run`
2. **Frontend**  
   `cd frontend && npm install && npm run dev`
3. **ML service**  
   `cd ml-service && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000`

