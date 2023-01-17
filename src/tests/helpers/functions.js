import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DATA_TEST_BTN_PLAY, DATA_TEST_INPUT_EMAIL, DATA_TEST_INPUT_NAME, PLAYER_EMAIL, PLAYER_NAME } from "../constants";

export const writeName = () => {
  const INPUT_NAME = screen.getByTestId(DATA_TEST_INPUT_NAME);
  expect(INPUT_NAME).toBeInTheDocument()
  userEvent.type(INPUT_NAME, PLAYER_NAME);
  return INPUT_NAME;
}

export const writeWrongName = () => {}

export const writeEmail = () => {
  const INPUT_EMAIL = screen.getByTestId(DATA_TEST_INPUT_EMAIL);
  expect(INPUT_EMAIL).toBeInTheDocument()
  userEvent.type(INPUT_EMAIL, PLAYER_EMAIL);
  return INPUT_EMAIL;
};

export const writeWrongEmail = () => {};

export const loginSuccess = () => {
  const BTN_PLAY = screen.getByTestId(DATA_TEST_BTN_PLAY);
  expect(BTN_PLAY).toBeDisabled();
  const INPUT_NAME = writeName();
  const INPUT_EMAIL = writeEmail();
  expect(BTN_PLAY).not.toBeDisabled();
  userEvent.click(BTN_PLAY);
  return { INPUT_NAME, INPUT_EMAIL };
};

export const resposeCorrectAnswers = async (times) => {
  for (let index = 1; index <= times; index += 1) {
    const correct = await screen.findByTestId('correct-answer');
    userEvent.click(correct);
    const nextButton = await screen.findByTestId('btn-next');
    userEvent.click(nextButton);
  }
};
