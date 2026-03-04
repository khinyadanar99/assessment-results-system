import { useQuery } from '@tanstack/react-query'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import './AssessmentResults.css'

interface AssessmentResults {
  instance: {
    id: string
    completed: boolean
    completed_at: string | null
    element: string
  }
  total_questions: number
  answered_questions: number
  completion_percentage: number
  scores: {
    total_score: number
    max_score: number
    percentage: number
  }
  element_scores: Record<string, any>
  insights: Array<{
    type: string
    message: string
    positive: boolean
  }>
}

interface Props {
  instanceId: string
}

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8002'

async function fetchAssessmentResults(instanceId: string) {
  const response = await fetch(`${API_URL}/api/assessment/results/${instanceId}`)

  
  return await response.json()
}

export default function AssessmentResults({ instanceId }: Props) {
  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useQuery<AssessmentResults, Error>({
    queryKey: ['assessment-results', instanceId],
    queryFn: () => fetchAssessmentResults(instanceId),
    enabled: !!instanceId,
  })

  if (isLoading) {
    return <div className="loading">Loading results...</div>
  }

  if (isError) {
    return <div className="error">Error: {error.message}</div>
  }

  if (!results) {
    return <div className="empty">No results to display</div>
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#27ae60'
    if (percentage >= 60) return '#f39c12'
    return '#e74c3c'
  }

  const scorePercentage = results.scores.percentage

  const gaugeSegments = [
    { value: 60 },
    { value: 20 },
    { value: 20 },
  ]

  const gaugeColors = ['#e74c3c', '#f39c12', '#27ae60']

  const nonReflectionQuestionScores =
    Object.values(results.element_scores)
      .flatMap((elementScore: any) => elementScore.question_answers || [])
      .filter((q: any) => !q.is_reflection)
      .map((q: any) => {
        const max = q.max_score || 0
        const value = q.answer_value ?? 0
        const percentage =
          max > 1 && value > 0? Math.round(((value - 1) / (max - 1)) * 100) : 0

        return {
          name: `Q${q.question_sequence}`,
          score: percentage,
        }
      })

  return (
    <div className="assessment-results">
      <div className="results-header">
        <h2>Assessment Results - Element {results.instance.element}</h2>
        <p className="instance-id">Instance: {results.instance.id}</p>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
        {/* Progress Card */}
      <div className="card progress-card">
        <h3>Progress</h3>
        <div className="progress-circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="12"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#3498db"
              strokeWidth="12"
              strokeDasharray={`${(results.completion_percentage / 100) * 339.292} 339.292`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="progress-text">
            <span className="progress-percentage">{results.completion_percentage}%</span>
            <span className="progress-label">Complete</span>
          </div>
        </div>
        <div className="progress-details">
          <p>{results.answered_questions} of {results.total_questions} questions answered</p>
        </div>
      </div>

      {/* Score Card */}
      <div className="card score-card">
        <h3>Overall Score</h3>
        <div className="score-display">
          <div className="score-gauge">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={gaugeSegments}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  cy="100%"
                  innerRadius={70}
                  outerRadius={100}
                  stroke="none"
                >
                  {gaugeSegments.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={gaugeColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div
              className="score-gauge-needle"
              style={{
                transform: `rotate(${(scorePercentage*1.8)-90}deg)`,
                borderBottomColor: getScoreColor(scorePercentage),
              }}
            />

            <div className="score-gauge-center">
              <span
                className="score-percentage"
                style={{ color: getScoreColor(scorePercentage) }}
              >
                {scorePercentage}%
              </span>
            </div>
          </div>

          <div className="score-details">
            <p>{results.scores.total_score} / {results.scores.max_score} points</p>
            <p className="score-note">Normalized from 1-5 scale</p>
          </div>
        </div>
      </div>
      </div>
      

      {/* Element Scores */}
      {Object.keys(results.element_scores).length > 0 && (
        <div className="card element-scores-card">
          <h3>Scores by Element</h3>
          <div className="element-scores">
            {Object.values(results.element_scores).map((elementScore: any) => (
              <div key={elementScore.element} className="element-score">
                <div className="element-header">
                  <span className="element-name">Element {elementScore.element}</span>
                  <span
                    className="element-percentage"
                    style={{ color: getScoreColor(elementScore.scores.percentage) }}
                  >
                    {elementScore.scores.percentage}%
                  </span>
                </div>
                <div className="element-progress-bar">
                  <div
                    className="element-progress-fill"
                    style={{
                      width: `${elementScore.completion_percentage}%`,
                      backgroundColor: getScoreColor(elementScore.scores.percentage)
                    }}
                  />
                </div>
                <div className="element-details">
                  <span>{elementScore.answered_questions} / {elementScore.total_questions} answered</span>
                  <span>{elementScore.scores.total_score} / {elementScore.scores.max_score} points</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Scores (non-reflection) */}
      {nonReflectionQuestionScores.length > 0 && (
        <div className="card question-scores-card">
          <h3>Scores per Question</h3>
          <div className="question-scores-chart">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={nonReflectionQuestionScores}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  label={{ value: 'Questions', position: 'insideBottom', offset: -20 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Bar
                  dataKey="score"
                  radius={[4, 4, 0, 0]}
                  fill="#3498db"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insights */}
      {results.insights.length > 0 && (
        <div className="card insights-card">
          <h3>Insights</h3>
          <div className="insights">
            {results.insights.map((insight, index) => (
              <div
                key={index}
                className={`insight ${insight.positive ? 'positive' : 'negative'}`}
              >
                <span className="insight-type">{insight.type}</span>
                <p className="insight-message">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
