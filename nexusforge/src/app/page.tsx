import Link from "next/link"
import Image from "next/image"
import { Building2, Users2, Presentation, Globe2, Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

const userTypes = [
  {
    title: "Students",
    description: "From undergraduate to master's level",
    icon: "/icons/student.svg",
  },
  {
    title: "Professional Architects",
    description: "Active practitioners in the field",
    icon: "/icons/professional.svg",
  },
  {
    title: "Industry Veterans",
    description: "Experienced mentors and advisors",
    icon: "/icons/veteran.svg",
  },
  {
    title: "Clients",
    description: "Connect with architectural services",
    icon: "/icons/client.svg",
  },
]

const navigationLinks = [
  { name: 'Features', href: '#features' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Navigation Header */}
      <header className="absolute w-full z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold text-white">
              NexusForge
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white">
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigationLinks.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-white">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
            <Link href="/login" className="text-sm font-semibold leading-6 text-white">
              Log in
            </Link>
            <ModeToggle />
          </div>
        </nav>
      </header>

      {/* Hero Section with Background Image */}
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/nigeria-architecture.webp"
            alt="Modern Nigerian Architecture"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-steel-blue-600/30 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-48 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              NexusForge
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              Connecting architectural minds across borders. From students to veterans, 
              building the future of architecture together.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-steel-blue-600 shadow-sm hover:bg-gray-100"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="py-24 sm:py-32 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-steel-blue-600">For Everyone</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built for the entire architectural community
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4">
              {userTypes.map((type) => (
                <div key={type.title} className="flex flex-col items-center text-center">
                  <div className="mb-6 relative w-16 h-16">
                    <Image
                      src={type.icon}
                      alt={type.title}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {type.title}
                  </h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="bg-gray-50 dark:bg-neutral-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to succeed
            </h2>
          </div>
          <div className="mt-16 grid max-w-2xl grid-cols-1 gap-8 mx-auto lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-neutral-700">
                <div className="mb-6">
                  <feature.icon className="h-6 w-6 text-steel-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 flex-1">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-steel-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your architectural journey?
          </h2>
          <p className="mt-6 text-lg text-white/90">
            Join a global community of architects and start building your future today.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/register"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-steel-blue-600 shadow-sm hover:bg-gray-100"
            >
              Get started
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold leading-6 text-white"
            >
              Contact us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} NexusForge. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">
              Privacy
            </Link>
            <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    name: 'Global Community',
    description: 'Connect with architects worldwide, share knowledge, and collaborate on innovative projects.',
    icon: Globe2,
  },
  {
    name: 'Project Management',
    description: 'Comprehensive tools for project tracking, team collaboration, and client communication.',
    icon: Building2,
  },
  {
    name: 'Mentorship',
    description: 'Learn from industry veterans through direct messaging, portfolio reviews, and virtual office hours.',
    icon: Users2,
  },
]