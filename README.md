# MyApp - Dockerized Node.js Cloud Application

A simple cloud-based web application built with Node.js and Express, 
containerized with Docker, and deployed on a local Virtual Machine (Ubuntu).

## Project Overview

This project demonstrates a basic cloud deployment workflow:
- A lightweight web server running inside a Virtual Machine
- Application packaged and isolated using Docker
- Container deployed and exposed via port mapping

## Architecture

## Technologies Used

- **Cloud Platform/Environment:** Local VM (VMware Workstation, Ubuntu 64-bit)
- **Containerization:** Docker
- **Programming Language:** Node.js (Express framework)
- **Version Control:** Git / GitHub

## Project Structure

## How to Run

### 1. Clone the repository
```bash
git clone https://github.com/Easymoneysniper111/myapp-docker.git
cd myapp-docker
```

### 2. Build the Docker image
```bash
sudo docker build -t myapp .
```

### 3. Run the container
```bash
sudo docker run -d -p 8080:3000 --name myapp-container myapp
```

### 4. Test the application
```bash
curl localhost:8080
curl localhost:8080/health
```

Expected response:

## API Endpoints

| Endpoint   | Method | Description                     |
|------------|--------|----------------------------------|
| `/`        | GET    | Returns a welcome message        |
| `/health`  | GET    | Returns server status and time   |

## Cloud Concepts Demonstrated

- **Virtualization:** Application runs inside a VM, isolated from the host OS.
- **Containerization:** Docker packages the app with all dependencies, 
  ensuring consistency across environments.
- **Portability:** The Docker image can be deployed on any machine with 
  Docker installed, regardless of the underlying OS.
- **Port Mapping:** Demonstrates network configuration between host and 
  container (8080 → 3000).

## Future Improvements

- Add a database container (e.g., MongoDB/PostgreSQL) using `docker-compose` 
  to demonstrate multi-container architecture and scalability.
- Add automated deployment scripts.
- Add logging and monitoring.

## Author

- **Name:** Temuulen
- **GitHub:** [Easymoneysniper111](https://github.com/Easymoneysniper111)

## Scalability Demonstration (docker-compose)

To demonstrate horizontal scaling, this project includes a `docker-compose.yml` 
file that runs **3 identical instances** of the same application simultaneously.

### Run multiple instances
```bash
sudo docker compose up -d
```

### Check running instances
```bash
sudo docker compose ps
```

| Instance | Port  |
|----------|-------|
| web1     | 8080  |
| web2     | 8081  |
| web3     | 8082  |

### Test all instances
```bash
curl localhost:8080
curl localhost:8081
curl localhost:8082
```

All three return the same response, demonstrating that a single application 
image can be scaled into multiple independent containers — simulating how a 
cloud environment handles increased load by running more instances.

### Stop all instances
```bash
sudo docker compose down
```
