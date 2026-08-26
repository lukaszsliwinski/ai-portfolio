export default function SectionParagraph({ text }: { text: string }) {
  return (
    <p className="leading-relaxed text-justify">
      {text}
    </p>
  )
}