# CloudMedia SaaS 🚀

CloudMedia is a premium, full-stack media optimization and processing platform designed to compress videos, generate smart focal-point previews, and resize images for popular social media formats using AI-powered gravity detection.

It delivers a streamlined user experience combined with advanced media processing pipelines to reduce file sizes and optimize load times.

## 🌟 Key Features

* **Intelligent Video Compression:** Upload videos up to 70MB. CloudMedia automatically compresses, optimizes quality, and transcodes them into standard web-compatible `.mp4` formats.
* **On-Hover Previews:** Videos in the dashboard generate a dynamic 15-second thumbnail preview on hover.
* **Focal-Point Smart Cropping:** Upload images and crop them to standard social formats (Instagram Square, Twitter Landscape, Facebook Cover, etc.) utilizing Cloudinary's AI gravity detection to ensure the subject remains centered.
* **Comprehensive Storage Metrics:** View real-time statistics of total media uploaded, total bandwidth/storage saved in megabytes, and average compression percentages across your account.
* **Secure Multi-Tenant Auth:** Fully protected page shells and API routes enforced via Clerk authentication.
* **Modern App Shell:** Clean, responsive, glassmorphic layout featuring light/dark mode compliance, active navigation indicators, and desktop/mobile slide-out drawer navigation.

## 🛠️ Tech Stack

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) & React 19
* **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [DaisyUI v5](https://daisyui.com/), & [Lucide Icons](https://lucide.dev/)
* **Media Handling:** [Cloudinary API](https://cloudinary.com/) & [Next Cloudinary](https://next.cloudinary.dev/)
* **Authentication:** [Clerk Auth](https://clerk.com/)
* **Database & ORM:** PostgreSQL & [Prisma ORM](https://www.prisma.io/)
* **State & Networking:** Axios & React Hooks

---

## 🏗️ System Architecture & Design Patterns

1. **Prisma Client Singleton:** Avoids connection pool exhaustion in development by caching the client instance globally across Next.js hot-reloads.
2. **On-Demand User Syncing:** Automatically verifies and syncs Clerk users to the Postgres relational database on media actions (e.g., video uploads).
3. **Responsive App Layout:** Features a unified App Shell structure (`app/(app)/layout.tsx`) that handles active page routing and responsive mobile drawers.

---

## 🚀 Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/NiketDevS/cloudinary-saas.git
cd cloudinary-saas
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Initialize the Database

Apply the database migrations and generate the Prisma Client:

```bash
npx prisma migrate dev --name init
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
