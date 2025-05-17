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
   git clone https://github.com/rmv-coder/logicbase_command.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   * Create a `.env` file in the root directory.
   * Set up the necessary environment variables as per your configuration.

4. **Set up the MySQL database**:

   * Use the provided `database_structure.sql` file to initialize the database schema.

5. **Build the project**:

   ```bash
   npm run build
   ```

6. **Start the development server**:

   ```bash
   npm run start
   ```

7. **Access the application**:

   * Open your browser and navigate to `http://localhost:3000`.

---

## API Documentation

The Logicbase_Command application provides a RESTful API for interacting with the system. Below is the documentation for available endpoints.

### Authentication

#### Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }
  ```
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: 
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name"
      }
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**: `{ "error": "Email already in use" }`

#### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user and receive a session token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name",
        "role": "user"
      },
      "token": "jwt_token"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "error": "Invalid credentials" }`

#### Logout

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: End the current user session
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: `{ "message": "Logged out successfully" }`

### User Management

#### Get User Profile

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Description**: Retrieve the current user's profile information
- **Authentication**: Required
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00Z"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**: `{ "error": "Not authenticated" }`

#### Update User Profile

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Description**: Update the current user's profile information
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "message": "Profile updated successfully",
      "user": {
        "id": "user_id",
        "email": "updated@example.com",
        "name": "Updated Name"
      }
    }
    ```

### Chat API

#### Get Chat Channels

- **URL**: `/api/chat/channels`
- **Method**: `GET`
- **Description**: Retrieve available chat channels for the current user
- **Authentication**: Required
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "channels": [
        {
          "id": "channel_id",
          "name": "General",
          "description": "General discussion channel",
          "createdAt": "2023-01-01T00:00:00Z"
        }
      ]
    }
    ```

#### Send Message

- **URL**: `/api/chat/messages`
- **Method**: `POST`
- **Description**: Send a new message to a chat channel
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "channelId": "channel_id",
    "content": "Hello, world!"
  }
  ```
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: 
    ```json
    {
      "message": {
        "id": "message_id",
        "content": "Hello, world!",
        "userId": "user_id",
        "channelId": "channel_id",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    }
    ```

### Calendar API

#### Get Events

- **URL**: `/api/calendar/events`
- **Method**: `GET`
- **Description**: Retrieve calendar events for the current user
- **Authentication**: Required
- **Query Parameters**:
  - `start`: Start date (ISO format)
  - `end`: End date (ISO format)
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "events": [
        {
          "id": "event_id",
          "title": "Team Meeting",
          "start": "2023-01-01T10:00:00Z",
          "end": "2023-01-01T11:00:00Z",
          "description": "Weekly team sync",
          "location": "Conference Room A"
        }
      ]
    }
    ```

#### Create Event

- **URL**: `/api/calendar/events`
- **Method**: `POST`
- **Description**: Create a new calendar event
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "Project Kickoff",
    "start": "2023-01-15T09:00:00Z",
    "end": "2023-01-15T10:30:00Z",
    "description": "Initial project planning meeting",
    "location": "Virtual"
  }
  ```
- **Success Response**: 
  - **Code**: 201 Created
  - **Content**: 
    ```json
    {
      "message": "Event created successfully",
      "event": {
        "id": "event_id",
        "title": "Project Kickoff",
        "start": "2023-01-15T09:00:00Z",
        "end": "2023-01-15T10:30:00Z",
        "description": "Initial project planning meeting",
        "location": "Virtual"
      }
    }
    ```

### Admin API

#### Get All Users (Admin Only)

- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Description**: Retrieve a list of all users (admin access required)
- **Authentication**: Required (Admin role)
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "users": [
        {
          "id": "user_id",
          "email": "user@example.com",
          "name": "User Name",
          "role": "user",
          "createdAt": "2023-01-01T00:00:00Z"
        }
      ]
    }
    ```
- **Error Response**:
  - **Code**: 403 Forbidden
  - **Content**: `{ "error": "Admin access required" }`

#### Update User Role (Admin Only)

- **URL**: `/api/admin/users/:userId/role`
- **Method**: `PUT`
- **Description**: Update a user's role (admin access required)
- **Authentication**: Required (Admin role)
- **Request Body**:
  ```json
  {
    "role": "admin"
  }
  ```
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "message": "User role updated successfully",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name",
        "role": "admin"
      }
    }
    ```

### Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Resource created
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Resource not found
- `500`: Server error

### API Rate Limiting

To ensure system stability, API requests are rate-limited to 100 requests per minute per user. Exceeding this limit will result in a `429 Too Many Requests` response.


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

