import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // This project is no longer the CRA starter page; assert core dashboard chrome renders.
  expect(screen.getByText(/microcoach/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /recommended next steps/i })).toBeInTheDocument();
});

test('renders misconception summaries and occurrence indicators', () => {
  render(<App />);
  
  // Check for the main misconception summary
  expect(screen.getByText(/Students are making conceptual errors when distributing negative signs/i)).toBeInTheDocument();
  
  // Check for occurrence indicators
  expect(screen.getByText(/1st occurrence/i)).toBeInTheDocument();
  expect(screen.getByText(/2nd occurrence/i)).toBeInTheDocument();
  
  // Check for success indicators
  expect(screen.getAllByText(/Success indicators/i)).toHaveLength(1);
  expect(screen.getByText(/Correctly distribute negative signs to all terms within parentheses/i)).toBeInTheDocument();
});

test('Intervention Patterns shows trends after completing next steps', () => {
  render(<App />);

  // Add a recommended activity to “Your Next Steps”.
  const addButtons = screen.getAllByRole('button', { name: /add to your next steps/i });
  expect(addButtons.length).toBeGreaterThan(0);
  fireEvent.click(addButtons[0]);

  // Navigate to “Your Next Steps” and complete the single item.
  fireEvent.click(screen.getByRole('button', { name: /^your next steps$/i }));
  const completeBtn = screen.getByRole('button', { name: /complete next step/i });
  expect(completeBtn).toBeEnabled();
  fireEvent.click(completeBtn);

  // Navigate to “Your Intervention Patterns” and verify a trend card renders.
  fireEvent.click(screen.getByRole('button', { name: /^your intervention patterns$/i }));
  expect(screen.getByText(/trends in learning goals/i)).toBeInTheDocument();
  expect(screen.queryByText(/no learning gaps yet/i)).not.toBeInTheDocument();
  expect(screen.getByText(/negative signs & distribution errors/i)).toBeInTheDocument();
});
