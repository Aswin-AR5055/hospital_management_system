# Hospital Management System

A full-stack hospital management system built with Django REST Framework (backend) and React (frontend), deployed on AWS EC2 with CloudFront CDN.

## 🚀 Live Demo

<div align="center">

### [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Application-success?style=for-the-badge&logo=google-chrome&logoColor=white)](https://d2wb2a9ugg8m3h.cloudfront.net)

**🔐 Test Credentials**

| Field | Value |
|-------|-------|
| 👤 Username | `admin` |
| 🔑 Password | `admin123` |
| 🎭 Role | Reception (Full Access) |

</div>

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Deployment Architecture](#deployment-architecture)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Features

- **User Management**: Role-based access control (Reception & Doctor)
- **Patient Management**: Register and manage patient records with photos
- **Visit Tracking**: Record patient visits with vital signs and health issues
- **Prescription Management**: Create and manage prescriptions for patient visits
- **JWT Authentication**: Secure token-based authentication
- **Responsive UI**: Modern React-based frontend
- **Automated Deployment**: CI/CD pipeline with GitHub Actions

---

## Architecture

### Production Deployment Architecture

```
                    ┌─────────────────────┐
                    │   CloudFront CDN    │
                    │  (Global Content    │
                    │   Distribution)     │
                    └──────────┬──────────┘
                               │ HTTPS
                               │
                    ┌──────────▼──────────┐
                    │    AWS EC2 Instance │
                    │   (Ubuntu Server)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Nginx (Port 80)   │
                    │  Reverse Proxy      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
         │   Frontend  │ │  Backend │ │ PostgreSQL │
         │   (React)   │ │ (Django) │ │  Database  │
         │   Nginx     │ │ Gunicorn │ │  (Port     │
         │   (Port 80) │ │(Port 8000)│ │   5432)    │
         └─────────────┘ └──────────┘ └────────────┘
              Docker         Docker        Docker
            Container      Container     Container
```

### Local Development Architecture

```
                ┌─────────────────────┐
                │   PostgreSQL DB     │
                │  (Hospital Server)  │
                └──────────┬──────────┘
                           │
                    Django + DRF API
                           │
                ┌──────────┴──────────┐
                │   Hospital Server   │
                │  (One Computer)     │
                └──────────┬──────────┘
                           │
                    LAN Router / Switch
            ┌──────────────┼──────────────┐
            │              │              │
     Reception PC     Doctor PC      Doctor PC
       (React)          (React)         (React)
```

---

## Tech Stack

### Backend
- **Framework**: Django 6.0.3 (Python 3.12)
- **API**: Django REST Framework 3.16.1
- **Authentication**: JWT (djangorestframework-simplejwt 5.5.1)
- **Database**: PostgreSQL 15
- **WSGI Server**: Gunicorn 25.1.0
- **Image Processing**: Pillow 12.1.1
- **CORS**: django-cors-headers 4.9.0

### Frontend
- **Framework**: React 18+ with Vite
- **HTTP Client**: Axios
- **Routing**: React Router
- **Styling**: CSS3

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (Alpine)
- **CI/CD**: GitHub Actions
- **Cloud**: AWS EC2 (Ubuntu 22.04)
- **CDN**: AWS CloudFront
- **Version Control**: Git & GitHub

---

## Database Schema

### ERD (Entity Relationship Diagram)

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)             │
│ username            │
│ email               │
│ password            │
│ role (doctor/       │
│       reception)    │
│ first_name          │
│ last_name           │
│ is_staff            │
│ is_superuser        │
└─────────────────────┘
          │
          │ created_by (FK)
          │
          ▼
┌─────────────────────┐
│      Patient        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ age                 │
│ gender              │
│ phone               │
│ address             │
│ photo               │
│ created_by (FK)     │───┐
│ created_at          │   │
└─────────────────────┘   │
          │               │
          │ patient (FK)  │
          │               │
          ▼               │
┌─────────────────────┐   │
│       Visit         │   │
├─────────────────────┤   │
│ id (PK)             │   │
│ patient (FK)        │   │
│ doctor (FK)         │───┤
│ visit_date          │   │
│ blood_pressure      │   │
│ temperature         │   │
│ pulse_rate          │   │
│ health_issue        │   │
│ created_at          │   │
└─────────────────────┘   │
          │               │
          │ visit (FK)    │
          │               │
          ▼               │
┌─────────────────────┐   │
│   Prescription      │   │
├─────────────────────┤   │
│ id (PK)             │   │
│ visit (FK)          │   │
│ medication          │   │
│ dosage              │   │
│ instructions        │   │
│ prescribed_by (FK)  │───┘
│ created_at          │
└─────────────────────┘
```

### Models Description

#### User Model
- Custom user model extending Django's AbstractUser
- Fields: username, email, password, role (doctor/reception), first_name, last_name
- Roles: `doctor` or `reception`

#### Patient Model
- Fields: name, age, gender, phone, address, photo (ImageField)
- Relationships: created_by (ForeignKey to User)

#### Visit Model
- Fields: visit_date, blood_pressure, temperature, pulse_rate, health_issue
- Relationships: 
  - patient (ForeignKey to Patient)
  - doctor (ForeignKey to User)

#### Prescription Model
- Fields: medication, dosage, instructions
- Relationships:
  - visit (ForeignKey to Visit)
  - prescribed_by (ForeignKey to User)

---

## Deployment Architecture

### Docker Containers

The application runs in 4 Docker containers:

1. **PostgreSQL Container** (`postgres:15`)
   - Database server
   - Port: 5432 (internal)
   - Persistent volume: `postgres_data`

2. **Backend Container** (Django + Gunicorn)
   - Python 3.12
   - Gunicorn with 3 workers
   - Port: 8000 (internal)
   - Timeout: 120 seconds

3. **Frontend Container** (React + Nginx)
   - Node.js 20 for build
   - Nginx Alpine for serving
   - Port: 80 (internal)

4. **Nginx Container** (Reverse Proxy)
   - Routes `/api/` to backend
   - Routes `/admin/` to backend
   - Routes `/` to frontend
   - Port: 80 (exposed)

### Network Configuration

- All containers run on a Docker bridge network
- Nginx acts as reverse proxy
- Backend connects to database via hostname `db`
- Frontend served as static files

---

## Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Git
- Node.js 20+ (for local development)
- Python 3.12+ (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hospital_management_system.git
   cd hospital_management_system
   ```

2. **Create environment file**
   ```bash
   cat > .env <<EOF
   POSTGRES_DB=hospital_db
   POSTGRES_USER=hospital_user
   POSTGRES_PASSWORD=your_password
   DJANGO_SECRET_KEY=your_secret_key
   DEBUG=True
   EOF
   ```

3. **Start services**
   ```bash
   docker-compose up -d --build
   ```

4. **Run migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

6. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api/
   - Admin Panel: http://localhost/admin/

### Production Deployment

The application is automatically deployed to AWS EC2 via GitHub Actions on every push to the `master` branch.

**Manual deployment steps:**

1. SSH into EC2 instance
2. Pull latest changes
3. Run deployment script (handled by GitHub Actions)

---

## Environment Variables

### Backend (.env)

```env
POSTGRES_DB=hospital_db
POSTGRES_USER=hospital_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=db
DB_PORT=5432
DJANGO_SECRET_KEY=your_django_secret_key
DEBUG=False
```

### Frontend (.env)

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

**Note**: In production, `VITE_API_URL` is not set, so it defaults to `/api/` (relative URL).

---

## API Endpoints

### Authentication
- `POST /api/login/` - User login (returns JWT tokens)
- `POST /api/token/refresh/` - Refresh access token

### Users
- `GET /api/users/` - List all users (Reception only)
- `POST /api/users/` - Create new user (Reception only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Patients
- `GET /api/patients/` - List all patients
- `POST /api/patients/` - Create new patient
- `GET /api/patients/{id}/` - Get patient details
- `PUT /api/patients/{id}/` - Update patient
- `DELETE /api/patients/{id}/` - Delete patient

### Visits
- `GET /api/visits/` - List all visits
- `POST /api/visits/` - Create new visit
- `GET /api/visits/{id}/` - Get visit details
- `PUT /api/visits/{id}/` - Update visit
- `DELETE /api/visits/{id}/` - Delete visit

### Prescriptions
- `GET /api/prescriptions/` - List all prescriptions
- `POST /api/prescriptions/` - Create new prescription
- `GET /api/prescriptions/{id}/` - Get prescription details
- `PUT /api/prescriptions/{id}/` - Update prescription
- `DELETE /api/prescriptions/{id}/` - Delete prescription

---

## User Roles

### Reception
- Full access to user management
- Can create doctors and other reception staff
- Can manage patients
- Can view all visits and prescriptions
- **Default superuser role**

### Doctor
- Can view and create patients
- Can create and manage visits
- Can create and manage prescriptions
- Cannot manage users

---

## CI/CD Pipeline

### GitHub Actions Workflow

**Trigger**: Push to `master` branch

**Steps**:
1. SSH into EC2 instance
2. Install/update Docker and Docker Compose
3. Clone/pull repository
4. Create `.env` file from GitHub Secrets
5. Stop existing containers
6. Build and start new containers
7. Wait for database to be ready (10 seconds)
8. Run database migrations
9. Collect static files
10. Create/update superuser with reception role

### GitHub Secrets Required

- `EC2_HOST` - EC2 instance public IP
- `EC2_SSH_KEY` - Private SSH key for EC2
- `REPO_URL` - GitHub repository URL
- `POSTGRES_DB` - Database name
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `DJANGO_SECRET_KEY` - Django secret key

---

## Default Credentials

**Superuser (Reception)**
- Username: `admin`
- Password: `admin123`
- Email: `admin@hospital.com`
- Role: `reception`

**⚠️ Change these credentials immediately after first login in production!**

---

## Project Structure

```
hospital_management_system/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── backend/
│   ├── hospital/               # Django project root
│   │   ├── hospital/           # Settings & config
│   │   ├── patients/           # Patient app
│   │   ├── visits/             # Visit app
│   │   ├── prescriptions/      # Prescription app
│   │   ├── users/              # User app
│   │   ├── manage.py
│   │   └── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/                # API client
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── nginx/
│   └── default.conf            # Nginx configuration
├── docker-compose.yml
└── README.md
```

---

## Technologies & Versions

| Technology | Version |
|------------|---------|
| Python | 3.12 |
| Django | 6.0.3 |
| Django REST Framework | 3.16.1 |
| PostgreSQL | 15 |
| Node.js | 20 |
| React | 18+ |
| Nginx | 1.29.6 (Alpine) |
| Gunicorn | 25.1.0 |
| Docker Compose | 2.27.0 |

---

## License

This project is licensed under the MIT License.

---

## Author

**Aswin Raj A** - Full Stack Development & DevOps

---

## Support

For issues and questions, please open an issue on GitHub.

---

## Acknowledgments

- Django REST Framework for the powerful API framework
- React team for the amazing frontend library
- Docker for containerization
- AWS for cloud infrastructure
