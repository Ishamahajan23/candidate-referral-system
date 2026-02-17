# Candidate Referral Management System

A full-stack web application that simulates part of Worko's functionality for managing candidate referrals. Built with React frontend and Node.js/Express backend with MongoDB database.

## Features Implemented

### Frontend (React)
- **Dashboard**: Display list of referred candidates with search and filter functionality
- **Candidate Management**: View, update status, and delete candidates
- **Referral Form**: Add new candidates with form validation and PDF resume upload
- **Real-time Statistics**: Show total candidates and status breakdown
- **Responsive Design**: Mobile-friendly interface
- **State Management**: Using React Hooks (useState, useEffect)

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for candidates
- **File Upload**: PDF resume upload with validation
- **Data Validation**: Email and phone number format validation
- **Search & Filter**: Backend support for searching and filtering candidates
- **Error Handling**: Comprehensive error responses
- **Statistics Endpoint**: Candidate metrics and analytics

### Database (MongoDB)
- **Candidate Model**: Stores name, email, phone, job title, status, and resume URL
- **Timestamps**: Automatic creation and update timestamps
- **Validation**: Schema-level validation with Mongoose

## API Endpoints

### Candidates
- `GET /api/candidates` - Fetch all candidates (supports search & status filter)
- `POST /api/candidates` - Create new candidate (with optional resume upload)
- `PUT /api/candidates/:id/status` - Update candidate status
- `DELETE /api/candidates/:id` - Delete candidate
- `GET /api/candidates/stats` - Get candidate statistics

### Query Parameters for GET /api/candidates
- `search` - Search by name, job title, or email
- `status` - Filter by status (Pending, Reviewed, Hired)


## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd candidate-referral-system
```

### 2. Backend Setup
```bash
cd server
npm install
```

Start the backend server:
```bash
npm run dev
# or
node server.js
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Database Setup
- Ensure MongoDB is running locally or provide a MongoDB Atlas connection string
- The application will automatically create the database and collections when first candidate is added

## Usage



## Development Scripts

### Backend
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start production server
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## API Testing

You can test the API endpoints using tools like Postman or curl:

### Create Candidate
```bash
curl -X POST http://localhost:5000/api/candidates \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=+1234567890" \
  -F "jobTitle=Software Engineer" \
  -F "resume=@path/to/resume.pdf"
```

### Get All Candidates
```bash
curl http://localhost:5000/api/candidates
```

### Update Status
```bash
curl -X PUT http://localhost:5000/api/candidates/CANDIDATE_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Reviewed"}'
```

---

**Built with ❤️ for Worko Assignment**