import BotWrapper from '../../src/bot/BotWrapper';
import { Telegraf } from 'telegraf';
import SimpleDb from '../../src/persistance/SimpleDb';

const commandMock = jest.fn();
const startMock = jest.fn();
const launchMock = jest.fn();

jest.mock('telegraf', () => ({
  Telegraf: () => ({
    command: commandMock,
    start: startMock,
    launch: launchMock,
  }),
}));

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
    jest.mock('telegraf', () => ({
      Telegraf: () => ({
        command: commandMock,
        start: startMock,
        launch: launchMock,
      }),
    }));

    const botWrapper = new BotWrapper(new Telegraf('token'), new SimpleDb());
    await botWrapper.launchBot();
    expect(startMock).toHaveBeenCalledTimes(1);
    expect(launchMock).toHaveBeenCalledTimes(1);
    expect(commandMock).toHaveBeenCalledTimes(6);
    expect(commandMock).toHaveBeenCalledWith('/monday', expect.any(Function));
    expect(commandMock).toHaveBeenCalledWith('/tuesday', expect.any(Function));
    expect(commandMock).toHaveBeenCalledWith(
      '/wednesday',
      expect.any(Function),
    );
    expect(commandMock).toHaveBeenCalledWith('/thursday', expect.any(Function));
    expect(commandMock).toHaveBeenCalledWith('/friday', expect.any(Function));
    expect(commandMock).toHaveBeenCalledWith('/saturday', expect.any(Function));
  });
});
