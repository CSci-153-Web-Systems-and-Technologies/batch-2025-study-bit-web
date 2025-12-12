import Link from "next/link";
import { Container, Section, Button } from "@/components/ui";
import {
  Timer,
  Target,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Timer,
    title: "Focus Timer",
    description: "Track your study sessions with precision timing and stay in the zone.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set daily and weekly study goals to keep yourself accountable.",
  },
  {
    icon: AlertTriangle,
    title: "Distraction Warnings",
    description: "Get notified when you're losing focus so you can refocus quickly.",
  },
  {
    icon: ShieldCheck,
    title: "Honesty System",
    description: "Track your actual study time with our honest productivity system.",
  },
  {
    icon: BarChart3,
    title: "Progress Reports",
    description: "Visualize your study patterns and identify areas for improvement.",
  },
  {
    icon: Clock,
    title: "Session History",
    description: "Review your past study sessions and track your consistency.",
  },
];

const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "500K+", label: "Study Hours Logged" },
  { value: "95%", label: "Report Better Focus" },
  { value: "4.9", label: "App Rating" },
];

export default function Home() {
  return (
    <>
      <Section spacing="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-neutral-950 to-blue-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />

        <Container size="lg" className="relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
              <TrendingUp className="w-4 h-4" />
              <span>Join 10,000+ students improving their focus</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Study Smarter, Not Harder with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                STUDYBIT
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Your honest study companion that helps you track, measure, and improve your focus with bite-sized sessions and actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-in">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="bg-neutral-900 border-y border-white/10">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="bg-neutral-950">
        <Container size="xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Study Better
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Powerful features designed to help you stay focused, track your progress, and achieve your learning goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section spacing="xl" className="bg-gradient-to-b from-neutral-950 to-neutral-900">
        <Container size="md">
          <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <Users className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Study Habits?
            </h2>
            <p className="text-neutral-300 mb-8 max-w-lg mx-auto">
              Join thousands of students who are already studying smarter with STUDYBIT. Start your free trial today.
            </p>
            <Link href="/sign-in">
              <Button size="lg">
                Start Studying Smarter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
