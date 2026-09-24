# AI Loan Underwriting Simulator

A prototype application demonstrating how Artificial Intelligence can be applied to consumer loan underwriting with a strong emphasis on Explainable AI (XAI), fairness, and Human-in-the-Loop (HITL) workflows.

> **Disclaimer:** This is a simulated prototype utilizing heuristic scoring for demonstration purposes. It is **not** a real underwriting system and does not interface with actual credit bureaus or utilize real machine learning models for its decisions.

---

## 1. Product Overview
The AI Loan Underwriting Simulator is a dashboard designed for loan officers and risk managers to evaluate incoming loan applications. It processes standard applicant data (income, debt, credit profile, etc.) and provides a simulated model decision alongside detailed explainability factors (approximating SHAP values). 

### Why I Built This
Financial institutions are increasingly leveraging AI to automate decision-making. However, "black box" models pose massive regulatory and ethical risks (e.g., FCRA and ECOA compliance in the US). I built this prototype to demonstrate how AI can be implemented responsibly—surfacing clear reason codes for adverse actions, monitoring for bias, and knowing when to fall back to human experts.

### Problem Statement
Traditional underwriting is slow, manual, and expensive. While AI can drastically reduce time-to-decision, pure automation risks rejecting qualified applicants due to unseen biases or failing to explain *why* an applicant was rejected, violating compliance requirements.

### Target Users & Personas
- **Alice (Loan Officer):** Needs to quickly understand why the AI flagged an application so she can review it manually and communicate with the customer.
- **Bob (Risk Manager):** Cares about the aggregate portfolio risk and ensuring the model isn't exhibiting bias against protected classes.

---

## 2. Product Goals & Hypothesis
- **Goal:** Reduce manual underwriting time by 60% while maintaining 100% compliance with explainability regulations.
- **Hypothesis:** By providing a clear Natural Language summary and feature importance breakdown, loan officers will trust the AI's recommendations more and process manual exceptions faster.

---

## 3. Key Features & Workflow
1. **Applicant Data Entry:** Simulated ingestion of income, debt, loan amount, and credit history.
2. **Algorithmic Decisioning Engine:** Categorizes risk (Low, Moderate, High, Critical) and outputs a decision (Auto-Approve, Manual Review, Auto-Decline).
3. **Explainability Dashboard:** Visualizes the factors (DTI, History, etc.) driving the decision.
4. **Human-in-the-Loop Protocol:** Explicitly dictates when an application requires human review and provides context to the human underwriter.
5. **Bias & Fairness Guardrails:** Explicitly excludes protected classes from the decisioning UI.

### User Journey
1. The applicant data is ingested into the system.
2. The model processes the data and outputs a decision.
3. If the decision is `Auto-Approve` or `Auto-Decline`, the system logs the explainability factors for compliance.
4. If the decision is `Manual Review`, the UI flags it for a human underwriter, highlighting the exact variables (e.g., recent delinquency) that caused the uncertainty.

---

## 4. Requirements & User Stories

### User Stories
- *As a Loan Officer, I want to see exactly which factors lowered an applicant's score, so I can explain the decision if they are rejected.*
- *As a Risk Manager, I want applications with borderline scores to automatically route to a human, so we don't accidentally approve high-risk loans.*

### Acceptance Criteria
- The system must output a Risk Score (0-100) and a categorical Risk Level.
- Every decision must be accompanied by at least 2 driving factors (positive, negative, or neutral).
- The system must explicitly state the human-in-the-loop requirement for scores between 40 and 80.

---

## 5. Tradeoffs & Technical Decisions
- **Heuristics vs. Real ML:** Traded a real Python/Flask ML backend for a React frontend with heuristic logic. *Why?* To focus the prototype on the UX of explainability and HITL rather than model training.
- **Radar Chart for Feature Profiling:** Chosen over standard bar charts to easily visualize the "shape" of an applicant's risk profile at a glance.

---

## 6. Architecture & Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons & Visualization:** Lucide React, Recharts
- **State Management:** React Hooks (useState)

---

## 7. KPI Framework
If launched to production, we would measure:
- **Auto-Decision Rate:** % of applications processed without human intervention (Target: >60%).
- **Underwriter Review Time:** Average time spent on `Manual Review` applications (Target: <15 mins).
- **Adverse Action Explanation Accuracy:** % of rejected applications with valid, compliant reason codes (Target: 100%).

---

## 8. Roadmap & Future Opportunities
- **V2 (MVP+):** Connect to a real Python backend running an XGBoost model.
- **V3:** Integrate a fairness monitoring dashboard showing demographic parity metrics.
- **V4:** LLM-powered chatbot to let underwriters "query" the applicant's financial history.

---

## 9. Getting Started

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/adishuklaa/ai-loan-underwriting-simulator.git
   ```
2. Install dependencies:
   ```bash
   cd ai-loan-underwriting-simulator
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Project Structure
- `src/App.tsx`: Contains the main UI, state, and heuristic simulation logic.
- `src/index.css`: Tailwind configuration and base styles.

### Limitations
- The underlying decision logic is a simulated heuristic, not a trained machine learning model.
- Data is entirely synthetic and does not persist across sessions.

---

## 10. Screenshots

*(Screenshots will be saved to the `screenshots/` directory)*
- `screenshots/dashboard.png` - The main applicant profiling dashboard.
- `screenshots/simulation_results.png` - The explainability and human-in-the-loop results.

---
