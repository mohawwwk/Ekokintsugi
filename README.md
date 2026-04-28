# EkoKintsugi Founding Circle - Product Lifecycle Tracking System

A structured lifecycle tracking system with QR interaction, strict rules, and admin analytics for the EkoKintsugi shoe sustainability initiative.

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js + Express.js
- SQLite (Prisma ORM)
- JWT Authentication
- QR Code generation (qrcode)
- Multer (image uploads)

## Project Structure

```
/client
  /src
    /components
    /pages
    /services
    /context
    /utils
/server
  /controllers
  /routes
  /middlewares
  /utils
  /prisma
```

## Quick Start

### 1. Server Setup

```bash
cd server
npm install
npx prisma init
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
npm run dev
```

Server runs on http://localhost:5000

### 2. Client Setup

```bash
cd client
npm install
npm run dev
```

Client runs on http://localhost:5173

## Demo Flow

### 1. Admin Creates Users

1. Navigate to http://localhost:5173
2. Sign up as admin (first user with admin role)
3. Go to Admin Dashboard → Users
4. Create new users (max 10 users enforced)

### 2. User Logs In

1. User navigates to http://localhost:5173
2. Logs in with credentials
3. Views personal dashboard with:
   - Shoe details
   - Tree info
   - Points balance
   - Review progress (X/8)

### 3. QR Scan Opens Dashboard

1. Admin or user visits `/qr/:userId`
2. QR code is displayed (mobile responsive)
3. Scanning opens user's public dashboard
4. No login required to view QR page

### 4. Submit Weekly Review

1. User clicks "Submit Review"
2. Selects week number (1-8)
3. Fills out feedback form:
   - Days worn
   - Hours per day
   - Comfort rating
   - Fit rating
   - Sole rating
   - Material rating
   - Stitching rating
   - Overall feedback
4. Uploads optional image
5. Submits (only 1 review per week, max 8 total)

### 5. Request Return

1. User clicks "Request Return"
2. Selects shoe condition (Good/Fair/Damaged)
3. Provides return reason
4. Submit request
5. Admin reviews and updates status

### 6. Admin Completes Lifecycle

1. Admin views all returns in Admin → Returns
2. Updates return status:
   - Requested → Approved → Received → Completed
3. Assigns final action:
   - Repair
   - Reuse
   - Recycle
4. Manages points:
   - Add points to users
   - Redeem points

## Business Rules

- **Max 10 users** total (enforced in backend)
- **Max 8 reviews** per user
- **Only 1 review** per week (week 1-8)
- **Interns** must complete all reviews and return

## API Endpoints

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### User
- `GET /user/me` - Get current user profile

### Admin
- `POST /admin/create-user` - Create new user (max 10)
- `GET /admin/users` - Get all users

### Reviews
- `POST /reviews` - Submit weekly review
- `GET /reviews/:userId` - Get user's reviews

### Returns
- `POST /return/request` - Request return
- `PUT /return/update/:id` - Update return status

### Points
- `POST /points/add` - Add points to user
- `PUT /points/redeem` - Redeem points

### QR
- `GET /qr/:userId` - Get QR code for user

## Roles

- **admin** - Full system access
- **intern** - Must complete all reviews and return
- **team** - Regular user access
- **supporter** - Basic access

## Environment Variables

### Server (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000
```

## Database Models

### User
- id, name, phone, email, password, role, city, address, shoeSize
- startDate, endDate, qrCode, pointsTotal, pointsUsed, pointsRemaining
- Relations: shoe, tree, reviews, returns

### Shoe
- shoeId (unique), productLine, size, status (PreBooked/Delivered/Returned)

### Tree
- treeId, plantType, location, status ("Symbolic Tree Parent")

### Review
- weekNumber, daysWorn, hoursPerDay, comfort, fit, sole, material, stitching, feedback, image
- Constraint: unique(userId, weekNumber)

### Return
- reason, condition (Good/Fair/Damaged), status (Requested/Approved/Received/Completed)
- finalAction (Repair/Reuse/Recycle)

## Seed Data

The seed script creates:
- 10 users with various roles
- 10 shoes (1 per user)
- 10 trees (1 per user)

Run with: `node prisma/seed.js`

## Features

### User Features
- Login/Signup
- Dashboard with shoe, tree, points, review progress
- Weekly review submission (image upload)
- Return request

### Admin Features
- User management (create, view)
- Review tracking (weeks 1-8)
- Return management (approve, update status, final action)
- Points management (add, redeem)

### UI Features
- Tailwind CSS mobile-first design
- Dashboard cards
- Progress bar for reviews
- Status badges
- Mobile responsive QR code display
