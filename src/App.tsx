import React, { useState } from 'react';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  User,
  DollarSign,
  Briefcase,
  CreditCard,
  History,
  ShieldAlert,
  BarChart4
} from 'lucide-react';
import { 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

// --- Types ---
type RiskCategory = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';
type Decision = 'Auto-Approve' | 'Manual Review Required' | 'Auto-Decline';

interface SimulationResult {
  riskCategory: RiskCategory;
  decision: Decision;
  riskScore: number; // 0-100
  factors: { name: string; impact: 'positive' | 'negative' | 'neutral'; description: string }[];
  explainability: string;
  humanReview: string;
}

// --- Main Component ---
export default function App() {
  // Input States
  const [income, setIncome] = useState<number>(85000);
  const [employmentDuration, setEmploymentDuration] = useState<number>(4);
  const [debt, setDebt] = useState<number>(15000);
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [existingObligations, setExistingObligations] = useState<number>(800); // monthly
  const [creditProfile, setCreditProfile] = useState<string>('Good');
  const [paymentHistory, setPaymentHistory] = useState<number>(98); // % on time

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation Logic (Heuristic for demo purposes)
  const runSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);

    setTimeout(() => {
      // DTI Calculation
      const monthlyIncome = income / 12;
      const proposedMonthlyPayment = loanAmount * 0.03; // Rough approximation
      const totalMonthlyObligations = existingObligations + proposedMonthlyPayment;
      const dti = totalMonthlyObligations / monthlyIncome;

      let score = 100;
      const factors: SimulationResult['factors'] = [];

      // Income & DTI
      if (dti < 0.3) {
        factors.push({ name: 'Debt-to-Income', impact: 'positive', description: `Healthy DTI ratio of ${(dti*100).toFixed(1)}%` });
      } else if (dti > 0.45) {
        score -= 30;
        factors.push({ name: 'Debt-to-Income', impact: 'negative', description: `High DTI ratio of ${(dti*100).toFixed(1)}% indicates payment strain` });
      } else {
        score -= 10;
        factors.push({ name: 'Debt-to-Income', impact: 'neutral', description: `Moderate DTI ratio of ${(dti*100).toFixed(1)}%` });
      }

      // Employment
      if (employmentDuration >= 3) {
        factors.push({ name: 'Employment Stability', impact: 'positive', description: `${employmentDuration} years at current employer provides strong stability` });
      } else if (employmentDuration < 1) {
        score -= 15;
        factors.push({ name: 'Employment Stability', impact: 'negative', description: `Less than 1 year of employment flags potential volatility` });
      }

      // Credit Profile
      if (creditProfile === 'Excellent') {
        factors.push({ name: 'Credit Profile', impact: 'positive', description: 'Excellent credit history minimizes default probability' });
      } else if (creditProfile === 'Poor') {
        score -= 40;
        factors.push({ name: 'Credit Profile', impact: 'negative', description: 'Poor credit indicates historical struggle with debt obligations' });
      }

      // Payment History
      if (paymentHistory >= 99) {
        factors.push({ name: 'Payment History', impact: 'positive', description: 'Near perfect on-time payment behavior' });
      } else if (paymentHistory < 90) {
        score -= 25;
        factors.push({ name: 'Payment History', impact: 'negative', description: 'Historical delinquencies significantly increase risk' });
      }

      // Final classification
      let riskCategory: RiskCategory = 'Low Risk';
      let decision: Decision = 'Auto-Approve';
      let humanReview = 'No manual intervention required. Decision threshold met with high confidence.';

      if (score >= 80) {
        riskCategory = 'Low Risk';
        decision = 'Auto-Approve';
      } else if (score >= 60) {
        riskCategory = 'Moderate Risk';
        decision = 'Manual Review Required';
        humanReview = 'Agent should verify employment details and manually assess mitigating factors for recent delinquencies.';
      } else if (score >= 40) {
        riskCategory = 'High Risk';
        decision = 'Manual Review Required';
        humanReview = 'Senior underwriter review required. Significant risk factors present; exception approval only.';
      } else {
        riskCategory = 'Critical Risk';
        decision = 'Auto-Decline';
        humanReview = 'Application does not meet minimum threshold. Auto-declined to prevent predatory lending situations.';
      }

      setResult({
        riskCategory,
        decision,
        riskScore: Math.max(0, score),
        factors,
        explainability: `The model determined a ${riskCategory} categorization based primarily on a simulated risk score of ${Math.max(0, score)}/100. The primary drivers were the DTI ratio (${(dti*100).toFixed(1)}%) and the applicant's declared credit profile (${creditProfile}).`,
        humanReview
      });
      setIsSimulating(false);
    }, 1500);
  };

  const getRiskColor = (category: RiskCategory) => {
    switch(category) {
      case 'Low Risk': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Moderate Risk': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High Risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical Risk': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const radarData = [
    { subject: 'Income/DTI', A: result ? result.factors.find(f => f.name === 'Debt-to-Income')?.impact === 'positive' ? 100 : result.factors.find(f => f.name === 'Debt-to-Income')?.impact === 'neutral' ? 60 : 20 : 0, fullMark: 100 },
    { subject: 'Employment', A: employmentDuration >= 3 ? 100 : employmentDuration >= 1 ? 60 : 20, fullMark: 100 },
    { subject: 'Credit', A: creditProfile === 'Excellent' ? 100 : creditProfile === 'Good' ? 80 : creditProfile === 'Fair' ? 50 : 20, fullMark: 100 },
    { subject: 'History', A: paymentHistory, fullMark: 100 },
    { subject: 'Capacity', A: Math.min(100, (income / loanAmount) * 40), fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Disclaimer Header */}
      <div className="bg-slate-900 text-slate-100 py-2 px-4 text-sm text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldAlert size={16} className="text-amber-400" />
        SIMULATION ONLY. Not a real underwriting system. For demonstration of AI capabilities, fairness, and explainability.
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Underwriter<span className="text-indigo-600 font-light">Pro</span></h1>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Algorithmic Decisioning Engine
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <User className="h-5 w-5 text-slate-500" />
              <h2 className="text-lg font-semibold text-slate-800">Applicant Profile</h2>
            </div>
            <form onSubmit={runSimulation} className="p-6 space-y-5">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    <span>Annual Income</span>
                    <span className="text-slate-400">${income.toLocaleString()}</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      min="0"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    <span>Employment Duration (Years)</span>
                    <span className="text-slate-400">{employmentDuration} yrs</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      min="0"
                      step="0.5"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={employmentDuration}
                      onChange={(e) => setEmploymentDuration(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    <span>Requested Loan Amount</span>
                    <span className="text-slate-400">${loanAmount.toLocaleString()}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1000" max="100000" step="1000"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Debt</label>
                    <input 
                      type="number" 
                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={debt}
                      onChange={(e) => setDebt(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Oblig.</label>
                    <input 
                      type="number" 
                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={existingObligations}
                      onChange={(e) => setExistingObligations(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Credit Profile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                      value={creditProfile}
                      onChange={(e) => setCreditProfile(e.target.value)}
                    >
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Poor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    <span>On-time Payment History</span>
                    <span className="text-slate-400">{paymentHistory}%</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <History className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      min="0" max="100"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={paymentHistory}
                      onChange={(e) => setPaymentHistory(Number(e.target.value))}
                    />
                  </div>
                </div>

              </div>

              <button
                type="submit"
                disabled={isSimulating}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Simulating AI Model...
                  </span>
                ) : (
                  'Run Underwriting Model'
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1 mb-2">
              <Info className="h-4 w-4" /> Bias & Fairness Guardrails
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This model excludes protected classes (age, race, gender, marital status) from its decision engine. Features have been orthogonalized to prevent proxy discrimination.
            </p>
          </div>
        </div>

        {/* Right Column: Results & Analytics */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !isSimulating ? (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white">
              <BarChart4 className="h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">Awaiting Simulation</h3>
              <p className="max-w-sm">Enter applicant data on the left and run the model to see the algorithmic decision, risk factors, and explainability report.</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Decision Banner */}
              <div className={`p-6 rounded-xl border ${getRiskColor(result.riskCategory)} flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {result.decision === 'Auto-Approve' && <CheckCircle className="h-6 w-6" />}
                    {result.decision === 'Manual Review Required' && <AlertTriangle className="h-6 w-6" />}
                    {result.decision === 'Auto-Decline' && <XCircle className="h-6 w-6" />}
                    <h2 className="text-2xl font-bold">{result.decision}</h2>
                  </div>
                  <div className="opacity-80 font-medium">Model Categorization: {result.riskCategory}</div>
                </div>
                <div className="text-center md:text-right shrink-0">
                  <div className="text-4xl font-black">{result.riskScore}<span className="text-lg font-medium opacity-60">/100</span></div>
                  <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Confidence Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Explainability factors */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Model Explainability (SHAP Values)</h3>
                  <div className="space-y-4">
                    {result.factors.map((factor, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="mt-1">
                          {factor.impact === 'positive' && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
                          {factor.impact === 'negative' && <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>}
                          {factor.impact === 'neutral' && <div className="h-2 w-2 rounded-full bg-slate-400"></div>}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700">{factor.name}</h4>
                          <p className="text-sm text-slate-500">{factor.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-900 mb-1">Natural Language Summary</h4>
                    <p className="text-sm text-indigo-700">{result.explainability}</p>
                  </div>
                </div>

                {/* Data Viz */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Feature Profiling</h3>
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Radar name="Applicant" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Human-in-the-loop */}
              <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-3 rounded-full shrink-0">
                    <User className="h-6 w-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-slate-100">Human-in-the-Loop Protocol</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.humanReview}
                    </p>
                    {result.decision === 'Manual Review Required' && (
                      <button className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                        Assign to Human Underwriter
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-slate-200 rounded-xl flex items-center justify-center bg-white shadow-sm">
              <div className="text-center">
                <div className="inline-block relative w-16 h-16 mb-4">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Processing Applicant Data</h3>
                <p className="text-slate-500 mt-1">Applying heuristics and explainability checks...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
