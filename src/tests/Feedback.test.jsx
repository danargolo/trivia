import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import Feedback from '../pages/Feedback'
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const INITIAL_STATE = {
  player: {
  name: 'Anderson',
  assertions: 5,
  score: 50,
  gravatarEmail: 'a@a.com',
  },
};

const INITIAL_STATE_2= {
  player: {
  name: 'Anderson',
  assertions: 2,
  score: 50,
  gravatarEmail: 'a@a.com',
  },
};

describe('Testa o component Feedback', () => {
  it('Testa o Header do Feedback', () => {
    renderWithRouterAndRedux(<Feedback />, INITIAL_STATE, '/feedback');

    const nameUser = screen.getByRole('heading', {name: /anderson/i, level: 2});
    const imgUser = screen.getByRole('img');
    const scoreTxt = screen.getByText('Score:');


    expect(nameUser).toBeInTheDocument();
    expect(imgUser).toHaveAttribute('src', 'https://www.gravatar.com/avatar/d10ca8d11301c2f4993ac2279ce4b930');
    expect(imgUser).toHaveAttribute('alt', 'profile');
    expect(scoreTxt).toBeInTheDocument();
    within(scoreTxt).getByText(/50/i);
  });

  it('Testa informações da página Feedback com mais de 3 assertions', () => {
    renderWithRouterAndRedux(<Feedback />, INITIAL_STATE, '/feedback');

    const fbText = screen.getByText(/Well Done!/i);
    const scoreTxt = screen.getByText(/sua pontuação foi:/i);
    const assertionTxt = screen.getByText(/você acertou:/i);
    const rankingBtn = screen.getByRole('button', { name: /ranking/i });
    const playAgainBtn = screen.getByRole('button', { name: /play again/i });

    expect(fbText).toBeInTheDocument();
    expect(scoreTxt).toBeInTheDocument();
    within(scoreTxt).getByText(/50/i);
    expect(assertionTxt).toBeInTheDocument();
    within(assertionTxt).getByText(/5/i);
    expect(rankingBtn).toBeInTheDocument();
    expect(playAgainBtn).toBeInTheDocument();
  })

  it('Testa informações da página Feedback com menos de 3 assertions', () => {
    renderWithRouterAndRedux(<Feedback />, INITIAL_STATE_2, '/feedback');

    const fbText = screen.getByText(/could be better\.\.\./i);
    expect(fbText).toBeInTheDocument();
  })

  it('Testa botão de ranking', async () => {
    const { history } = renderWithRouterAndRedux(<Feedback />, INITIAL_STATE, '/feedback');

    const rankingBtn = screen.getByRole('button', { name: /ranking/i });

    expect(rankingBtn).toBeInTheDocument();
    expect(rankingBtn).toBeEnabled();

    userEvent.click(rankingBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/ranking'));
  })

  it('Testa botão de PLay Again', async () => {
    const { history } = renderWithRouterAndRedux(<Feedback />, INITIAL_STATE, '/feedback');

    const playAgainBtn = screen.getByRole('button', { name: /play again/i });

    expect(playAgainBtn).toBeInTheDocument();
    expect(playAgainBtn).toBeEnabled();

    userEvent.click(playAgainBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/'));
  })
});