import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import AssessmentResults from './AssessmentResults'
// src/components/AssessmentResults.test.tsx
import '@testing-library/jest-dom/vitest'

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  )
}

const baseApiResponse = {
  instance: {
    id: 'test-id',
    completed: true,
    completed_at: null,
    element: 'A',
  },
  total_questions: 3,
  answered_questions: 2,
  completion_percentage: 66.67,
  scores: {
    total_score: 8,
    max_score: 15,
    percentage: 53.33,
  },
  element_scores: {
    '1.1': {
      element: '1.1',
      total_questions: 3,
      answered_questions: 2,
      completion_percentage: 66.67,
      scores: {
        total_score: 8,
        max_score: 15,
        percentage: 53.33,
      },
      question_answers: [
        {
          question_id: 1,
          question_sequence: 1,
          question_title: 'Q1 title',
          is_reflection: false,
          is_answered: true,
          answer_text: 'Very confident',
          answer_value: 4,
          max_score: 5,
        },
        {
          question_id: 2,
          question_sequence: 2,
          question_title: 'Q2 title',
          is_reflection: false,
          is_answered: false,
          answer_text: null,
          answer_value: null,
          max_score: 5,
        },
        {
          question_id: 3,
          question_sequence: 3,
          question_title: 'Reflection question',
          is_reflection: true,
          is_answered: true,
          answer_text: 'Some reflection',
          answer_value: null,
          max_score: null,
        },
      ],
    },
  },
  insights: [],
}

describe('AssessmentResults', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows loading state before data arrives', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => baseApiResponse,
    } as any)

    renderWithClient(<AssessmentResults instanceId="test-id" />)

    // loading state
    expect(screen.getByText(/Loading results/i)).toBeInTheDocument()

    // wait for data
    await waitFor(() =>
      expect(
        screen.getByText(/Assessment Results - Element A/i),
      ).toBeInTheDocument(),
    )
  })

  it('renders overall score visualization with correct percentage text', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => baseApiResponse,
    } as any)

    renderWithClient(<AssessmentResults instanceId="test-id" />)

    await waitFor(() =>
      expect(
        screen.getByText(/Assessment Results - Element A/i),
      ).toBeInTheDocument(),
    )

    const scoreElements = screen.getAllByText(/53.33%/)
    const scoreElement = scoreElements.find((el) =>
      el.classList.contains('score-percentage'),
    )
    expect(scoreElement).toBeTruthy()
  })

  it('filters question breakdown by answered/unanswered/reflection', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => baseApiResponse,
    } as any)

    renderWithClient(<AssessmentResults instanceId="test-id" />)

    await waitFor(() =>
      expect(screen.getByText(/Question Breakdown/i)).toBeInTheDocument(),
    )

    const select = screen.getByLabelText(/Filter questions/i)

    // All
    expect(screen.getByText(/Q1 title/)).toBeInTheDocument()
    expect(screen.getByText(/Q2 title/)).toBeInTheDocument()
    expect(screen.getByText(/Reflection question/)).toBeInTheDocument()

    // Answered
    fireEvent.change(select, { target: { value: 'answered' } })
    expect(screen.getByText(/Q1 title/)).toBeInTheDocument()
    expect(screen.queryByText(/Q2 title/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Reflection question/)).not.toBeInTheDocument()

    // Unanswered
    fireEvent.change(select, { target: { value: 'unanswered' } })
    expect(screen.getByText(/Q2 title/)).toBeInTheDocument()
    expect(screen.queryByText(/Q1 title/)).not.toBeInTheDocument()

    // Reflection
    fireEvent.change(select, { target: { value: 'reflection' } })
    expect(screen.getByText(/Reflection question/)).toBeInTheDocument()
    expect(screen.queryByText(/Q1 title/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Q2 title/)).not.toBeInTheDocument()
  })
})

