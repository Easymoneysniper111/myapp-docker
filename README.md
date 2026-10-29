# Cloud Notes: Dockerized Web App with Load Balancing

A small notes application used to demonstrate cloud concepts on a local
Virtual Machine: containerization, load balancing, shared storage,
healthchecks and monitoring.

## Architecture

    Browser --> Nginx :80 (load balancer)
                  |-- web1 (Node.js) :8080
                  |-- web2 (Node.js) :8081
                  |-- web3 (Node.js) :8082
                         |
                         v
                     MongoDB (volume: mongo-data)

    Portainer :9000 (container dashboard)

Everything runs as Docker containers started by Docker Compose inside an
Ubuntu VM (VMware Workstation).

## Services

| Service   | Purpose                                              |
|-----------|------------------------------------------------------|
| web1-3    | Identical Node.js/Express instances                  |
| nginx     | Reverse proxy, round-robin load balancer on port 80  |
| db        | MongoDB 6 with a persistent named volume             |
| portainer | Web dashboard for viewing and controlling containers |

## Technologies

VMware Workstation, Ubuntu, Docker, Docker Compose, Nginx, Node.js,
Express, MongoDB, Mongoose, HTML/CSS/JavaScript, Portainer, Git/GitHub.

## Project structure

    myapp/
    |-- app.js               Express server and REST API
    |-- package.json
    |-- Dockerfile
    |-- docker-compose.yml   6 services
    |-- nginx.conf           Load balancer configuration
    |-- public/index.html    Browser interface
    `-- README.md

## How to run

    git clone https://github.com/Easymoneysniper111/myapp-docker.git
    cd myapp-docker
    sudo docker compose up -d --build
    sudo docker compose ps

Open http://localhost for the web interface and http://localhost:9000
for Portainer (create the admin user within 5 minutes of first start).

## API

| Endpoint     | Method        | Description                               |
|--------------|---------------|-------------------------------------------|
| /            | GET           | Web interface                             |
| /notes       | GET, POST     | List notes, create a note                 |
| /notes/:id   | PUT, DELETE   | Edit, delete a note                       |
| /health      | GET           | Status used by Docker healthchecks        |
| /metrics     | GET           | Container name, uptime, requests handled  |
| /whoami      | GET           | Name of the container that answered       |

Example:

    curl -X POST localhost/notes -H "Content-Type: application/json" -d '{"text":"hello"}'
    curl localhost/notes

## Demonstrations

**Load balancing.** In the browser, click "Send 12 requests": each
container answers about a third of them. From the terminal:

    for i in 1 2 3 4 5 6; do curl -s localhost/whoami; echo; done

**Shared storage.** Add a note, then reload several times. Different
containers answer, but the same data is shown, because all instances use
one MongoDB database.

**Failure.** Stop one instance and send requests again; the other two keep
serving:

    sudo docker stop myapp-web1
    sudo docker start myapp-web1

## Reliability and monitoring

- Each web container has a Docker healthcheck calling /health, visible as
  "healthy" in `docker compose ps` and in Portainer.
- `restart: always` restarts containers that crash or after a reboot. A
  container stopped manually stays stopped.
- `/metrics` exposes uptime and request counts per container.
- MongoDB data persists in the `mongo-data` volume.

## Limitations

- Everything runs on a single VM, so a VM failure takes down the whole
  system. Real high availability needs several hosts.
- MongoDB has no password. Its port is not published, so it is reachable
  only from inside the Docker network.
- Load balancing is simple round-robin; there is no HTTPS or autoscaling.
- Portainer has access to the Docker socket, which is acceptable for a
  local demo but needs care in production.

## Author

Nasanbat Temuulen (202438416), GitHub: Easymoneysniper111
