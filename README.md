# Notes Frontend

This project is a **notes management frontend** built with **Next.js**, inspired by the iOS26 Liquid Glass design aesthetic. It focuses on **glassmorphism**, smooth animations, and responsive design.

## Tech Stack & Libraries

- **Next.js** – React framework for server-side rendering and routing.
- **React 18** – Core library for building UI components.
- **Framer Motion** – For smooth animations and hover effects.
- **Tailwind CSS** – Utility-first CSS framework for styling and responsive design.
- **Next Navigation** – `useRouter` & `usePathname` for client-side routing.
- **LocalStorage** – Storing user role and session info.
- **Custom API Integration** – Auth, notes, users, and profile endpoints.
- **Glassmorphism Design** – Frosted glass UI elements for modern aesthetics.

## What I Have Done

- Implemented **role-based navigation** with dynamic tabs for admin and general users.
- Developed **dashboards** tailored for admin and regular users.
- Built **user profile management pages**.
- Created **notes management pages** with UI components for listing, creating, and editing notes.
- Integrated **API calls** for authentication, user data, notes, and user management.
- Used endpoints such as `/api/auth/login`, `/api/users`, `/api/notes`, and `/api/profile` for backend communication.
- Fixed **navbar hooks issue** and ensured role-based tabs render **without flicker**.
- Added **animated dropdowns** and smooth hover effects with Framer Motion.

## Features

- Role-based access control and dynamic navigation.
- User authentication and profile management.
- Notes creation, editing, and listing.
- Admin user management.
- **Responsive and visually appealing UI** with glassmorphic styling and animations.
- Stable and **bug-free hook usage** to prevent React rendering errors.

## Usage Tips

- **Testing User Roles**:
  - To test **admin view**, set `role` in `localStorage` to `"admin"` before logging in.
  - To test **regular user view**, set `role` in `localStorage` to `"user"` or leave it empty.
- The navbar will **dynamically render tabs** based on the role:
  - Admin: `Notes`, `Users`, `Account`
  - Regular: `Notes`, `Account`
- The **active tab** highlights automatically when navigating via the navbar.
- Use the **Account dropdown** to access profile or logout.
- Notes can be **created, edited, and listed** directly from the dashboard.
- Refreshing the page preserves the role via `localStorage`.

## Known Issues / To Fix

- Minor UI tweaks for the "Notes" tab to properly reflect the active route.
- Additional **UX improvements** and polishing of animation transitions.

## Getting Started

To run the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000
in your browser to view the app.
