import NavBar from "@/components/navigation/NavBar";
import Background from "@/components/background/Background";
import Landing from "@/components/landing/Landing";
import ChatSection from "@/components/chat/ChatSection";
import Projects from "@/components/projects/Projects";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="relative flex-1 flex flex-col items-center justify-center w-full">
        <Background />
        <Landing />
        <ChatSection />
        <Projects />
        <Footer />
      </main>
    </div>
  );
}
