import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* Hero section coming next */}
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl text-[#d4a017]" style={{fontFamily: 'Cormorant Garamond, serif'}}>
          Culinary Harmony — Coming Soon
        </h1>
      </div>
    </main>
  );
}