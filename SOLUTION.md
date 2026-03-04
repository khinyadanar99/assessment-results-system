# Solution - [Chloe Aung]

## Task Completed
Frontend

## Time Spent
5 hours

## Approach
My approach was to first understand the requirements and focus on presenting the data in a way that is easy to understand visually. Since the task mainly involved displaying and analysing question scores, I focused on improving data visualization and making the interface easier to review.

I structured the frontend so that users can quickly see overall results, identify score patterns, and review individual question details. I prioritized clear visual components and simple filtering features so users can easily navigate through the data.

## Implementation Details
I used the built-in JavaScript `fetch` API instead of Axios for making API requests. Since `fetch` is already available in modern browsers, it avoids adding an extra dependency and helps keep the project lightweight.

I improved the overall score display by replacing the original text-based output with a gauge chart. Previously, the score was shown as text with color coding based on thresholds. The gauge chart makes it easier to visually understand where the score falls within the threshold ranges.

I also added a bar chart to display scores for each question, excluding reflection-type questions. This makes it easier to compare the scores across questions and quickly identify which questions have the highest and lowest scores. This helps highlight areas that may need improvement.

In addition, I implemented a question breakdown section with filtering options such as answered questions, unanswered questions, and reflection questions. The questions are displayed in a list format with an expandable detail view. When expanded, users can see the answer and additional details. This keeps the interface clean while still allowing users to access more detailed information when needed.

## Tools & Libraries Used
- MaterialUI
- Tanstack query
- recharts

- AI tools used: ChatGPT and Cursor
  - I used ChatGPT to discuss ideas and for brainstorming.
  - I used Cursor to help identify errors and assist with implementing some additional features.

## Testing
I do not have much prior experience writing frontend tests, so I used Cursor to help generate the initial test structure based on the behaviors I wanted to verify.

I mainly focused on testing key UI behaviors such as whether components render correctly, whether data from the API is displayed properly, and whether filtering works as expected. Using Vitest and React Testing Library, I tested scenarios like loading states, displaying the overall score, and filtering questions by type (answered, unanswered, and reflection).

These tests help confirm that the main components behave correctly when data is loaded and when users interact with the filtering functionality.

## Challenges & Solutions
One challenge was deciding how to present the score information in a way that is easy to interpret. The original text-based score display did not clearly show how the score relates to the threshold levels. I addressed this by switching to a gauge chart, which provides a clearer visual representation.

## Trade-offs & Future Improvements
With more time, I would improve test coverage and write tests manually instead of relying mostly on AI-assisted generation. This would help ensure better reliability and deeper understanding of the testing process.
