// components/howitworks.tsx
'use client'

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Connect Calendar",
      description: "Securely connect your Google Calendar with read-only permissions"
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our AI analyzes your calendar patterns and generates insights"
    },
    {
      number: 3,
      title: "Get Insights",
      description: "Receive your personal summary and actionable recommendations"
    }
  ]

  return (
    <section id="how-it-works" className="bg-gradient-to-br from-white via-gray-50 to-blue-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Simple, secure, and private analysis of your calendar data
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 -translate-x-1/2 -z-10"></div>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
