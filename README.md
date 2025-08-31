# Event Sample - Django React Application

A full-stack web application built with Django (backend) and React (frontend) for event management.

##  Features

- Django REST API backend
- React frontend with modern UI
- Event management system
- File upload functionality
- SQLite database
- Docker support

## Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.8+**
- **Node.js 14+**
- **npm or yarn**
- **Git**
- **Docker & Docker Compose** (optional)

## Installation & Setup

### Method 1: Manual Setup

#### Backend Setup (Django)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd EVENT_SAMPLE
   ```

2. **Create and activate virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```


5. **Start Django development server**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://localhost:8000`

#### Frontend Setup (React)

1. **Open new terminal and navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start React development server**
   ```bash
   npm start
   # or
   yarn start
   ```
   Frontend will be available at `http://localhost:3000`


## Project Structure

```
EVENT_SAMPLE/
├── backend/                    # Django backend
│   ├── event_search_*/         # Django apps
│   ├── events/                 # Events app
│   ├── uploads/                # File uploads
│   ├── venv/                   # Virtual environment
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── db.sqlite3            # SQLite database
├── frontend/                   # React frontend
│   ├── node_modules/          # Node dependencies
│   ├── public/                # Public assets
│   ├── src/                   # React source code
│   ├── package.json           # Node dependencies
│   └── tailwind.config.js     # Tailwind CSS config
├── .gitignore                 # Git ignore rules
├── docker-compose.yml         # Docker configuration
└── README.md                  # This file
```
