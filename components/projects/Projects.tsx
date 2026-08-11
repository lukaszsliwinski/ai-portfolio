import Image from "next/image";


function Laptop() {
  return (
    <div className="flex flex-col items-center scale-150">
      <div className="w-60 h-41 bg-[#2e2e35] p-3 rounded-t-md overflow-hidden">
        <Image
          src="/images/placeholder.png"
          alt="Project screenshot"
          width={600}
          height={400}
        />
      </div>
      <div className="w-75 h-4.5 bg-[#373740] [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]"></div>
      <div className="w-75 h-3 bg-[#2e2e35] rounded-b flex justify-center">
        <div className="w-10 h-1 rounded-b bg-[#26262c]"></div>
      </div>
    </div>
  );
}


// https://pixelarity.com/threshold

export default function Projects() {
  return (
    <section className="bg-[#24242a] w-screen h-screen flex justify-center items-center">
      <Laptop />
    </section>

  );
}