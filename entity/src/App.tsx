import { Header } from './components/Header.js'
import { IdentityPane } from './components/IdentityPane.js'
import { AuditFeed } from './components/AuditFeed.js'
import { TelemetryPane } from './components/TelemetryPane.js'

export default function App() {
  return (
    <div className="h-screen bg-e-bg text-e-text flex flex-col overflow-hidden font-mono">
      <Header />
      <div className="flex-1 grid grid-cols-[300px_1fr_280px] min-h-0">
        <div className="border-r border-e-border min-h-0">
          <IdentityPane />
        </div>
        <div className="min-h-0">
          <AuditFeed />
        </div>
        <div className="border-l border-e-border min-h-0">
          <TelemetryPane />
        </div>
      </div>
    </div>
  )
}
