import BotWrapper from '../../src/bot/BotWrapper';
import { Telegraf, Context } from 'telegraf';
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

const queryMock = jest.fn();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const commandServiceMock: CommandService = {
  query: queryMock,
};
function givenQueryRetourns(result: unknown) {
  queryMock.mockResolvedValue(result);
}

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

  it('should reply for each message returned from command service query', async () => {
    const botWrapper = botWrapperFactory();
    givenQueryRetourns(['message1', 'message2']);
    const contextMock = {
      reply: jest.fn(),
      message: {},
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await botWrapper.onTextCommand(contextMock as Context);

    expect(contextMock.reply).toHaveBeenCalledTimes(2);
    expect(contextMock.reply).toHaveBeenCalledWith('message1', {
      parse_mode: 'HTML',
    });
    expect(contextMock.reply).toHaveBeenCalledWith('message2', {
      parse_mode: 'HTML',
    });
  });
});
