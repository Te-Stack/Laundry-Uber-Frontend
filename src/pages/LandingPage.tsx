import {
    ArrowRight01Icon,
    Calendar03Icon,
    Location01Icon,
    SparklesIcon,
    StarIcon,
    TShirtIcon,
    TickDouble02Icon,
    TruckDeliveryIcon,
    UserGroupIcon,
    WashingMachineIcon,
} from "hugeicons-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface LandingPageProps {
    onUserTypeSelect: (type: "customer" | "provider") => void
}

const steps = [
    {
        number: "01",
        title: "Tell us what needs care",
        description: "Create a request with your items, pickup location, and any special instructions.",
        icon: TShirtIcon,
    },
    {
        number: "02",
        title: "Match with a local pro",
        description: "Connect with nearby laundry providers who can take the job on your schedule.",
        icon: UserGroupIcon,
    },
    {
        number: "03",
        title: "Track it home, fresh",
        description: "Follow each update from pickup to washing, delivery, and review.",
        icon: TruckDeliveryIcon,
    },
]

const benefits = [
    { title: "Made for your routine", description: "Schedule around your week, not the other way round.", icon: Calendar03Icon },
    { title: "Local by design", description: "Find providers near you and keep laundry care in your community.", icon: Location01Icon },
    { title: "Clear every step", description: "See job status, messaging, and service details in one place.", icon: TickDouble02Icon },
]

export function LandingPage({ onUserTypeSelect }: LandingPageProps) {
    const scrollToHowItWorks = () => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })

    return (
        <main className="min-h-screen overflow-hidden bg-stone-50 text-slate-900 dark:bg-background dark:text-foreground">
            <div className="relative isolate">
                <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_10%_0%,rgba(125,211,252,.5),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(167,243,208,.5),transparent_27%)] dark:opacity-40" />

                <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 text-left" aria-label="Back to top">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-primary">
                            <WashingMachineIcon className="h-5 w-5" />
                        </span>
                        <span className="text-lg font-bold tracking-tight">LaundryBer</span>
                    </button>
                    <div className="flex items-center gap-1 sm:gap-3">
                        <Button variant="ghost" className="hidden sm:inline-flex" onClick={scrollToHowItWorks}>How it works</Button>
                        <ThemeToggle />
                        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90" onClick={() => onUserTypeSelect("customer")}>Get started</Button>
                    </div>
                </header>

                <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-28">
                    <div className="max-w-2xl">
                        <Badge variant="outline" className="border-sky-200 bg-white/70 px-3 py-1 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                            <SparklesIcon className="mr-1.5 h-3.5 w-3.5" /> Laundry, without the laundry day
                        </Badge>
                        <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                            Fresh clothes.<br />
                            <span className="text-sky-600 dark:text-sky-400">More time for you.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-muted-foreground sm:text-xl">
                            LaundryBer connects you with trusted local laundry professionals for convenient pickup, careful cleaning, and doorstep delivery.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button size="lg" className="h-12 bg-slate-900 px-6 text-base hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90" onClick={() => onUserTypeSelect("customer")}>
                                Book a laundry pickup <ArrowRight01Icon className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 border-slate-300 bg-white/60 px-6 text-base dark:bg-background/40" onClick={() => onUserTypeSelect("provider")}>
                                Become a provider
                            </Button>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-slate-600 dark:text-muted-foreground">
                            <span className="flex items-center gap-2"><TickDouble02Icon className="h-4 w-4 text-emerald-600" /> Local providers</span>
                            <span className="flex items-center gap-2"><TickDouble02Icon className="h-4 w-4 text-emerald-600" /> Status updates</span>
                            <span className="flex items-center gap-2"><TickDouble02Icon className="h-4 w-4 text-emerald-600" /> Flexible schedules</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                        <div className="absolute -right-10 top-10 -z-10 h-48 w-48 rounded-full bg-amber-200/70 blur-3xl dark:bg-amber-500/15" />
                        <Card className="overflow-hidden border-white/80 bg-white/85 shadow-2xl shadow-sky-950/10 backdrop-blur dark:border-border dark:bg-card/90">
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-border">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"><TShirtIcon className="h-5 w-5" /></div>
                                    <div><p className="font-semibold">Your laundry request</p><p className="text-xs text-slate-500 dark:text-muted-foreground">Updated just now</p></div>
                                </div>
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200">In progress</Badge>
                            </div>
                            <CardContent className="space-y-5 p-6">
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm dark:bg-card"><TruckDeliveryIcon className="h-6 w-6" /></div>
                                        <div className="flex-1"><p className="font-semibold">On the way to you</p><p className="mt-0.5 text-sm text-slate-500 dark:text-muted-foreground">Your provider is bringing it home fresh.</p></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        ["Request accepted", "Your local provider confirmed the job", true],
                                        ["Laundry in care", "Washed and prepared with your notes in mind", true],
                                        ["Out for delivery", "Fresh clothes are on their way", false],
                                    ].map(([title, description, complete]) => (
                                        <div key={title as string} className="flex gap-3">
                                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${complete ? "bg-emerald-500 text-white" : "border-2 border-sky-500 bg-white dark:bg-card"}`}>
                                                {complete && <TickDouble02Icon className="h-3.5 w-3.5" />}
                                            </span>
                                            <div><p className="text-sm font-semibold">{title}</p><p className="text-xs leading-5 text-slate-500 dark:text-muted-foreground">{description}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="absolute -bottom-7 -left-4 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl dark:border-border dark:bg-card sm:-left-10">
                            <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><StarIcon className="h-4 w-4 fill-current" /></span><div><p className="text-sm font-bold">Care you can follow</p><p className="text-xs text-slate-500 dark:text-muted-foreground">Every step, in one place</p></div></div>
                        </div>
                    </div>
                </section>
            </div>

            <section id="how-it-works" className="bg-slate-900 px-5 py-20 text-white sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Simple by design</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Laundry care, on your terms.</h2></div><p className="max-w-md text-slate-300">From the first request to the final delivery, LaundryBer keeps the experience clear, local, and easy to manage.</p></div>
                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {steps.map(({ number, title, description, icon: Icon }) => <div key={number} className="rounded-2xl border border-white/10 bg-white/5 p-6"><span className="text-sm font-bold text-sky-300">{number}</span><div className="mt-8 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-2 leading-6 text-slate-300">{description}</p></div>)}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
                <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
                    <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-400">A better connection</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Built for customers and laundry professionals.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-muted-foreground">Whether you need an extra hour back in your day or want to grow your local laundry business, LaundryBer makes it easier to connect.</p><Button variant="link" className="mt-4 h-auto p-0 text-base text-sky-700 dark:text-sky-400" onClick={() => onUserTypeSelect("provider")}>Explore provider opportunities <ArrowRight01Icon className="ml-2 h-4 w-4" /></Button></div>
                    <div className="grid gap-4 sm:grid-cols-3">{benefits.map(({ title, description, icon: Icon }) => <Card key={title} className="border-slate-200 bg-white dark:border-border dark:bg-card"><CardContent className="p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"><Icon className="h-5 w-5" /></div><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">{description}</p></CardContent></Card>)}</div>
                </div>
            </section>

            <section className="px-5 pb-20 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl bg-sky-600 px-7 py-10 text-white sm:px-10 md:flex-row md:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-100">Ready when you are</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Let laundry take less of your day.</h2><p className="mt-2 text-sky-100">Start with a request, or bring your laundry services to more people.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50" onClick={() => onUserTypeSelect("customer")}>I need laundry help</Button><Button size="lg" variant="outline" className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => onUserTypeSelect("provider")}>I provide laundry care</Button></div></div></section>

            <footer className="border-t border-slate-200 px-5 py-7 text-sm text-slate-500 dark:border-border dark:text-muted-foreground sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 sm:flex-row"><span className="font-semibold text-slate-700 dark:text-foreground">LaundryBer</span><span>Local laundry care, made simple.</span></div></footer>
        </main>
    )
}
