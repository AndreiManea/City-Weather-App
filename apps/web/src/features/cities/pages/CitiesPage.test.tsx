import { afterAll, afterEach, beforeAll, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/browser';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { BrowserRouter } from 'react-router-dom';
import { CitiesPage } from './CitiesPage';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('searches and shows results', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CitiesPage />
      </BrowserRouter>
    </QueryClientProvider>,
  );

  const input = screen.getByPlaceholderText(/search cities/i);
  await userEvent.type(input, 'Paris');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));

  await waitFor(() => expect(screen.getByRole('heading', { name: 'Paris' })).toBeInTheDocument());
  expect(screen.getByText('France')).toBeInTheDocument();
  expect(screen.getByText(/FR \/ FRA/i)).toBeInTheDocument();
});
