# DFL Gossip Network UI

This repository contains the Spring Boot backend proxy service and the React (Vite) frontend for visualizing the DFL gossip network.

## Prerequisites
- Java 21+
- Node.js & npm
- Python (for the DFL bootstrap and workers)

## 1. Start Python Services

Start the bootstrap node:
```bash
python main.py --host 127.0.0.1 --port 8000 --grpc-port 9000 --bootstrap
```

Start one or more worker nodes:
```bash
python main.py --host 127.0.0.1 --port 8001 --grpc-port 9001 --bootstrap-url 127.0.0.1:8000
python main.py --host 127.0.0.1 --port 8002 --grpc-port 9002 --bootstrap-url 127.0.0.1:8000
```

## 2. Start the Spring Boot Backend

The backend acts as a proxy, fetching the adjacency list from the bootstrap node and forwarding prediction/status requests to the individual workers.

```bash
cd backend
./mvnw spring-boot:run
```
*(If you do not have the maven wrapper installed, use your local maven `mvn spring-boot:run`)*

The backend will run on `http://localhost:8080`.

**Configuration:**
If you need to change the bootstrap URL, update `backend/src/main/resources/application.yml`:
```yaml
python:
  bootstrap-url: "http://127.0.0.1:8000"
```

## 3. Start the React Frontend

The React frontend polls the backend every 3 seconds to fetch the latest adjacency list, rendering it with a D3 force-directed graph. 

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:3000` (or `http://localhost:5173` depending on Vite defaults).

## How it works

1. **Graph Updates:** The `NetworkGraph` component polls the `/api/adjacency` proxy endpoint. If worker nodes join or leave, the UI naturally updates the D3 layout by adding/removing nodes and links.
2. **Interaction:** Clicking on any node triggers two proxy requests through the Spring Backend:
    - `GET /api/node/{nodeId}/status` 
    - `POST /api/node/{nodeId}/predict`
3. The responses from these endpoints are aggregated and shown in a simple alert modal on the UI.
