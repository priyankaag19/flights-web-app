# ✈️ Google Flights Clone

A React-based flight search application that fetches real-time flight and airport data using the RapidAPI Flights API. Users can search flights, view results, filter/sort them, and see trip details.

---

## 🚀 Features

* 🌍 Real-time airport autocomplete and suggestions
* 🛫 Search round-trip, one-way flights
* 💰 Filter flights by price, sort by price/duration/departure
* 🧳 View detailed flight info like airline, times, stops
* 🔁 Swap origin/destination airports
* 💾 Persist selections using React Context
* 📱 Responsive and accessible UI (Material UI)

---

## 📂 Project Structure

```
src/
├── assets/             # Static images & icons
├── components/         # Reusable UI & flight-specific components
│   ├── flight/         # Flight search & results UI
│   └── layout/         # Layout wrappers
├── context/            # Flight context (global state)
├── hooks/              # Custom React hooks (useFlights, useAirports)
├── pages/              # Route-level pages (Home, Booking, Trips)
├── services/           # API wrapper services (FlightService)
├── theme/              # MUI theme setup
├── App.jsx             # Main app routing and layout
└── main.jsx            # App entry point
```

---

## 🧑‍💻 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/google-flights-clone.git
   cd google-flights-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root:

   ```
   VITE_RAPIDAPI_KEY=your_rapidapi_key
   ```

   Replace `your_rapidapi_key` with your actual key from [RapidAPI](https://rapidapi.com/skyscanner/api/skyscanner-flight-search).

4. **Run the app**

   ```bash
   npm run dev
   ```

---

🔌 API Usage
The project integrates with the Flights Sky API via RapidAPI to fetch live data. The following endpoints are primarily used:

Endpoint	Description
GET /flights/auto-complete	🔍 Provides real-time airport suggestions for the "From" and "To" fields based on user input.
GET /flights/airports	🗺️ Fetches a list of airports (used for fallback or popular airport display).
GET /flights/search-roundtrip	🔁 Main endpoint to fetch round-trip flight results based on user input (origin, destination, dates, passengers, class).
GET /flights/search-one-way	➡️ Used for one-way flights (currently reserved for future support).
GET /flights/detail	📄 (Optional) Retrieves detailed info for a selected flight (not actively used, but can be added for booking flow).

---

## 📦 Dependencies

* **React 19**
* **Vite**
* **Material UI**
* **Lucide React Icons**
* **RapidAPI Flights API--Flights Scraper Sky**
* **Axios**

---

## 🧪 Development

* ✅ All state and data flow is managed through `FlightContext`
* ✨ Use `useFlights.js` for searching and transforming API responses
* 📡 Real-time autocomplete and popular routes powered by `useAirports.js`

---
