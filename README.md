# BestFit — AI-Powered Workout Management Platform

A full-stack web application for student management and AI-assisted workout generation, built with Next.js, React, and MongoDB.

**Live Demo:** [https://bestfitclass.vercel.app](https://bestfitclass.vercel.app)

**Repository:** [https://github.com/euluisdev/personal-app](https://github.com/euluisdev/personal-app)

## Overview

BestFit is a workout management platform designed to connect students and administrators through a centralized web application.

The system provides user authentication, student registration, password recovery, administrative approval, and workout management.

One of its main features is AI-assisted workout generation. Administrators can select training parameters, request exercise suggestions from an AI service, review and customize the generated exercises, and assign the final workout to one or more approved students.

Workout information is stored in MongoDB, allowing student records and training plans to persist between sessions.

The project combines frontend development, backend functionality, database integration, external API consumption, authentication, and business logic in a production-deployed application.

## Main Features

### 1. User Authentication

The application includes an authentication system with:

- User registration.
- Login with email and password.
- Password recovery functionality.
- Protected access to application features.

### 2. Student Registration and Administrative Approval

Students can create accounts through the registration page.

The registration process includes an administrative approval workflow:

- Students submit their registration information.
- Administrators review registration requests.
- Only approved students are available for workout assignment.

This workflow gives administrators control over access to the platform.

### 3. AI-Assisted Workout Generation

BestFit integrates with the **Cohere Generate API** to generate exercise suggestions based on parameters selected by the administrator.

The administrator can define:

- **Muscle Group:** such as chest, back, shoulders, biceps, triceps, legs, and other muscle groups.
- **Training Level:** Beginner, Intermediate, Advanced, or Bodybuilder.
- **Training Category:** Hypertrophy, Weight Loss, Strength Gain, Endurance, or Cardio.

Based on these selections, the application dynamically builds a prompt and sends a request to the Cohere API.

The AI is instructed to generate five specific exercises for the selected muscle group, including:

- Exercise name.
- Number of sets.
- Number of repetitions.
- Equipment or machine required.

The generated suggestions are displayed as a preview before being included in a workout.

### 4. Workout Customization and Review

The administrator maintains control over the final workout instead of saving the AI-generated suggestions automatically.

The workflow allows the administrator to:

- Select which generated exercises should be included.
- Organize exercises by muscle group.
- Edit exercise descriptions.
- Remove individual exercises.
- Remove entire muscle groups.
- Review the workout before saving it.

This approach combines AI-generated suggestions with human review and customization.

### 5. Workout Assignment and Persistence

After reviewing the workout, the administrator selects a date and confirms its creation.

The application then:

1. Validates that at least one student is selected.
2. Checks that the workout contains exercises.
3. Requires a workout date.
4. Requests confirmation before saving.
5. Sends the workout data to the application's backend for each selected student.
6. Associates the workout with the corresponding student.

Newly created workouts receive an initial **Pending** status.

The saved information includes the selected muscle groups and exercises, workout date, description, and administrator identification.

### 6. Database Integration

MongoDB is used to persist application data, including student information and workout records.

This allows the platform to maintain information between sessions and associate training plans with their respective students.

### 7. Password Recovery

The application provides a password recovery workflow to help users regain access to their accounts.

Email-related functionality supports the account recovery process.

### 8. Administrative Workflow

The administrative area provides functionality for managing approved students and creating workout plans.

Administrators can search for students, select multiple users, generate exercise suggestions, customize workouts, and assign the final plans.

## AI Integration Workflow

The workout generation process follows a human-in-the-loop approach:

```text
Administrator selects students
          |
          v
Selects muscle group, level
and training category
          |
          v
Application builds the prompt
          |
          v
Cohere API generates
exercise suggestions
          |
          v
Administrator reviews
the generated exercises
          |
          v
Edits, adds or removes exercises
          |
          v
Selects workout date
          |
          v
Confirms workout creation
          |
          v
Backend saves workout data
for each selected student
          |
          v
Workout status: Pending
```

## Technologies Used

| Technology | Purpose |
|---|---|
| Next.js 14 | Full-stack React framework |
| React 18 | User interface development |
| JavaScript | Application logic |
| MongoDB | Database and data persistence |
| Cohere API | AI-assisted exercise generation |
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

Throughout this project, I worked with several concepts and practices related to full-stack development:

- Component-based architecture with React.
- Full-stack development with Next.js.
- User authentication and protected access.
- Password hashing.
- Password recovery workflows.
- Administrative approval workflows.
- Database integration with MongoDB.
- Data persistence and student-workout relationships.
- External API integration.
- AI-powered content generation.
- Dynamic prompt construction.
- Asynchronous HTTP requests.
- Form validation and state management.
- Human review of AI-generated content.
- Application deployment with Vercel.

## Project Structure

The repository contains the following main directories and configuration files:

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
- A MongoDB database.
- Cohere API credentials.
- Email service configuration.
- Any additional external service credentials required by the application.

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

These may include:

- MongoDB connection string.
- Authentication secrets.
- Cohere API credentials.
- Email service credentials.
- Cloudinary credentials.

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

The production environment requires the appropriate environment variables and external service configurations to be configured in the deployment platform.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Developed by [euluisdev](https://github.com/euluisdev).
