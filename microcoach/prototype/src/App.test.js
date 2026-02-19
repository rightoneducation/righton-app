import { fireEvent, render, screen } from '@testing-library/react';
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

  // The completed item should appear in the new Completed section.
  expect(screen.getByRole('heading', { name: /completed/i })).toBeInTheDocument();
  expect(screen.queryByText(/completed items will appear here/i)).not.toBeInTheDocument();
  expect(screen.getByText(/^Whole-class worked example \+ error spotlight$/i)).toBeInTheDocument();
  // Standard pill (learning objective)
  expect(screen.getByLabelText(/learning objective standard 8\.EE\.7/i)).toBeInTheDocument();

  // Navigate to “Your Intervention Patterns” and verify a trend card renders.
  fireEvent.click(screen.getByRole('button', { name: /^3\. reflect$/i }));
  expect(screen.getByText(/trends in learning goals/i)).toBeInTheDocument();
  expect(screen.queryByText(/no learning gaps yet/i)).not.toBeInTheDocument();
  expect(screen.getByText(/negative signs & distribution errors/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/learning objective standard 8\.EE\.7/i)).toBeInTheDocument();
});
