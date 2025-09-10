# 🚌 Smartify Bus Booking System

A modern, full-stack bus booking application built with Next.js, featuring real-time tracking, secure payments, and comprehensive admin management.

**🌐 Live Demo:** [https://bus-booking-swart.vercel.app/](bus-booking-swart.vercel.app)

## ✨ Features

### 🎯 User Features
- **Easy Bus Booking**: Intuitive interface for booking bus tickets
- **Real-time Tracking**: Live bus tracking with updates
- **Secure Payments**: UPI and QR code payment integration
- **Seat Selection**: Interactive seat selection with visual representation
- **Booking Management**: View and manage your bookings
- **User Dashboard**: Personalized dashboard with booking history
- **Responsive Design**: Mobile-first design for all devices

### 🔧 Admin Features
- **Comprehensive Dashboard**: Analytics and overview of all operations
- **Booking Management**: Approve, reject, and manage all bookings
- **Bus Management**: Add, edit, and manage bus routes and schedules
- **User Management**: Manage user accounts and roles
- **City Management**: Add and manage cities and routes
- **Analytics**: Detailed insights and reports
- **Recommendations**: Add and manage travel recommendations

### 🛡️ Security Features
- **JWT Authentication**: Secure user authentication
- **Role-based Access**: Admin and user role management
- **Encrypted Passwords**: bcrypt password hashing
- **Secure API**: Protected API endpoints

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Server-side API
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
busbooking3/
├── app/
│   ├── admin/                 # Admin panel pages
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── bookings/          # Booking management
│   │   ├── buses/            # Bus management
│   │   ├── cities/           # City management
│   │   ├── pending-bookings/ # Pending bookings
│   │   ├── recommendations/  # Recommendations
│   │   └── users/            # User management
│   ├── api/                  # API routes
│   │   ├── models/           # MongoDB models
│   │   ├── auth/             # Authentication endpoints
│   │   ├── bookings/         # Booking endpoints
│   │   ├── buses/            # Bus endpoints
│   │   ├── cities/           # City endpoints
│   │   ├── payment/          # Payment endpoints
│   │   └── users/            # User endpoints
│   ├── components/           # Reusable components
│   │   ├── ui/               # UI components
│   │   ├── AdminLayout.tsx   # Admin layout
│   │   ├── AdminBookingManager.tsx
│   │   ├── BusAdminManager.tsx
│   │   ├── CityAdminManager.tsx
│   │   └── SeatSelector.tsx
│   ├── dashboard/            # User dashboard
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── bookings/             # Booking pages
│   └── profile/              # User profile
├── lib/                      # Utility functions
├── public/                   # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd busbooking3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Models

### User Model
```typescript
{
  email: string (required, unique)
  password: string (required)
  role: string (default: 'user')
  name: string
  age: number
  course: string
  college: string
}
```

### Bus Model
```typescript
{
  name: string (required)
  number: string (required, unique)
  capacity: number (required)
  type: string (required)
  status: string (default: 'active')
  routeFrom: string (required)
  routeTo: string (required)
  date: string (required)
  contactNumber: string
  timing: string
  price: number (default: 0)
}
```

### Booking Model
```typescript
{
  exam: string (required)
  city: string (required)
  date: string (required)
  bus: string (required)
  busNumber: string
  userId: string (required)
  seatNumbers: string[] (required)
  routeFrom: string
  routeTo: string
  contactNumber: string
  timing: string
  upiScreenshot: string
  upiTxnId: string
  status: string (default: 'confirmed')
  price: number (default: 0)
  createdAt: Date (default: now)
}
```

## 🎨 UI/UX Features

### Design System
- **Light Theme**: Clean, modern light theme with blue/purple gradients
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Card-based Layout**: Modern card components for better organization
- **Interactive Elements**: Hover effects and smooth animations
- **Status Badges**: Color-coded status indicators
- **Form Validation**: Real-time form validation and error handling

### Color Palette
- **Primary**: Blue gradients (#2563eb to #6366f1)
- **Secondary**: Purple accents (#8b5cf6 to #a855f7)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Background**: Light blue gradients (#f0f9ff to #e0e7ff)

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can book buses, view bookings, manage profile
- **Admin**: Full access to all admin features and user management

### Security Features
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Role-based access control
- Session management

## 💳 Payment Integration

### Payment Methods
- **UPI Payments**: Direct UPI transfers
- **QR Code Payments**: Scan and pay functionality
- **Transaction Tracking**: Payment status monitoring
- **Receipt Generation**: PDF receipts for bookings

### Payment Flow
1. User selects seats and confirms booking
2. Payment amount is calculated
3. UPI/QR payment options are displayed
4. User completes payment
5. Booking is confirmed upon payment verification

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile Devices**: Touch-friendly interface
- **Tablets**: Optimized layouts for medium screens
- **Desktop**: Full-featured desktop experience
- **Large Screens**: Enhanced layouts for wide displays

## 🚀 Deployment

### Vercel Deployment
The application is deployed on Vercel with the following configuration:

1. **Build Command**: `npm run build`
2. **Output Directory**: `.next`
3. **Node.js Version**: 18.x
4. **Environment Variables**: Configured in Vercel dashboard

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📈 Performance Features

- **Next.js Optimization**: Built-in performance optimizations
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting for better loading
- **Caching**: Efficient caching strategies
- **SEO Optimization**: Meta tags and structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



**Made with ❤️ by the Smartify Team**
