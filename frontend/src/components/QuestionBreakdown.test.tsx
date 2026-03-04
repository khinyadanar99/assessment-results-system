import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import QuestionBreakdown from './QuestionBreakdown'

const baseQuestion = {
  question_id: 1,
  question_sequence: 1,
  question_title: 'How confident are you in planning engaging lessons?',
  max_score: 5,
}

describe('QuestionBreakdown', () => {
  it('renders answered question with answer and score', () => {
    render(
      <QuestionBreakdown
        question={{
          ...baseQuestion,
          is_answered: true,
          answer_text: 'Very confident',
          answer_value: 4,
        }}
      />,
    )

    expect(screen.getByText(/Question 1/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /How confident are you in planning engaging lessons\?/i,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/Answer:/i)).toBeInTheDocument()
    expect(screen.getByText(/Very confident/i)).toBeInTheDocument()
    expect(screen.getByText(/Score:/i)).toBeInTheDocument()
    expect(screen.getByText(/4 \/ 5/i)).toBeInTheDocument()
  })

  it('renders unanswered question label', () => {
    render(
      <QuestionBreakdown
        question={{
          ...baseQuestion,
          is_answered: false,
          answer_text: null,
          answer_value: null,
        }}
      />,
    )

    expect(screen.getByText(/Not answered/i)).toBeInTheDocument()
  })
})

