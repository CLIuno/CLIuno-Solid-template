import { For } from 'solid-js'
import FooterComp from '@/components/FooterComp'
import NavbarComp from '@/components/NavbarComp'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const steps = [
  {
    title: 'Step 1: Choose Your Template',
    description: 'Browse through our collection of ready-to-use templates.',
  },
  {
    title: 'Step 2: Customize It',
    description: 'Adjust the template to your needs with minimal effort.',
  },
  {
    title: 'Step 3: Launch',
    description: 'Deploy and launch your project in no time.',
  },
]

const features = [
  {
    title: '⚡ Open Source',
    description: 'Use it for free and contribute to the project.',
    image: 'https://placehold.co/400x200',
    alt: 'Open Source',
  },
  {
    title: '🎨 Free',
    description: 'Use even for commercial projects, no cost at all.',
    image: 'https://placehold.co/400x200',
    alt: 'Free',
  },
  {
    title: '🌙 Simplicity First',
    description: 'No experience needed. Just plug and play.',
    image: 'https://placehold.co/400x200',
    alt: 'Simplicity',
  },
  {
    title: '🚀 Fast Launch',
    description: 'Get projects off the ground with one command.',
    image: 'https://placehold.co/400x200',
    alt: 'Fast Launch',
  },
]

const HomePage = () => {
  return (
    <div class="flex min-h-screen flex-col bg-background text-foreground">
      <NavbarComp />

      <main class="flex-1">
        {/* Hero Section */}
        <section class="border-b">
          <div class="container mx-auto flex flex-col-reverse items-center gap-12 px-4 py-16 lg:flex-row lg:justify-between lg:py-24">
            <div class="max-w-xl space-y-6 text-center lg:text-left">
              <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
                Welcome to CLIuno Templates
              </h1>
              <p class="text-lg text-muted-foreground">
                The ultimate tool to make your journey in web development less painful.
              </p>
              <Button size="lg">Get Started</Button>
            </div>
            <img
              src="https://placehold.co/600x400/"
              class="w-full max-w-sm rounded-xl border shadow-sm"
              alt="Hero"
            />
          </div>
        </section>

        {/* Reset Section */}
        <section class="py-20">
          <div class="container mx-auto px-4">
            <div class="mx-auto mb-14 max-w-2xl space-y-3 text-center">
              <h2 class="text-3xl font-bold tracking-tight">Reset Your Development Journey</h2>
              <p class="text-lg text-muted-foreground">
                Forget the confusion and complexity—use our templates to start your next project
                without the hassle.
              </p>
            </div>
            <div class="grid gap-6 lg:grid-cols-3">
              <For each={steps}>
                {(step) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section class="pb-20">
          <div class="container mx-auto px-4">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <For each={features}>
                {(feature) => (
                  <Card>
                    <img src={feature.image} alt={feature.alt} class="w-full" />
                    <CardHeader>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </For>
            </div>
          </div>
        </section>
      </main>

      <FooterComp />
    </div>
  )
}

export default HomePage
