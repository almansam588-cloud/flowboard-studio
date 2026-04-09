import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Kanban, Calendar, BarChart3, Bot, Link2, MessageCircle, Check, Sparkles, Eye, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const features = [
  { icon: Kanban, title: "Kanban Boards", desc: "Drag & drop cards across customizable lists with WIP limits." },
  { icon: Calendar, title: "Calendar View", desc: "See all deadlines and milestones on a clean calendar." },
  { icon: BarChart3, title: "Timeline (Gantt)", desc: "Plan sprints with a powerful timeline view." },
  { icon: Bot, title: "AI Assistant", desc: "Break down tasks, predict risks, and balance workloads." },
  { icon: Link2, title: "Dependencies", desc: "Link tasks with blocked, blocking, and related relationships." },
  { icon: MessageCircle, title: "Built-in Chat", desc: "Real-time messaging per board — no more switching apps." },
];

const views = [
  { name: "Kanban", icon: Kanban },
  { name: "Table", icon: BarChart3 },
  { name: "Timeline", icon: Zap },
  { name: "Dashboard", icon: Eye },
];

const pricing = [
  { name: "Free", price: "$0", period: "/month", features: ["Up to 5 boards", "Basic views", "3 team members", "1GB storage"], cta: "Get Started" },
  { name: "Pro", price: "$12", period: "/user/mo", features: ["Unlimited boards", "All views", "AI assistant", "10GB storage", "Priority support"], cta: "Start Free Trial", popular: true },
  { name: "Team", price: "$24", period: "/user/mo", features: ["Everything in Pro", "Advanced analytics", "Custom fields", "SSO & SAML", "Unlimited storage", "Dedicated support"], cta: "Contact Sales" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Kanban className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Flowboard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#views" className="hover:text-foreground transition-colors">Views</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
            <Button size="sm" onClick={() => navigate('/signup')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" /> Now with AI-powered task management
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Project management that actually scales with your brain.
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Replace 5 tools with one clean system. Kanban, timelines, AI task breakdown, built-in chat, and analytics — all in one place.
          </motion.p>
          <motion.div className="flex items-center justify-center gap-3" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button size="lg" onClick={() => navigate('/signup')}>
              Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="mr-2 w-4 h-4" /> Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Board Preview */}
        <motion.div
          className="max-w-5xl mx-auto mt-16 rounded-xl border bg-card shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="h-10 border-b flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-destructive/40" />
            <div className="w-3 h-3 rounded-full bg-warning/40" />
            <div className="w-3 h-3 rounded-full bg-success/40" />
            <span className="text-xs text-muted-foreground ml-2">Flowboard — Product Launch Q2</span>
          </div>
          <div className="p-6 flex gap-4 overflow-x-auto">
            {['Backlog', 'To Do', 'In Progress', 'Done'].map((col, ci) => (
              <div key={col} className="min-w-[220px] flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">{col}</span>
                  <span className="text-xs text-muted-foreground">{ci + 1}</span>
                </div>
                {[0, 1].slice(0, ci === 0 ? 2 : ci === 3 ? 1 : 2).map((_, i) => (
                  <div key={i} className="mb-2 p-3 rounded-lg border bg-background hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-destructive' : 'bg-primary'}`} />
                      <span className="text-xs text-muted-foreground">{i === 0 ? 'High' : 'Medium'}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {['Design system update', 'API integration', 'Dashboard wireframe', 'Auth flow', 'Deploy pipeline', 'Docs update', 'Bug fixes', 'Onboarding'][ci * 2 + i]}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {['AC', 'SM', 'JW', 'ED', 'AC', 'SM', 'JW', 'ED'][ci * 2 + i]}
                      </div>
                      <span className="text-[10px] text-muted-foreground">Apr {10 + ci + i}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Everything you need, nothing you don't</h2>
            <p className="text-muted-foreground">Powerful features that actually help you ship faster.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="p-6 rounded-xl border bg-background hover:shadow-md transition-shadow"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                <Bot className="w-3 h-3" /> AI-Powered
              </span>
              <h2 className="text-3xl font-bold text-foreground mb-4">Your AI project manager</h2>
              <p className="text-muted-foreground mb-6">
                Let AI break down complex tasks, predict delivery risks, and automatically balance your team's workload.
              </p>
              <ul className="space-y-3">
                {['Task breakdown into subtasks', 'Risk prediction for late delivery', 'Workload balancing suggestions', 'Weekly AI digest reports'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm text-foreground">AI Assistant</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 text-sm text-foreground">
                  "Break down the API integration task into subtasks"
                </div>
                <div className="p-3 rounded-lg bg-muted text-sm text-foreground">
                  <p className="font-medium mb-2">Here's a suggested breakdown:</p>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>1. Define API schema & endpoints (2 pts)</li>
                    <li>2. Set up authentication middleware (3 pts)</li>
                    <li>3. Implement CRUD operations (5 pts)</li>
                    <li>4. Write integration tests (3 pts)</li>
                    <li>5. Deploy & monitor (2 pts)</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
                  <p className="font-medium text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-warning" /> Risk Alert
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">"Auth flow" is at risk of missing its deadline based on current velocity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Views */}
      <section id="views" className="py-20 px-6 bg-card">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-3">One board, multiple perspectives</h2>
          <p className="text-muted-foreground mb-10">Switch between views instantly. Same data, different lens.</p>
          <div className="flex justify-center gap-3 mb-10">
            {views.map(v => (
              <div key={v.name} className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-sm font-medium text-foreground hover:border-primary/50 transition-colors cursor-pointer">
                <v.icon className="w-4 h-4 text-primary" /> {v.name}
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-background p-8 text-center">
            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`h-8 rounded-md ${i % 3 === 0 ? 'bg-primary/20' : 'bg-muted'}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Interactive view preview</p>
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm text-foreground">Board Chat</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Sarah', msg: 'Dashboard mockups are ready for review!', time: '2m ago' },
                  { name: 'Alex', msg: 'Looks great, merging the PR now 👍', time: '1m ago' },
                  { name: 'James', msg: 'Should we add dark mode to the scope?', time: 'now' },
                ].map(m => (
                  <div key={m.name} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                      {m.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{m.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Collaborate without context switching</h2>
              <p className="text-muted-foreground mb-6">
                Chat, comment, and react — all without leaving your board. Threaded discussions keep conversations organized.
              </p>
              <ul className="space-y-3">
                {['Per-board real-time chat', 'Threaded comment replies', 'Emoji reactions on any comment', '@mentions with notifications'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-xl border ${plan.popular ? 'border-primary shadow-md ring-1 ring-primary/20' : 'bg-background'} relative`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Most popular
                  </span>
                )}
                <h3 className="font-semibold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Start building better workflows today</h2>
          <p className="text-muted-foreground mb-8">Join thousands of teams shipping faster with Flowboard.</p>
          <Button size="lg" onClick={() => navigate('/signup')}>
            Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Kanban className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">Flowboard</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Flowboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
