import BotWrapper from '../../src/bot/BotWrapper';
import { Telegraf } from 'telegraf';
import SimpleDb from '../../src/persistance/SimpleDb';
import CommandService from '../../src/bot/CommandService';

const commandMock = jest.fn();
const startMock = jest.fn();
const launchMock = jest.fn();
const onMock = jest.fn();
const hearsMock = jest.fn();

jest.mock('telegraf', () => ({
  Telegraf: () => ({
    command: commandMock,
    start: startMock,
    launch: launchMock,
    on: onMock,
    hears: hearsMock,
  }),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const commandServiceMock: CommandService = {
  query: jest.fn(),
};

function botWrapperFactory() {
  return new BotWrapper(
    new Telegraf('token'),
    new SimpleDb(),
    commandServiceMock,
  );
}

describe('BotWrapper', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  afterEach(() => {
    commandMock.mockClear();
    startMock.mockClear();
    launchMock.mockClear();
  });

  it('should register bot commands and launch bot', async () => {
    const botWrapper = botWrapperFactory();
    await botWrapper.launchBot();

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(launchMock).toHaveBeenCalledTimes(1);
  });

  it('should have command service on text', async () => {
    const botWrapper = botWrapperFactory();
    await botWrapper.launchBot();

    expect(hearsMock).toHaveBeenCalledWith(
      expect.any(RegExp),
      expect.any(Function),
    );
  });
});
