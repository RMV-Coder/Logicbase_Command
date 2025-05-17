# Logicbase\_Command

Final Web App Project Output of Raymond M. Valdepeñas for Logicbase OJT 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
   * [Frontend](#frontend)
   * [Backend](#backend)
   * [Database](#database)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [API Documentation](#api-documentation)
6. [Deployment](#deployment)
7. [Admin Accounts](#admin-accounts)
8. [Additional Libraries and Tools](#additional-libraries-and-tools)

---

## Introduction

Logicbase\_Command is a web-based application developed using modern web technologies. The system comprises a frontend built with React and Next.js, a backend powered by Next.js (App Router), and a MySQL database managed via Aiven Console. For real-time chat functionality, the application integrates **Ably**, a serverless WebSocket platform, to overcome the limitations of Vercel's serverless environment.

---

## Tech Stack

### Frontend

* **React**: A JavaScript library for building user interfaces.
* **Next.js**: A React-based framework for building server-rendered and statically generated websites.
* **Material-UI**: A popular React UI framework for building responsive and customizable interfaces.
* **Ant Design**: A popular React UI framework for building responsive and customizable interfaces.
* **Zustand**: A state management library for React applications.

### Backend

* **Next.js**: Utilized for both frontend and backend logic, leveraging its App Router for API routes.

### Database

* **MySQL**: A popular open-source relational database management system, managed via Aiven Console.

---

## Project Structure

The project is organized into the following directories:

* `src`: Contains the frontend code.
* `app`: Contains the Next.js application code.
* `components`: Houses reusable React components.
* `lib`: Includes utility functions and libraries.
* `stores`: Contains Zustand stores for state management.
* `hooks`: Contains custom hooks, including NodeMailer for automated email functionality.

---

## Getting Started

To set up and run the project locally:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/RMV-Coder/Logicbase_Command.git
    ```

2. **Navigate to Project Directory**:
    ```bash
    cd logicbase_command
    ```
3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Configure environment variables**:

   * Create a `.env` file in the root directory.
   * Set up the necessary environment variables as per your configuration.

5. **Set up the MySQL database**:

   * Use the provided `database_structure.sql` file to initialize the database schema.

6. **Build the project**:

   ```bash
   npm run build
   ```

7. **Start the development server**:

   ```bash
   npm run start
   ```

8. **Access the application**:

   * Open your browser and navigate to `http://localhost:3000`.

---

## API Documentation

The Logicbase_Command application provides a RESTful API for interacting with the system. Below is the documentation for available endpoints.

**TO BE ADDED**

---

## Deployment

The application is deployed on **Vercel** and can be accessed at:

👉 [https://logicbase-command.vercel.app/](https://logicbase-command.vercel.app/)

**Note on Real-Time Functionality**:

Due to Vercel's serverless architecture, traditional WebSocket servers cannot be hosted directly. To implement real-time chat features, **Ably** is integrated as a serverless WebSocket alternative. Ably facilitates real-time messaging without the need for managing dedicated WebSocket servers, ensuring seamless real-time communication within the application.

---

## Admin Accounts

The application includes predefined admin accounts for testing and administrative purposes:

1. **Existing Admin Account**:

   * **Email**: `logicbase.nazareno@gmail.com`
   * **Password**: `12345678`

2. **Auto-Admin Account**:

   * **Email**: `logicbase.king@gmail.com`
   * **Note**: This account does not exist by default. Upon registration using this email, the account will automatically be assigned admin privileges. The password chosen during registration will serve as the admin password.

## Additional Libraries and Tools

* **FullCalendar**: Integrated for interactive calendar functionalities, supporting various views like day grid and time grid, along with user interactions. This includes:

  * `@fullcalendar/react`
  * `@fullcalendar/daygrid`
  * `@fullcalendar/timegrid`
  * `@fullcalendar/interaction`&#x20;

* **@hello-pangea/dnd**: Utilized for implementing accessible and customizable drag-and-drop features within the application.&#x20;

* **@mui/material**: Employed for building a consistent and responsive user interface following Google's Material Design principles.&#x20;

* **@toolpad/core**: Used to expedite the development of admin panels and internal tools by providing a set of high-level React components.&#x20;

