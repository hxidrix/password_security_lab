import { motion } from 'framer-motion'

import SquaresBackground from '../components/background/SquaresBackground'
import { AISecurityAnalysisCard } from '../features/ai/AISecurityAnalysisCard'
import { AttackSimulationCard } from '../features/attacks/AttackSimulationCard'
import { HashingDemoCard } from '../features/hashing/HashingDemoCard'
import { PasswordAnalyzerCard } from '../features/password/PasswordAnalyzerCard'
import { SecureSuggestionsCard } from '../features/suggestions/SecureSuggestionsCard'
import { DemoSettingsProvider } from '../state/demoSettings'
import { PasswordProvider } from '../state/password'

export function Dashboard() {
  return (
    <DemoSettingsProvider>
      <PasswordProvider>
        <div className="min-h-screen px-4 py-8">
          <SquaresBackground />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                <span className="text-white main-title glow-title glow-hover-main glow-animated"> 
                  Password Security Lab
                </span>
              </h1>
              <p className="max-w-3xl text-sm text-[color:var(--muted)] sm:text-base">
                Analyze password strength, compare hashing strategies, visualize attacks
                and generate safer alternatives.
              </p>
            </div>
          </motion.header>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <PasswordAnalyzerCard delay={0.05} />
            <HashingDemoCard delay={0.1} />
            <AttackSimulationCard delay={0.15} />
            <AISecurityAnalysisCard delay={0.2} />
            <SecureSuggestionsCard delay={0.25} />
          </motion.div>
        </div>
        </div>
      </PasswordProvider>
    </DemoSettingsProvider>
  )
}
