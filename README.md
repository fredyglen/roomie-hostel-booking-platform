# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f65efd03-c149-45fe-a22f-28d972fbc346

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f65efd03-c149-45fe-a22f-28d972fbc346) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f65efd03-c149-45fe-a22f-28d972fbc346) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Environment Variables

Copy `.env.example` to `.env` and fill in all required values for your environment.

### Required Variables
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- PAYSTACK_PUBLIC_KEY
- PAYSTACK_SECRET_KEY
- PAYSTACK_BASE_URL
- APP_BASE_URL
- IMAGE_CDN_URL (optional)
- DEFAULT_PAGE_SIZE
- MAX_PAGE_SIZE
- PLATFORM_COMMISSION_RATE
- AGENT_COMMISSION_RATE
- AGENT_MINIMUM_FEE
- PAYSTACK_FEE_RATE
- BOOKING_FEE_RATE
- MAX_IMAGE_SIZE

### Deployment Notes
- Ensure all required environment variables are set in your deployment pipeline (Vercel, Netlify, Docker, etc.).
- For CI/CD, add these variables to your environment configuration panel or secrets manager.
- The app will throw an error on startup if any required variable is missing.
