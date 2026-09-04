# 1Fi EMI Product Catalog

A full-stack smartphone catalog for buying products through EMI plans backed by mutual funds. Product names, variants, prices, images, EMI plans, ratings, seller details, and delivery information are loaded at runtime from MongoDB through the Express API.

The frontend contains no product catalog records. `backend/src/catalog.json` is only the initial seed fixture used to populate MongoDB.

## Features

- API-driven product listing and product detail pages
- Unique product URLs such as `/products/iphone-17-pro`
- Selectable product variants and EMI plans
- EMI monthly amount, tenure, interest rate, and cashback display
- 1Fi-inspired responsive navigation and marketplace UI
- Checkout page at `/checkout` with contact, delivery, payment, and order summary sections

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express, CORS |
| Database | MongoDB with Mongoose |

## Project Structure

```text
1fi-emi-app/
├── backend/
│   ├── src/
│   │   ├── catalog.json           # Initial catalog data fixture
│   │   ├── db.js                  # MongoDB connection
│   │   ├── models/Product.js      # Product, variant, and EMI schemas
│   │   ├── seed.js                # Generic fixture importer and EMI generator
│   │   └── server.js              # Express API and serializers
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api.js                 # API client
│   │   ├── components/Navbar.jsx  # Shared 1Fi navigation
│   │   ├── pages/
│   │   │   ├── Checkout.jsx       # Checkout form and order summary
│   │   │   ├── ProductDetail.jsx  # Product, variant, and EMI selection
│   │   │   └── ProductList.jsx    # Product catalog grid
│   │   └── utils/format.js
│   └── package.json
└── README.md
```

## Data Flow

```text
catalog.json --npm run seed--> MongoDB
MongoDB --Mongoose--> Express REST API
Express API --fetch()--> React product pages
```

At runtime, React never imports `catalog.json`; it requests product data from the backend API.

## Setup

### Prerequisites

- Node.js and npm
- A running MongoDB instance, locally or through MongoDB Atlas

The default local connection is:

```text
mongodb://127.0.0.1:27017/1fi_emi_db
```

To use another database, create `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/1fi_emi_db
PORT=4000
```

### Start the backend

```bash
cd backend
npm install
npm run seed
npm start
```

`npm run seed` clears the current `products` collection and imports records from `src/catalog.json`. It also generates the EMI ladder for every variant. Run it whenever the fixture changes.

The API starts at `http://localhost:4000`.

For development with automatic restart:

```bash
npm run dev
```

### Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:4000` for API requests. To configure another backend, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Application Flow

1. The homepage fetches product summaries from `/api/products`.
2. Selecting a product opens `/products/:slug`.
3. The detail page fetches the complete product from `/api/products/:slug`.
4. The user selects a variant and EMI plan.
5. Clicking **Buy on EMI** opens `/checkout` and passes the selected API data to checkout.
6. Checkout displays the product image, selected variant, price, cashback, monthly EMI, tenure, and interest rate.

The checkout is currently a frontend demo flow. The form and **Place order** button do not submit an order to a backend endpoint yet.

## API Endpoints

### `GET /api/products`

Returns all products with their default variant for the listing page. Product responses include catalog and merchandising fields such as `name`, `brand`, `soldCount`, `rating`, `sellerName`, `dispatchMessage`, `deliveryMessage`, and `replacementMessage`.

### `GET /api/products/:slug`

Returns the complete product, including every variant and its EMI plans.

A variant includes:

```json
{
  "variantLabel": "256GB / Silver",
  "color": "Silver",
  "storage": "256GB",
  "mrp": 134900,
  "price": 127400,
  "discount": 7500,
  "imageUrl": "https://...",
  "isDefault": true,
  "emiPlans": [
    {
      "id": "...",
      "tenureMonths": 3,
      "monthlyAmount": 42467,
      "interestRate": 0,
      "cashbackAmount": 7500
    }
  ]
}
```

Unknown product slugs return HTTP 404 with an error message.

### `GET /api/health`

Returns the backend health status:

```json
{ "status": "ok", "timestamp": "2026-09-03T00:00:00.000Z" }
```

## Database Model

Products use embedded documents because a product detail request needs its variants and EMI plans together:

```text
products
└── product
    ├── variants[]
    │   └── emiPlans[]
    └── merchandising and fulfillment fields
```

The current fixture contains:

- iPhone 17 Pro: 3 variants
- Samsung Galaxy S24 Ultra: 3 variants
- OnePlus 13: 2 variants

Seven EMI plans are generated for each variant: 3, 6, 12, 24, 36, 48, and 60 months. Shorter plans use 0% interest; longer plans use the configured 10.5% rate.

## Assignment Requirements

- [x] Dynamic product page with name, variant, MRP, price, and image
- [x] Selectable EMI plans with monthly amount, tenure, interest rate, and cashback
- [x] Button to proceed with the selected plan
- [x] Data loaded from a backend API connected to MongoDB
- [x] No product catalog records hardcoded in the frontend
- [x] Unique URL for every product
- [x] At least three products with at least two variants each
- [x] Checkout page after selecting an EMI plan

## Validation

Run frontend checks from `frontend/`:

```bash
npm run build
npm run lint
```

Run backend syntax checks from `backend/`:

```bash
node --check src/server.js
node --check src/seed.js
```

## Deployment Notes

- Use MongoDB Atlas or another managed MongoDB provider.
- Set `MONGODB_URI` and `PORT` in the backend environment.
- Run `npm run seed` once to import the initial catalog fixture.
- Set `VITE_API_BASE_URL` before building the frontend.
- The checkout route currently carries its selected order in React Router state. A production checkout should persist the cart/order server-side and integrate an actual payment or EMI provider.
