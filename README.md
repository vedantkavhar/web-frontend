# 📘 NGO Report Manager - Frontend

Simple React application for NGO report management with tabbed interface.

## 🚀 Features

### NGO Portal
- **Single Report Form** - Submit individual monthly reports
- **Bulk CSV Upload** - Upload multiple reports via CSV file
- **Progress Tracking** - Real-time upload progress

### Admin Dashboard
- **Monthly Analytics** - View aggregated data by month
- **Simple Metrics** - Total NGOs, people helped, events, funds
- **Clean Interface** - Easy-to-use dashboard

## 🧱 Tech Stack

- **React** - Component-based UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Fetch API** - HTTP client for API communication
- **Polling** - Real-time job progress updates

## 🏗️ Component Architecture

```
src/
├── components/
│   ├── CsvUpload.jsx    # File upload with drag & drop
│   ├── ReportForm.jsx   # Monthly report submission
│   └── Dashboard.jsx    # Admin analytics dashboard
├── utils/
│   └── constant.js      # API configuration
└── App.jsx             # Main application component
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+
- npm 

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

Update API base URL in `src/utils/constant.js`:

```javascript
export const API_BASE = "http://localhost:7777";
```

## 📡 API Integration

The frontend communicates with the backend through these endpoints:

- `POST /report` - Submit single report
- `POST /reports/upload` - Upload CSV file
- `GET /job-status/:jobId` - Check processing status
- `GET /dashboard?month=YYYY-MM` - Get dashboard data

## 🎨 UI Features

### Tabbed Interface
- NGO Portal and Admin Dashboard tabs
- Role-based navigation
- Clean separation of functions

### File Upload
- Custom file picker with visual feedback
- CSV validation
- Progress tracking
- Simple error handling

### Dashboard
- Month input for filtering
- Basic metrics display
- Loading states

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## ♿ Accessibility

- Keyboard navigation support
- Screen reader compatible
- High contrast colors
- Focus indicators
- ARIA labels