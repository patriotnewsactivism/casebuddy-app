import React from 'react'
import { motion } from 'framer-motion'
import { DocumentManager } from './components/DocumentManager'
import { ActivityFeed } from './components/ActivityFeed'

export const App: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">CaseBuddy — Phase 1</h1>
        <a className="btn" href="https://app.netlify.com" target="_blank" rel="noreferrer">Open Netlify</a>
      </header>

      <section className="card">
        <motion.h2 initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="text-xl mb-4">
          Project Hub (KPI sample)
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Total Cases','Urgent','Overdue','Due This Week'].map((k,i)=>(
            <motion.div key={k} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:i*0.05}} className="kpi">
              <div className="text-sm text-[var(--muted)]">{k}</div>
              <div className="text-2xl font-semibold mt-1">{[24,3,2,7][i]}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="card">
        <motion.h2 initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="text-xl mb-4">
          Documents
        </motion.h2>
        <DocumentManager />
      </section>

      <section className="card">
        <motion.h2 initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="text-xl mb-4">
          Activity Feed
        </motion.h2>
        <ActivityFeed />
      </section>
    </div>
  )
}
