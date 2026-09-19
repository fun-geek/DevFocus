# DevFocus

> A lightweight focus-tracking and distraction logging web application for students and developers.

DevFocus helps users track focused work sessions and understand what causes them to lose concentration.

Instead of being only a Pomodoro timer, DevFocus records interruptions such as phone usage, social media, messages, noise, breaks, and tiredness. The collected data is stored in MySQL and can later be used for personal productivity analytics.

---

## 🚀 Features

### Focus Sessions
- Start a focused work session
- Track session duration
- End a session
- Store session information in MySQL

### Distraction Logging
Users can record why they lost focus:

- 📱 Phone
- 🔊 Noise
- 📱 Social Media
- 💬 Message
- ☕ Break
- 😴 Tired
- Other

Each interruption is associated with the active focus session.

### Database Storage
DevFocus uses MySQL to store:

- Users
- Focus sessions
- Interruption logs

### Productivity Analytics
The project is designed to support analytics such as:

- Total focus time
- Number of focus sessions
- Number of interruptions
- Most common distraction
- Daily focus activity

### Scalability & Load Testing

A major goal of DevFocus is to study how the application behaves as the number of concurrent users increases.

Future testing will measure:

- Concurrent users
- Requests per second
- Database queries
- Average response time
- CPU usage
- Memory usage
- Error rate

---

# 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL
- MySQL Workbench

### Development

- Visual Studio Code
- Git
- GitHub

---

# 📁 Project Structure

```text
DevFocus/
│
├── backend/
│   ├── routes/
│   │   ├── interruptionRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── db.js
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
