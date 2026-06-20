# dfl-visualizer – Quick Setup Guide

This project consists of two parts:

| Part         | Technology          | Location    |
| ------------ | ------------------- | ----------- |
| **Backend**  | Spring Boot (Maven) | `backend/`  |
| **Frontend** | React (Vite)        | `frontend/` |

Below are the minimal steps your friend needs to get the application running on a fresh machine.

---

## Prerequisites

| Tool                     | Minimum version                                | How to install                                                               |
| ------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| **Java Development Kit** | JDK 17 (or any JDK supported by Spring Boot 3) | https://adoptium.net/ (or your preferred JDK installer)                      |
| **Maven**                | 3.8+                                           | Comes with most JDK bundles, otherwise https://maven.apache.org/install.html |
| **Node.js**              | 18.x LTS                                       | https://nodejs.org/ (includes npm)                                           |
| **Git** (optional)       | –                                              | https://git-scm.com/                                                         |

Make sure `java`, `mvn`, `node`, and `npm` are on your `PATH`.

---

## 1️⃣ Clone the repository

---

## 2️⃣ Backend (Spring Boot)

1. **Navigate to the backend folder**

   ```bash
   cd backend
   ```

2. **Build the project (optional but recommended)**

   ```bash
   mvn clean package
   ```

   This will download all Maven dependencies and create `target/dfl-visualizer-*.jar`.

3. **Run the application**

   ```bash
   mvn spring-boot:run
   ```

   The API will start on **http://localhost:8080** (default).  
   If you prefer to run the packaged jar directly:

   ```bash
   java -jar target/*.jar
   ```

4. **CORS** – The backend already includes a `CorsConfig` class that allows requests from `http://localhost:5173` (the default Vite dev server). No extra configuration is needed for local development.

---

## 3️⃣ Frontend (React + Vite)

1. **Open a new terminal and go to the frontend folder**

   ```bash
   cd ../frontend   # from the backend folder, or cd dfl-visualizer/frontend from the repo root
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Vite will launch the app at **http://localhost:5173** (or another port if 5173 is taken). The frontend automatically proxies API calls to the backend (port 8080).

---

## 4️⃣ Verify the setup

- Open a browser and go to `http://localhost:5173`.
- The UI should load and be able to communicate with the backend (e.g., fetch network data).
- If you see CORS errors, double‑check that the backend is running on port 8080 and that the `CorsConfig` class is present.

---

## 5️⃣ Common troubleshooting

| Symptom                                  | Likely cause                      | Fix                                                                       |
| ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `mvn` command not found                  | Maven not on PATH                 | Install Maven or add its `bin` directory to `PATH`.                       |
| `java` version too low                   | JDK < 17                          | Install a newer JDK.                                                      |
| `npm run dev` fails with missing modules | Dependencies not installed        | Run `npm install` again.                                                  |
| API requests return 404/500              | Backend not running or wrong port | Ensure `mvn spring-boot:run` is active and listening on 8080.             |
| CORS error in browser console            | Backend CORS config missing       | Verify `CorsConfig.java` is compiled and the backend is the latest build. |

---

## 6️⃣ Optional: Production build

If you want a single‑file production bundle:

```bash
# Backend
mvn clean package -DskipTests

# Frontend
npm run build   # creates `dist/` folder
```

You can then serve the static files (`frontend/dist`) with any web server (e.g., Nginx) and run the Spring Boot jar as described above.

---

**That’s it!** Your friend should now be able to clone the repo, install the prerequisites, and run both parts with the commands above. Happy coding!
