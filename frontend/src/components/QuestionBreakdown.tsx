import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

interface QuestionData {
  question_id: number | string
  question_sequence?: number
  question_title?: string | null
  answer_text?: string | null
  answer_value?: number | null
  max_score?: number | null
  is_answered?: boolean
}

interface QuestionBreakdownProps {
  question: QuestionData
}

export default function QuestionBreakdown({ question }: QuestionBreakdownProps) {
  const {
    question_sequence,
    question_title,
    answer_text,
    answer_value,
    max_score,
    is_answered,
  } = question

  const displayAnswer =
    is_answered && answer_text
      ? answer_text
      : is_answered
        ? 'No option selected'
        : 'Not answered'

  const scoreLabel =
    is_answered && answer_value != null && max_score != null
      ? `${answer_value} / ${max_score}`
      : max_score != null
        ? `0 / ${max_score}`
        : '-'

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <h4>
          Question {question_sequence ?? ''}: {question_title ?? ''}
        </h4>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          <b>Answer:</b> {displayAnswer}
        </p>
        <p>
          <b>Score:</b> {scoreLabel}
        </p>
      </AccordionDetails>
    </Accordion>
  )
}

