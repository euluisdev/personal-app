# BestFit — Workout Management Platform

A full-stack web application for managing students and generating gym workout plans, built with Next.js and MongoDB.

**Live Demo:** [https://bestfitclass.vercel.app](https://bestfitclass.vercel.app)

**Repository:** [https://github.com/euluisdev/personal-app](https://github.com/euluisdev/personal-app)

## Overview

BestFit is a workout management platform designed to connect students and administrators through a centralized web application.

The system provides user authentication, student registration, administrative approval, and workout generation. Users can create accounts and access the platform after their registration has been approved by an administrator.

Workout information is stored in a database, allowing the application to maintain user data and training plans.

The project was developed as a full-stack application, combining frontend development, backend functionality, database integration, authentication, and deployment.

## Main Features

### 1. User Authentication

The application includes an authentication system with:

- User registration.
- Login with email and password.
- Password recovery functionality.
- Protected access to the application.

### 2. Student Registration and Management

Students can create accounts through the registration page.

The registration process includes an administrative approval workflow:

- Students submit their registration information.
- Administrators review registration requests.
- Access is granted after administrative approval.

This workflow provides control over which users can access the platform.

### 3. Workout Generation

The platform allows workout plans to be generated for registered students.

The system is designed to organize training information and associate workout plans with their respective users.

### 4. Database Integration

MongoDB is used to persist application data, including student information and workout records.

This allows information to remain available between user sessions instead of relying exclusively on temporary frontend state.

### 5. Password Recovery

The application provides a password recovery flow to help users regain access to their accounts.

The project includes email-related functionality to support account recovery.

### 6. Administrative Workflow

The application includes administrative functionality for managing student access through the registration approval process.

This separates the student registration experience from the administrative approval process.

## Technologies Used

| Technology | Purpose |
|---|---|
| Next.js 14 | Full-stack React framework |
| React 18 | User interface development |
| JavaScript | Application logic |
| MongoDB | Database and data persistence |
| Axios | HTTP requests |
| bcryptjs | Password hashing support |
| jsonwebtoken | Token-based authentication support |
| Nodemailer | Email functionality |
| Cloudinary | Image management integration |
| NextAuth.js | Authentication library |
| Lucide React | Interface icons |
| React Icons | Icon library |
| Recharts | Data visualization |
| Plotly.js | Interactive charts |
| Vercel | Application deployment |

## Development Concepts

This project involves several concepts and practices related to full-stack development:

- Component-based architecture with React.
- Full-stack development with Next.js.
- User authentication and protected access.
- Password hashing.
- Password recovery workflows.
- Role-based administrative workflows.
- Database integration with MongoDB.
- Data persistence.
- HTTP requests and API communication.
- Email integration.
- Image management.
- Application deployment with Vercel.

## Project Structure

The repository is organized into the following main directories and configuration files:

```text
personal-app/
├── public/
│   └── uploads/
├── src/
├── .eslintrc.json
├── .gitignore
├── LICENSE
├── README.md
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
└── vercel.json
```

## Getting Started

Follow the steps below to run the project locally.

### Prerequisites

- Node.js
- npm
- A MongoDB database
- The required environment variables and external service configurations

### Installation

Clone the repository:

```bash
git clone https://github.com/euluisdev/personal-app.git
```

Navigate to the project directory:

```bash
cd personal-app
```

Install the dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env.local` file in the project root and configure the environment variables required by the application.

These may include database connection details, authentication configuration, email service credentials, and external service credentials.

For security reasons, never commit real credentials, API keys, or private environment variables to the repository.

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs the Next.js lint command |

## Deployment

The application is deployed on Vercel.

**Production URL:** [https://bestfitclass.vercel.app](https://bestfitclass.vercel.app)

The production environment requires the appropriate environment variables and external service configurations to be set in the deployment platform.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Developed by [euluisdev](https://github.com/euluisdev).
