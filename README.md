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

## Project Structure

```
candidate-referral-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx       # Main dashboard component
│   │   │   ├── Dashboard.css
│   │   │   ├── ReferralForm.jsx    # Candidate referral form
│   │   │   ├── ReferralForm.css
│   │   │   ├── Navigation.jsx      # Navigation component
│   │   │   └── Navigation.css
│   │   ├── App.jsx         # Main app component
│   │   ├── App.css         # Global styles
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
└── server/                 # Node.js backend
    ├── controllers/
    │   └── candidateController.js  # Business logic
    ├── models/
    │   └── candidate.js     # Mongoose schema
    ├── routes/
    │   └── candidateRoutes.js      # API routes
    ├── uploads/            # Resume file storage
    ├── server.js           # Server entry point
    ├── package.json
    └── .env                # Environment variables
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

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

Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/candidate-referral
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/candidate-referral
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

### Adding Candidates
1. Navigate to "Refer Candidate" tab
2. Fill in the required fields (Name, Email, Phone, Job Title)
3. Optionally upload a PDF resume (max 5MB)
4. Click "Refer Candidate" to submit

### Managing Candidates
1. View all candidates on the Dashboard
2. Use the search bar to find specific candidates
3. Filter by status using the dropdown
4. Update candidate status using the dropdown in each candidate card
5. Delete candidates using the delete button

### Dashboard Features
- **Statistics Cards**: Real-time count of total, pending, reviewed, and hired candidates
- **Search**: Find candidates by name, job title, or email
- **Filter**: View candidates by status (All, Pending, Reviewed, Hired)
- **Status Update**: Change candidate status directly from the dashboard
- **Resume Access**: Click "View PDF" to download/view uploaded resumes

## Validation Rules

### Email Validation
- Must be a valid email format (example@domain.com)
- Converted to lowercase before storage

### Phone Validation
- Must contain at least 10 digits
- Accepts various formats: +1234567890, (123) 456-7890, 123-456-7890

### Resume Upload
- Only PDF files accepted
- Maximum file size: 5MB
- Files stored in server's `uploads/` directory

### Required Fields
- Name (minimum 2 characters)
- Email (valid format)
- Phone (minimum 10 digits)
- Job Title (minimum 2 characters)

## Error Handling

### Frontend
- Real-time form validation with error messages
- Network error handling with user-friendly messages
- File upload validation (type and size)

### Backend
- Comprehensive input validation
- Duplicate email prevention
- File type and size validation
- MongoDB connection error handling
- Detailed error responses with appropriate HTTP status codes

## Security Features

- Input sanitization and validation
- File type restrictions for uploads
- CORS configuration for cross-origin requests
- MongoDB injection prevention through Mongoose

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **CSS3** - Styling with Flexbox and Grid
- **Vanilla JavaScript** - No additional frameworks

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

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

## Assumptions & Limitations

### Assumptions
- Users have basic computer literacy
- PDF is the standard format for resumes
- Candidates are okay with their information being stored
- Single-user system (no authentication implemented in basic version)

### Current Limitations
- No user authentication/authorization
- Local file storage (not cloud-based)
- No email notifications to candidates
- No advanced search (partial matching only)
- No candidate duplicate detection beyond email
- No audit trail for status changes
- No bulk operations
- No data export functionality

## Future Enhancements

### Authentication & Security
- JWT-based user authentication
- Role-based access control (HR, Recruiters, Admins)
- Password hashing and secure sessions

### Advanced Features
- Email notifications to candidates
- Resume parsing and data extraction
- Advanced search with filters (skills, experience, location)
- Candidate interview scheduling
- Document version control
- Audit logs and change history

### Cloud Integration
- AWS S3 or Google Cloud Storage for resume files
- MongoDB Atlas for cloud database
- Email service integration (SendGrid, AWS SES)

### UI/UX Improvements
- Dark mode toggle
- Advanced data visualization and charts
- Pagination for large datasets
- Drag-and-drop file upload
- Bulk actions (import/export CSV)

### Performance & Scalability
- Redis caching for frequently accessed data
- Database indexing optimization
- API rate limiting
- Image optimization and CDN

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs
4. Provide environment details (OS, Node.js version, etc.)

---

**Built with ❤️ for Worko Assignment**