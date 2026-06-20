# 💰 FinanceTracker — Personal Money Manager

A modern, real-time Finance Tracker built with **React + Tailwind CSS + Firebase Firestore**.  
Logs credits (income) and debits (expenses) with live sync across all connected devices.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Real-time sync** | Firebase `onSnapshot` — updates instantly on any client |
| **Dark / Light mode** | Persists across sessions via localStorage |
| **Metric Cards** | Balance, Total Income, Total Expenses with color coding |
| **Transaction Logger** | Modal form: Amount, Type, Category, Date, Note |
| **Transaction History** | Paginated list with search, filter, and delete |
| **Analytics** | Bar chart (monthly trend) + Pie chart (spending by category) |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## 🗂 Project Structure

```
finance-tracker/
├── src/
│   ├── config/
│   │   └── firebase.js          # Firebase SDK init — PUT YOUR CREDENTIALS HERE
│   ├── context/
│   │   └── ThemeContext.jsx     # Dark/light mode provider
│   ├── hooks/
│   │   └── useTransactions.js  # onSnapshot real-time hook + CRUD
│   ├── utils/
│   │   └── helpers.js          # Categories, colors, formatters, chart utils
│   ├── components/
│   │   ├── Header.jsx           # Sticky navbar + theme toggle + Add button
│   │   ├── MetricCards.jsx      # 3 summary cards
│   │   ├── TransactionForm.jsx  # Add transaction modal
│   │   ├── TransactionList.jsx  # Paginated history with search & filter
│   │   ├── Charts.jsx           # Recharts bar + pie
│   │   └── Dashboard.jsx        # Root layout, tab navigation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── package.json
└── firestore.rules
```

---

## 🚀 Setup Guide

### Step 1 — Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → name it (e.g. `finance-tracker`)
3. Skip Google Analytics if not needed → **Create project**
4. Click **Web** (</>) to add a web app → register it
5. Copy the `firebaseConfig` object shown

### Step 2 — Enable Firestore

1. In Firebase Console → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (or production + deploy `firestore.rules`)
4. Select a region close to you → **Done**

### Step 3 — Paste Credentials

Open `src/config/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← your values here
  authDomain: "my-app.firebaseapp.com",
  projectId: "my-app",
  storageBucket: "my-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

### Step 4 — Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### Step 5 — Deploy (optional)

```bash
npm run build
# then deploy /dist to Firebase Hosting, Vercel, or Netlify
```

---

## 📱 Android Cross-Device Sync

Since both web and Android use the **same Firestore collection** (`transactions`), any write from an Android app using the Firebase Android SDK will instantly appear in this web UI via the `onSnapshot` listener — no polling, no page refresh.

Ensure your Android app writes to the same `projectId` with the same document schema:
```
{
  amount: Number,
  type: "credit" | "debit",
  category: String,
  date: Timestamp,
  note: String,
  createdAt: Timestamp
}
```

---

## 🔒 Security (Production)

For a personal app, add Firebase Authentication and restrict Firestore rules:

```js
// firestore.rules
allow read, write: if request.auth != null && request.auth.uid == "YOUR_UID";
```

Deploy rules: `firebase deploy --only firestore:rules`

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Tailwind CSS 3** — utility-first styling
- **Firebase v10** — Firestore real-time database
- **Recharts** — Bar and Pie charts
- **Vite** — build tool

---

## 🎨 Customisation

- **Currency**: Change `formatINR` in `utils/helpers.js` to your currency
- **Categories**: Edit the `CATEGORIES` array in `utils/helpers.js`
- **Page size**: Change `PAGE_SIZE` in `TransactionList.jsx`
- **Color palette**: Edit `CATEGORY_COLORS` in `utils/helpers.js`
