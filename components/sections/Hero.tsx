export default function Hero() {
  return (
    <section className="py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
          Bijoux artisanaux sur mesure
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Chaque pièce est unique, créée avec soin et passion.
        </p>
        <a
          href="#contact"
          className="inline-block bg-gray-900 text-white px-8 py-3 text-sm rounded-full hover:bg-gray-700 transition-colors"
        >
          Commander une pièce
        </a>
      </div>
    </section>
  )
}
