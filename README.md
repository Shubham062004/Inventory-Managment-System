
# Grocery Store Management System

A complete grocery store management system with inventory tracking, product management, and customer ordering capabilities.

## Project Overview

This project is a full-featured grocery store application that includes:

- Customer-facing storefront with product browsing and cart functionality
- Inventory management system for tracking stock levels
- Product management for adding new products to the catalog
- Mobile-responsive design for all device types

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router for navigation
- Tanstack Query for data fetching
- Framer Motion for animations
- Lucide React for icons
- Recharts for data visualization

### Backend Options
This project is currently implemented with a frontend-only approach using mock data. For a production environment, we recommend integrating with Supabase, which provides:

- PostgreSQL database
- Authentication
- Storage
- Serverless functions
- Realtime subscriptions

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
```sh
git clone <repository-url>
cd grocery-store-app
```

2. Install dependencies
```sh
npm install
# or
yarn install
```

3. Start the development server
```sh
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Supabase Integration (Optional)

To add backend functionality:

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project and note your project URL and anon key
3. Install Supabase client:
```sh
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

4. Create a `.env` file in the project root with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Create a Supabase client file (e.g., `src/lib/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Project Structure

The project is organized as follows:

- `/src` - Source code for the application
  - `/components` - Reusable UI components
    - `/cart` - Shopping cart components
    - `/home` - Homepage components
    - `/inventory` - Components for inventory management
    - `/layout` - Layout components (Header, Footer)
    - `/ui` - Base UI components from shadcn/ui
  - `/context` - React context providers
    - `CartContext.tsx` - Shopping cart state management
  - `/data` - Static data and mock API responses
    - `products.ts` - Sample product data
  - `/hooks` - Custom React hooks
    - `use-inventory.ts` - Inventory management hook
    - `use-mobile.tsx` - Responsive design hook
    - `use-toast.ts` - Toast notifications hook
  - `/lib` - Utility functions
    - `utils.ts` - General utility functions
  - `/pages` - Page components
    - `Cart.tsx` - Shopping cart page
    - `CustomerSupport.tsx` - Customer support page
    - `Index.tsx` - Homepage
    - `Inventory.tsx` - Inventory management page
    - `Login.tsx` - User login page
    - `Manager.tsx` - Store manager dashboard
    - `Menu.tsx` - Product catalog page
    - `NotFound.tsx` - 404 page
    - `Signup.tsx` - User registration page
  - `/types` - TypeScript type definitions
    - `inventory.ts` - Inventory related types
  - `/utils` - Utility functions
    - `scrollAnimation.ts` - Scroll reveal animations

## Features

### Customer Features

- Browse products by category
- Search products
- Add products to cart
- View and modify cart
- User registration and login

### Manager Features

- View inventory summary
- Track low stock items
- Update stock levels
- Add new products to the catalog
- Inventory filtering and sorting

## Database Schema (for Supabase implementation)

Here's a recommended schema for your Supabase database:

**Products Table**
- id (uuid, primary key)
- name (text)
- description (text)
- price (decimal)
- category (text)
- image_url (text)
- unit (text)
- created_at (timestamp)

**Inventory Table**
- id (uuid, primary key)
- product_id (uuid, foreign key)
- current_stock (integer)
- min_stock_level (integer)
- max_stock_level (integer)
- last_restocked (timestamp)
- cost_price (decimal)

**Users Table**
- id (uuid, primary key)
- email (text)
- name (text)
- role (text) - 'customer' or 'admin'
- phone (text, optional)

**Orders Table**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- status (text)
- total (decimal)
- created_at (timestamp)

**OrderItems Table**
- id (uuid, primary key)
- order_id (uuid, foreign key)
- product_id (uuid, foreign key)
- quantity (integer)
- price (decimal)

## Deployment

This application can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

## License

[MIT](LICENSE)
