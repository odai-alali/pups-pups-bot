import BotWrapper from '../../src/bot/BotWrapper';
import HtmlParser from '../../src/parser/HtmlParser';

describe('BotWrapper', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should register bot commands and launch bot', async () => {
    const commandMock = jest.fn();
    const startMock = jest.fn();
    const launchMock = jest.fn();
    const bot = {
      command: commandMock,
      start: startMock,
      launch: launchMock,
    };
    const botWrapper = BotWrapper.getInstance();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await botWrapper.launchBot(bot, new HtmlParser());
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
