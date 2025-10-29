# 🌤️ City Weather App

A full-stack TypeScript application for searching and managing cities with real-time weather data and country information.

---

## 📖 What is this?

This app lets you **search for cities**, **add new ones**, and view **live weather data** and **country info** for each city. Built with React on the frontend and Express on the backend.

---

## 🏗️ Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| **Frontend** | React 18, Vite, TailwindCSS, TanStack Query |
| **Backend**  | Express 5, Node.js 20+, TypeScript          |
| **Database** | Prisma ORM + SQLite                         |
| **APIs**     | OpenWeather (weather), RestCountries (info) |

---

## 🚀 Installation & Running

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (install: `npm install -g pnpm`)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Setup database
cd apps/server
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed        # Optional: adds sample cities
cd ../..

# 3. Add weather API key for live weather data
cp apps/server/.env.example apps/server/.env
# Edit apps/server/.env and add your API key
```

> Get a free API key at [OpenWeather](https://openweathermap.org/api)

### Run the App

```bash
# Terminal 1: Start backend (http://localhost:4000)
pnpm --filter @cityweather/server dev

# Terminal 2: Start frontend (http://localhost:5173)
pnpm --filter @cityweather/web dev
```

Open **http://localhost:5173** in your browser 🎉

---

## 📚 API Usage

### Search Cities

```bash
GET /api/cities/search?name=Paris

# Response
{
  "results": [
    {
      "id": "abc123",
      "name": "Paris",
      "country": "France",
      "touristRating": 5,
      "weather": {
        "tempC": 18.5,
        "feelsLikeC": 17.2,
        "humidity": 65,
        "description": "clear sky"
      },
      "countryInfo": {
        "cca2": "FR",
        "capital": ["Paris"],
        "region": "Europe",
        "population": 67391582
      }
    }
  ]
}
```

### Create a City

```bash
POST /api/cities
Content-Type: application/json

{
  "name": "Tokyo",
  "country": "Japan",
  "touristRating": 5
}
```

### Update a City

```bash
PATCH /api/cities/:id
Content-Type: application/json

{
  "touristRating": 4
}
```

### Delete a City

```bash
DELETE /api/cities/:id
```

## 🎨 Features

✅ Search cities by name  
✅ Add, edit, and delete cities  
✅ View live weather data (temp, humidity, conditions)  
✅ Display country info (capital, region, population)  
✅ Beautiful responsive UI with Tailwind CSS  
✅ Fast development with hot reload

---

## 📝 License

MIT License
