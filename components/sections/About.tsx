export default function About() {
  return (
    <section id="apropos" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">À propos</h2>
        <div className="flex flex-col sm:flex-row gap-10 items-start">
          <div className="w-40 h-40 shrink-0 mx-auto sm:mx-0 rounded-full bg-gray-100" />
          <div className="text-gray-500 leading-relaxed space-y-4">
            <p>
              Portrait et histoire du bijoutier à compléter avec le client.
            </p>
            <p>
              Texte de présentation, formation, inspiration, matériaux utilisés…
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
