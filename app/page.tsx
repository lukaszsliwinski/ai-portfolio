import NavBar from "@/components/navigation/NavBar";
import Background from "@/components/background/Background";
import Landing from "@/components/landing/Landing";
import ChatSection from "@/components/chat/ChatSection";
import Projects from "@/components/projects/Projects";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex flex-col items-center justify-center px-4 leading-relaxed">
        <Background />
        <Landing />
        <ChatSection />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
