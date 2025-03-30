// src/app/page.tsx
export const dynamic = "force-static";
export const revalidate = false;

export default function Home() {
  return (
    <main>
      <h1>Welcome to Vibing</h1>
    </main>
  );
}
