# Feedback Tracker App

A full-stack feedback tracking application that allows users to submit feedback, vote on existing feedback, and manage feedback data. The application consists of a React frontend and an Express.js backend with CSV-based data storage.

## Features

- 📝 Submit feedback with name, email, and message
- 👍 Vote on existing feedback
- 📊 View all feedback in a clean, responsive interface
- 💾 CSV-based data persistence
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite

## Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **ESLint** - Code linting

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CSV Parser/Writer** - Data persistence
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## Project Structure

```
feedback-tracker-app/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── feedback.csv       # Data storage (created automatically)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # Application entry point
│   │   ├── index.css      # Global styles
│   │   └── components/
│   │       ├── FeedbackForm.jsx  # Feedback submission form
│   │       ├── FeedbackList.jsx  # Display feedback list
│   │       └── FeedbackItem.jsx  # Individual feedback item
│   ├── public/
│   ├── index.html
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── eslint.config.js   # ESLint configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd feedback-tracker-app
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

#### Production Mode

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

2. **Build and preview the frontend**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## API Endpoints

The backend provides the following REST API endpoints:

### GET `/feedback`

Retrieve all feedback entries.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great app!",
    "votes": 5,
    "createdAt": "2025-01-20T10:30:00.000Z"
  }
]
```

### POST `/feedback`

Create a new feedback entry.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is my feedback"
}
```

**Response:**

```json
{
  "message": "Feedback added successfully",
  "feedback": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is my feedback",
    "votes": 0,
    "createdAt": "2025-01-20T10:30:00.000Z"
  }
}
```

### PUT `/feedback/:id/vote`

Increment the vote count for a specific feedback entry.

**Response:**

```json
{
  "message": "Vote added successfully",
  "feedback": {
    "id": "uuid",
    "votes": 6
  }
}
```

### DELETE `/feedback/:id`

Delete a specific feedback entry.

**Response:**

```json
{
  "message": "Feedback deleted successfully"
}
```

## Environment Variables

### Frontend

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

### Backend

Create a `.env` file in the backend directory (optional):

```env
PORT=3001
```

## Data Storage

The application uses CSV files for data persistence. Feedback data is stored in `backend/feedback.csv` with the following structure:

| ID   | Name     | Email            | Message    | Votes | Created At               |
| ---- | -------- | ---------------- | ---------- | ----- | ------------------------ |
| uuid | John Doe | john@example.com | Great app! | 5     | 2025-01-20T10:30:00.000Z |

## Development

### Code Linting

Run ESLint on the frontend:

```bash
cd frontend
npm run lint
```

### Available Scripts

#### Backend

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

#### Frontend

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the repository.
