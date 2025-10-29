import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CityForm } from './CityForm';

describe('CityForm', () => {
  describe('Create Mode', () => {
    it('should render name, country, and optional rating fields', () => {
      const onSubmit = vi.fn();
      render(<CityForm mode="create" onSubmit={onSubmit} />);

      expect(screen.getByLabelText(/city name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tourist rating.*optional/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should submit form with name, country, and rating', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CityForm mode="create" onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/city name/i), 'Paris');
      await user.type(screen.getByLabelText(/country/i), 'France');
      await user.type(screen.getByLabelText(/tourist rating/i), '4');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
        const callArgs = onSubmit.mock.calls[0][0];
        expect(callArgs).toMatchObject({
          name: 'Paris',
          country: 'France',
          touristRating: 4,
        });
      });
    });

    it('should submit form without rating (optional)', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CityForm mode="create" onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/city name/i), 'Paris');
      await user.type(screen.getByLabelText(/country/i), 'France');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
        const callArgs = onSubmit.mock.calls[0][0];
        expect(callArgs).toMatchObject({
          name: 'Paris',
          country: 'France',
          touristRating: 0, // Empty number input with coercion returns 0
        });
      });
    });

    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CityForm mode="create" onSubmit={onSubmit} />);

      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        const errorMessages = screen.getAllByText(/required/i);
        expect(errorMessages).toHaveLength(2); // One for name, one for country
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should populate form with default values', () => {
      const onSubmit = vi.fn();
      const defaultValues = {
        id: '1',
        name: 'Paris',
        country: 'France',
        touristRating: 4,
      };

      render(<CityForm mode="create" onSubmit={onSubmit} defaultValues={defaultValues} />);

      expect(screen.getByLabelText(/city name/i)).toHaveValue('Paris');
      expect(screen.getByLabelText(/country/i)).toHaveValue('France');
      expect(screen.getByLabelText(/tourist rating/i)).toHaveValue(4);
    });
  });

  describe('Edit Mode', () => {
    it('should only render rating field in edit mode', () => {
      const onSubmit = vi.fn();
      render(<CityForm mode="edit" onSubmit={onSubmit} />);

      expect(screen.queryByLabelText(/city name/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/country/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/tourist rating \(0-5\)/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should submit form with updated rating', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const defaultValues = {
        id: '1',
        name: 'Paris',
        country: 'France',
        touristRating: 4,
      };

      render(<CityForm mode="edit" onSubmit={onSubmit} defaultValues={defaultValues} />);

      const ratingInput = screen.getByLabelText(/tourist rating/i);
      await user.clear(ratingInput);
      await user.type(ratingInput, '5');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
        const callArgs = onSubmit.mock.calls[0][0];
        expect(callArgs).toMatchObject({
          touristRating: 5,
        });
      });
    });

    it('should pre-fill rating from default values', () => {
      const onSubmit = vi.fn();
      const defaultValues = {
        id: '1',
        name: 'Paris',
        country: 'France',
        touristRating: 3,
      };

      render(<CityForm mode="edit" onSubmit={onSubmit} defaultValues={defaultValues} />);

      expect(screen.getByLabelText(/tourist rating/i)).toHaveValue(3);
    });
  });

  describe('Form Reset on Default Values Change', () => {
    it('should update form when defaultValues change', async () => {
      const onSubmit = vi.fn();
      const { rerender } = render(
        <CityForm
          mode="edit"
          onSubmit={onSubmit}
          defaultValues={{
            id: '1',
            name: 'Paris',
            country: 'France',
            touristRating: 4,
          }}
        />,
      );

      expect(screen.getByLabelText(/tourist rating/i)).toHaveValue(4);

      // Update default values
      rerender(
        <CityForm
          mode="edit"
          onSubmit={onSubmit}
          defaultValues={{
            id: '1',
            name: 'Paris',
            country: 'France',
            touristRating: 5,
          }}
        />,
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/tourist rating/i)).toHaveValue(5);
      });
    });
  });
});
