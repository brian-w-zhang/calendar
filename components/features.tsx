// components/features.tsx
'use client'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartColumnDecreasing, User, Calendar } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: ChartColumnDecreasing,
      title: "Productivity Patterns",
      description: "Discover your most productive hours and optimize your schedule",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-500"
    },
    {
      icon: User,
      title: "Social Insights",
      description: "Understand your meeting patterns and collaboration style",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconColor: "text-green-500"
    },
    {
      icon: Calendar,
      title: "Lifestyle Analysis",
      description: "Get insights into your work-life balance and daily routines",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconColor: "text-purple-500"
    }
  ]

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          What you'll discover
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Our AI analyzes your calendar patterns to reveal insights about your lifestyle and habits
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card 
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br from-white to-gray-50"
            >
              <CardHeader className="text-center p-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
