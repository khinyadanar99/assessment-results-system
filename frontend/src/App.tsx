import { useState } from 'react'
import AssessmentResults from './components/AssessmentResults'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
  const [instanceId, setInstanceId] = useState('d1111111-1111-1111-1111-111111111111')
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="app-header">
          <h1>Assessment Results System</h1>
          <p>Technical Interview Task</p>
        </header>

        <main className="app-main">
          <div className="instance-selector">
            <label htmlFor="instance-id">Assessment Instance ID:</label>
            <input
              id="instance-id"
              type="text"
              value={instanceId}
              onChange={(e) => setInstanceId(e.target.value)}
              placeholder="Enter instance ID"
            />
          </div>

          <AssessmentResults instanceId={instanceId} />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
