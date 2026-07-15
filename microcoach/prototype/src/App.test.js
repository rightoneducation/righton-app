import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // This project is no longer the CRA starter page; assert core dashboard chrome renders.
  expect(screen.getByText(/microcoach/i)).toBeInTheDocument();
  // Overview section navigation uses the new 3-step flow labels.
  expect(screen.getByRole('button', { name: /1\. understand\s*&\s*select/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /2\. prepare/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /3\. reflect/i })).toBeInTheDocument();
});

test('renders misconception summaries and occurrence indicators', () => {
  render(<App />);
  
  // Check for the main misconception summary
  expect(
    screen.getByText(
      /Students incorrectly distribute negative signs, treating them as attached to only one term/i
    )
  ).toBeInTheDocument();
  
  // Check for occurrence indicators
  expect(screen.getByText(/1st occurrence/i)).toBeInTheDocument();
  expect(screen.getByText(/2nd occurrence/i)).toBeInTheDocument();
  // Success indicators are shown inside the Full View modal, so we don't assert them on the card.
});

test('Intervention Patterns shows trends after completing next steps', () => {
  jest.useFakeTimers();
  render(<App />);

  // Add a recommended activity to “Saved Next Steps”.
  const addButtons = screen.getAllByRole('button', { name: /add to saved next steps/i });
  expect(addButtons.length).toBeGreaterThan(0);
  fireEvent.click(addButtons[0]);

  // Navigate to “Saved Next Steps” and complete the single item.
  fireEvent.click(screen.getByRole('button', { name: /^2\. prepare$/i }));
  const completeBtn = screen.getByRole('button', { name: /complete next step/i });
  expect(completeBtn).toBeEnabled();
  fireEvent.click(completeBtn);

  // Completion now animates out toward “3. Reflect”.
  expect(screen.getByText(/moving to reflect/i)).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(800);
  });
  // User stays on Prepare after completion (no auto-navigation).
  expect(screen.getByText(/saved next steps/i)).toBeInTheDocument();
  expect(screen.queryByText(/next steps you implemented/i)).not.toBeInTheDocument();

  // Navigate to Reflect manually and verify the completed item is reflected in trends.
  fireEvent.click(screen.getByRole('button', { name: /^3\. reflect$/i }));
  expect(screen.getByText(/next steps you implemented/i)).toBeInTheDocument();
  expect(screen.queryByText(/no learning gaps yet/i)).not.toBeInTheDocument();
  expect(screen.getByText(/negative signs & distribution errors/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/learning objective standard 8\.EE\.7/i)).toBeInTheDocument();

  jest.useRealTimers();
});
