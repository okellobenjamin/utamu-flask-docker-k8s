# UTAMU CS Future Lab - Containerized Student Management System

This repository demonstrates containerization concepts using Docker with a Flask-based Student Management System for UTAMU (Uganda Technology and Management University) Computer Science Department.

## Project Overview

This project showcases:
- A Flask web application for student management
- SQLAlchemy for database operations
- RESTful API endpoints for student data
- Containerization using Docker
- Container orchestration with Kubernetes
- Modern web development practices

## Repository Structure

```
├── app.py               # Main Flask application with routes and database models
├── requirements.txt     # Python dependencies
├── Dockerfile           # Docker container configuration
├── .dockerignore        # Files to exclude from Docker build
├── static/              # Static assets (CSS, JS, images)
│   ├── css/
│   │   └── style.css    # CSS styles for the application
│   └── js/
│       └── main.js      # JavaScript functionality
├── templates/           # HTML templates
│   ├── index.html       # Homepage template
│   └── dashboard.html   # Dashboard template for student management
└── instance/            # Instance-specific files (SQLite database stored here)
    └── students.db      # SQLite database file (created at runtime)
```

## Application Features

- **Homepage**: Welcome screen with university and department information
- **Dashboard**: Interface for managing student records
- **RESTful API**: Endpoints for CRUD operations on student data
- **Database Integration**: SQLAlchemy ORM with SQLite for data persistence

## Prerequisites

To use this project, you'll need:
- Docker installed on your system
- Git (for cloning the repository)
- Kubernetes cluster or Minikube for orchestration (optional)
- kubectl command-line tool (for Kubernetes deployment)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/okellobenjamin/utamu-cs-future-lab.git
cd utamu-cs-future-lab
```

### Building the Docker Image

```bash
docker build -t utamu-cs-app .
```

### Running the Container

```bash
docker run -p 5000:5000 -v $(pwd)/instance:/app/instance utamu-cs-app
```

The application should now be accessible at http://localhost:5000

## Docker Configuration Explained

The `Dockerfile` in this repository:
1. Uses Python 3.9 slim as the base image for efficiency
2. Sets up a working directory `/app`
3. Copies and installs dependencies from requirements.txt
4. Copies application code
5. Configures environment variables for Flask
6. Creates a volume for persistent SQLite database storage
7. Exposes port 5000
8. Defines the command to run the Flask application

## Kubernetes for Container Orchestration

Kubernetes extends Docker's capabilities by providing robust container orchestration. Here's how Kubernetes enhances this application:

### Role of Kubernetes in Container Orchestration

1. **Deployment and Scaling**
   - Automatically scales the number of containers based on demand
   - Enables easy rollout of new application versions with zero downtime
   - Provides consistent deployment across different environments

2. **High Availability**
   - Automatically restarts failed containers
   - Distributes containers across multiple nodes for reliability
   - Implements health checks to ensure container functionality

3. **Service Discovery and Load Balancing**
   - Automatically assigns DNS names to services
   - Distributes traffic across containers
   - Manages internal communication between application components

4. **Configuration Management**
   - Manages application configuration through ConfigMaps
   - Handles sensitive information through Secrets
   - Separates configuration from application code

5. **Storage Orchestration**
   - Manages persistent storage for databases
   - Dynamically provisions storage resources
   - Ensures data persistence across container restarts

### Kubernetes Deployment for UTAMU CS App

Below is a Kubernetes deployment configuration for this application 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: utamu-cs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: utamu-cs-app
  template:
    metadata:
      labels:
        app: utamu-cs-app
    spec:
      containers:
      - name: utamu-cs-app
        image: utamu-cs-app:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          value: "sqlite:///students.db"
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: secret-key
        volumeMounts:
        - name: db-storage
          mountPath: /app/instance
      volumes:
      - name: db-storage
        persistentVolumeClaim:
          claimName: utamu-cs-db-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: utamu-cs-app-service
spec:
  selector:
    app: utamu-cs-app
  ports:
  - port: 80
    targetPort: 5000
  type: LoadBalancer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: utamu-cs-db-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

### Deploying to Kubernetes

```bash
# Apply the configuration
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# Access the application
# For Minikube
minikube service utamu-cs-app-service
# For cloud providers, get the external IP
kubectl get service utamu-cs-app-service
```

## Containerization vs. Virtual Machines

| Containerization | Virtual Machines |
|------------------|-----------------|
| Shares the host OS kernel | Runs a complete OS |
| Lightweight (MBs) | Heavier (GBs) |
| Starts in seconds | Starts in minutes |
| Less isolated | More isolated |
| Efficient resource usage | Higher resource overhead |

## Development and Debugging

### Local Development

```bash
# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the application
flask run
```

### Debugging Docker Container

```bash
# Access container logs
docker logs [container_id]

# Interactive shell inside the container
docker exec -it [container_id] /bin/bash
```

## Contributing

Contributions to improve the application or containerization setup are welcome. Please feel free to submit a pull request or create an issue for any bugs or feature requests.

## About the Author

This project was developed by OKELLO BENJAMIN (JAN24/BCS/3855U/TF) for UTAMU CS Future Lab.

