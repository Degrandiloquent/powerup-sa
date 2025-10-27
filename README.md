# ⚡ PowerUp SA - Load Shedding Assistant

**FNB App of the Year Hackathon 2025**

PowerUp SA is a real-time load shedding assistant app that helps South Africans stay ahead of power outages with personalized schedules, notifications, and community features.

---

## 🌐 Live Demo

**🚀 [Launch App](https://powerup-sa.vercel.app/)**

The app is live and accessible to everyone - no login required!

---

## ✨ Features

- ⚡ **Real-time Load Shedding Status** - Current stage and upcoming changes
- 📍 **Area-specific Schedules** - Search and view schedules for your suburb
- ⭐ **Save Favorites** - Quick access to frequently checked locations
- 🔔 **Push Notifications** - Get alerts before outages
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🎨 **Modern UI** - Beautiful, intuitive interface

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling (via CDN)
- **Lucide React** - Icons
- **Axios** - API calls
- **Vercel** - Deployment

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **EskomSePush API** - Load shedding data
- **Render** - Deployment

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/Degrandiloquent/powerup-sa.git
   cd powerup-sa
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
```
   REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
   npm start
```

   The app will open at `http://localhost:3000`

---

## 🖥️ Backend Setup

The backend is in a separate repository for deployment flexibility.

**Backend Repository:** [powerup-sa-backend](https://github.com/Degrandiloquent/powerup-sa-backend)

### Running Backend Locally

1. Clone the backend repo
```bash
   git clone https://github.com/Degrandiloquent/powerup-sa-backend.git
   cd powerup-sa-backend
```

2. Install dependencies
```bash
   npm install
```

3. Create `.env` file
```
   ESKOM_API_KEY=your_api_key_here
   PORT=5000
```

4. Start the server
```bash
   npm start
```

---

## 📦 Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Render)
- Push to GitHub
- Connect repository on Render
- Add environment variables
- Deploy

---

## 🎯 How It Works

1. **Search** for your area or suburb
2. **View** your personalized load shedding schedule
3. **Save** frequently checked locations as favorites
4. **Enable** notifications for power outage alerts
5. **Stay informed** with real-time status updates

---

## 👥 Team

**ByteStorm** - FNB Hackathon 2025

- Built with ❤️ for South Africans
- Helping communities stay powered up 💡

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **EskomSePush** for providing the load shedding API
- **FNB** for hosting the hackathon
- **South African communities** dealing with load shedding daily

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the [live app](https://powerup-sa.vercel.app/)

---

**⚡ Stay Powered Up!**
