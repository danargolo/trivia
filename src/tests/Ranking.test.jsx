import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Ranking from '../pages/Ranking';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';

const players = [
  {name: 'User1', score:50, picture:'user1@u.com'},
  {name: 'User2', score:55, picture:'user2@u.com'},
  {name: 'User3', score:60, picture:'user3@u.com'},
  {name: 'User4', score:56, picture:'user4@u.com'}
].sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA);

describe('Testa a tela de Ranking', () => {
  localStorage.setItem('ranking', JSON.stringify(players));
  
  it('Testa se a página Ranking foi renderizada', () => {
    renderWithRouterAndRedux(<Ranking />);

    const rankingText = screen.getByText(/Ranking/i);
    const buttonHome = screen.getByRole('button', {name: 'Início'})

    expect(rankingText).toBeInTheDocument();
    expect(buttonHome).toBeInTheDocument();
  })
  it('Testa se o button redireciona ao Login', () => {
    const { history } = renderWithRouterAndRedux(<Ranking />);

    const buttonHome = screen.getByRole('button', {name: 'Início'})

    userEvent.click(buttonHome)
    expect(history.location.pathname).toBe('/')
  })
  it('Testa se o ranking com pontuações é renderizado', () => {
    renderWithRouterAndRedux(<Ranking />);

    players.forEach((player, index) => {
      const score = screen.getByTestId(`player-score-${index}`)

      expect(score).toHaveTextContent(player.score);
    })
  })
})