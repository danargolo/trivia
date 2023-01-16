import { screen } from '@testing-library/react';
import Settings from '../pages/Settings';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';

const INITIAL_STATE = {};

describe('<Settings/>', () => {
  it('Testa se a página Settings foi renderizada', () => {
    renderWithRouterAndRedux(<Settings/>, INITIAL_STATE, '/settings');

    const settingsTxt = screen.getByRole('heading', {name: 'Settings', level: 1});

    expect(settingsTxt).toBeInTheDocument();
  })
})