import NavBar from "@/components/navigation/NavBar";
import Landing from "@/components/landing/Landing";
import ChatSection from "@/components/chat/ChatSection";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 transition-colors duration-300">
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <Landing />
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
}
