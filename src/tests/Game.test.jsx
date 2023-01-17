import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import Game from "../pages/Game";
import { questionsResponse, tokenResponse } from "./constants";
import { loginSuccess, resposeCorrectAnswers } from "./helpers/functions";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";

const INITIAL_STATE = {
  player: {
  name: 'Anderson',
  assertions: 5,
  score: 50,
  gravatarEmail: 'a@a.com',
  },
};

const INITIAL_STATE_2 = {
  player: {
  name: 'Anderson',
  assertions: 0,
  score: 0,
  gravatarEmail: 'a@a.com',
  },
};

const array = Array(5).fill('');

const ranking = [
  {name: 'User1', score:346, picture:'user1@u.com'},
  {name: 'User2', score:345, picture:'user2@u.com'},
  {name: 'User3', score:320, picture:'user3@u.com'},
  {name: 'User4', score:350, picture:'user4@u.com'}
];

describe('[TELA DE GAME] - Testando a tela de Game.', () => {
  afterEach(() => jest.clearAllMocks())

  jest.setTimeout(33000)
  test('Testa se é renderizado a primeira pergunta;', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(questionsResponse) ,
    }));

    renderWithRouterAndRedux(<Game />);

    const tag = await screen.findByTestId('question-category');
    const question = await screen.findByTestId('question-text')
    const options = await screen.findByTestId('answer-options')

    expect(tag).toHaveTextContent(questionsResponse.results[0].category);
    expect(question).toHaveTextContent(questionsResponse.results[0].question);
    expect(options.children).toHaveLength(2);
  });

  test('Testa se existe um elemento com testId question-text', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(questionsResponse) ,
    }));

    renderWithRouterAndRedux(<Game />);

    const question = await screen.findByTestId('question-text')

    expect(question).toBeInTheDocument();

  });

  test('Testa se existe um elemento com testId answer-options', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(questionsResponse) ,
    }));

    renderWithRouterAndRedux(<Game />);

    const answer = await screen.findByTestId('answer-options')

    expect(answer).toBeInTheDocument();


  });

  test('Testa se e renderizado um botao com texto next', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(questionsResponse) ,
    }));

    renderWithRouterAndRedux(<Game />);

    const answer = await screen.findByTestId('correct-answer')
    userEvent.click(answer);
    const idBtn = await screen.findByTestId('btn-next')
    const button = await screen.findByRole('button', {name: /next/i,});

    expect(button).toBeInTheDocument();
    expect(idBtn).toBeInTheDocument();

  });

  test('', () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(questionsResponse) ,
    }));

    const { history } =  renderWithRouterAndRedux(<App />, INITIAL_STATE, '/game');


    const { pathname } = history.location;

    expect(pathname).toBe('/game');

  });

  test('Testa se ao acessar com um token invalido é redirecionado para a página inicial;', async () => {
    global.fetch = jest.fn((param) => Promise.resolve({
      json: () => param === `https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`
      ? Promise.resolve({...questionsResponse, results: []}) : Promise.resolve(tokenResponse),
    }));

    const { history } = renderWithRouterAndRedux(<App />);

    loginSuccess();

    await waitFor(() => { expect(history.location.pathname).toBe('/game') })
    await waitFor(() => { expect(history.location.pathname).toBe('/') })
  })

  test('Testa se após responder 5 pergutas é redirecionado para a página de feedback;', async () => {
    global.fetch = jest.fn((param) => Promise.resolve({
      json: () => param === `https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`
      ? Promise.resolve(questionsResponse) : Promise.resolve(tokenResponse),
    }));

    const { history } = renderWithRouterAndRedux(<App />);

    loginSuccess();

    await waitFor(() => { expect(history.location.pathname).toBe('/game') })

    await resposeCorrectAnswers(5);
    await waitFor(() => { expect(history.location.pathname).toBe('/feedback') })
  })

  test('', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(questionsResponse) ,
    }));

    renderWithRouterAndRedux(<Game />);

    await waitFor(async () => {
      const nextButton = await screen.findByTestId('btn-next');
      expect(nextButton).toBeInTheDocument();
    }, { timeout: 33000 })
  });

  test('Testa se sort devolve o array ordenado pela maior pontuação', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(questionsResponse) ,
    }));
    localStorage.setItem('ranking', JSON.stringify(ranking));

    global.fetch = jest.fn((param) => Promise.resolve({
      json: () => param === `https://opentdb.com/api.php?amount=5&token=${tokenResponse.token}`
      ? Promise.resolve(questionsResponse) : Promise.resolve(tokenResponse),
    }));

    renderWithRouterAndRedux(<App />);

    loginSuccess();

    await resposeCorrectAnswers(5);

    const rank = JSON.parse(localStorage.getItem('ranking'));

    expect(rank[0].score).toBe(350);
    expect(rank[0].name).toBe('User4');

    expect(rank[1].score).toBe(350);
    expect(rank[1].name).toBe('Nome da pessoa');

    expect(rank[2].score).toBe(346);
    expect(rank[2].name).toBe('User1');


  });
});


