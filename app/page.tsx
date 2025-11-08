export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">
            🚨 FlowMate - Phased Development
          </h1>
          
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-left">
            <h2 className="text-2xl font-semibold text-yellow-900 mb-4">
              ⚠️ IMPORTANT: Read Before Building
            </h2>
            <p className="text-yellow-800 mb-4">
              This project uses a <strong>multi-phase development approach</strong>. 
              Do not start building immediately!
            </p>
            <ol className="list-decimal list-inside space-y-2 text-yellow-900">
              <li>Read <code className="bg-yellow-200 px-2 py-1 rounded">DEVELOPMENT.md</code> - Workflow instructions</li>
              <li>Read <code className="bg-yellow-200 px-2 py-1 rounded">PHASES.md</code> - Phase breakdown</li>
              <li>Check <code className="bg-yellow-200 px-2 py-1 rounded">.phase-status.json</code> - Current status</li>
              <li>Ask the agent: "Which phase should I work on?"</li>
              <li>Claim your phase and create a branch</li>
            </ol>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <a 
              href="https://github.com/your-repo/blob/main/DEVELOPMENT.md"
              className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
            >
              <h3 className="font-bold text-blue-900 mb-2">📋 Development Guide</h3>
              <p className="text-sm text-blue-700">How to work on this project</p>
            </a>
            
            <a 
              href="https://github.com/your-repo/blob/main/PHASES.md"
              className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
            >
              <h3 className="font-bold text-purple-900 mb-2">📊 Phase Breakdown</h3>
              <p className="text-sm text-purple-700">What each phase builds</p>
            </a>
            
            <a 
              href="https://github.com/your-repo/blob/main/replit.md"
              className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
            >
              <h3 className="font-bold text-green-900 mb-2">🏗️ Architecture</h3>
              <p className="text-sm text-green-700">Technical decisions</p>
            </a>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Development Phases</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-medium">Phase 1: Foundation & DevOps</span>
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded">✓ Completed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-medium">Phase 2: Auth & Data Layer</span>
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded">✓ Completed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-medium">Phase 3: Core UI Components</span>
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded">✓ Completed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-medium">Phase 4: AI Integration</span>
                <span className="text-sm bg-gray-200 px-3 py-1 rounded">Not Started</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-medium">Phase 5: Analytics & Polish</span>
                <span className="text-sm bg-gray-200 px-3 py-1 rounded">Not Started</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <p>Total estimated time: <strong>10.5-13 days</strong></p>
            <p className="mt-2">This page will be replaced once development begins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
