# JobFinder

JobFinder is a modern job board built with Angular 21, featuring a clean UI, job search, filtering, and user authentication.

## Features

- **Job Board**: Browse and search job listings
- **Job Details**: View detailed job descriptions
- **Search & Filter**: Search by keyword and filter by location
- **User Authentication**: Register and login functionality
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Angular 21
- **Styling**: tailwindcss
- **State Management**: NgRx
- **Routing**: Angular Router
- **HTTP Client**: Angular HttpClient

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kooutar/JobFinder.git
   cd JobFinder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:

```bash
npm start
```

The application will open at `http://localhost:4200` by default.

## Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── jobs/          # Job-related components and services
│   │   ├── auth/          # Authentication components and services
│   │   └── shared/        # Shared components and modules
│   ├── core/              # Core services and interceptors
│   ├── environments/      # Environment configuration
│   └── app.routes.ts      # Main application routes
├── assets/                # Static assets
└── environments/          # Environment configuration
```

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```




## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
