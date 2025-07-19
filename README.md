This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Konfigurasi Database dengan neon Postgres
1. Buka [Vercel](https://vercel.com/) dan buat project dengan import repo kelolahub
2. Deploy dan buat database pada storage menggunakan neon postgres, beri nama database misal kelolahub-db
3. Copy source code .env.local ke file .env project kelolahub
4. Project kelolahub menggunakan prisma sebagai orm maka instal dan inisialisasikan prisma
   ```bash
   pnpm add -D prisma
   pnpm add @prisma/client
   pnpm dlx prisma init --datasource-provider postgresql
   ```
5. Migrasi skema prisma yang telah ada pada kelolahub dan generate prisma client saat setelah mengubah skema dan menjalankan migrasi
   ```bash
   pnpm dlx prisma migrate dev --name init-tasks-table
   pnpm dlx prisma generate
   ```
6. Kelolahub siap dijalankan
