import BotWrapper from '../../src/bot/BotWrapper';
import { Telegraf, Context } from 'telegraf';
import SimpleDb from '../../src/persistance/SimpleDb';
import CommandService from '../../src/bot/CommandService';

let botHandlers: {
  startHandler: (contextMock: Context) => void;
  hearsHandler: [regex: RegExp, cb: (ctx: Context) => Promise<void>];
} = {
  startHandler: () => {
    throw new Error('start handler is not set yet');
  },
  hearsHandler: [
    /./,
    () => {
      throw new Error('hears handler is not set yet');
    },
  ],
};

const sendMessageMock = jest.fn();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const botMock: Telegraf = {
  launch: jest.fn(),
  start: jest.fn().mockImplementation((cb) => {
    botHandlers.startHandler = cb;
  }),
  hears: jest.fn().mockImplementation((regex, cb) => {
    botHandlers.hearsHandler = [regex, cb];
  }),
  stop: jest.fn(),
  telegram: {
    sendMessage: sendMessageMock,
  },
} as Telegraf;

const triggerStart = async (contextMock: Context) => {
  await botHandlers.startHandler(contextMock);
};

const triggerHears = async (contextMock: Context) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (contextMock.message.text.match(botHandlers.hearsHandler[0])) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await botHandlers.hearsHandler[1](contextMock);
  }
};

const queryMock = jest.fn();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const commandServiceMock: CommandService = {
  query: queryMock,
};
function givenQueryReturns(result: unknown) {
  queryMock.mockResolvedValue(result);
}

const mockedGetChatIds = jest.fn().mockReturnValue([]);
const mockedGetChatIdsLoki = jest.fn().mockReturnValue([]);
const mockedAddSubscriber = jest.fn();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const simpleDbMock: SimpleDb = {
  addSubscriber: mockedAddSubscriber,
  getChatIdsLoki: mockedGetChatIdsLoki,
};

function givenChatIds(chatIds: number[]) {
  mockedGetChatIds.mockReturnValue(chatIds);
  mockedGetChatIdsLoki.mockReturnValue(chatIds);
}

function botWrapperFactory() {
  return new BotWrapper(botMock, simpleDbMock, commandServiceMock);
}

describe('BotWrapper', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
    botHandlers = {
      startHandler: () => {
        throw new Error('start handler is not set yet');
      },
      hearsHandler: [
        /./,
        () => {
          throw new Error('hears handler is not set yet');
        },
      ],
    };
  });

  it('should register bot commands and launch bot', async () => {
    const botWrapper = botWrapperFactory();
    await botWrapper.launchBot();

    expect(botMock.start).toHaveBeenCalledTimes(1);
    expect(botMock.hears).toHaveBeenCalledTimes(1);
    expect(botMock.launch).toHaveBeenCalledTimes(1);
  });

  it('should gracefully stop bot on interrupt signal', async () => {
    const signals: { [key: string]: () => void } = {};
    const onceMock = jest
      .spyOn(process, 'once')
      .mockImplementation((eventName, cb) => {
        signals[eventName] = cb as () => void;
        return process;
      });
    const botWrapper = botWrapperFactory();
    await botWrapper.launchBot();

    signals['SIGINT']();

    expect(botMock.stop).toHaveBeenCalledTimes(1);

    onceMock.mockReset();
  });

  it('should gracefully stop bot on terminate signal', async () => {
    const signals: { [key: string]: () => void } = {};
    const onceMock = jest
      .spyOn(process, 'once')
      .mockImplementation((eventName, cb) => {
        signals[eventName] = cb as () => void;
        return process;
      });
    const botWrapper = botWrapperFactory();
    await botWrapper.launchBot();

    signals['SIGTERM']();

    expect(botMock.stop).toHaveBeenCalledTimes(1);

    onceMock.mockReset();
  });

  it('should add subscriber id on start command', async () => {
    const botWrapper = botWrapperFactory();
    await botWrapper.launchBot();
    const FIRST_NAME = 'FIRST NAME';
    const USERNAME = 'USERNAME';
    const CHAT_ID = 123;
    const contextMock = {
      reply: jest.fn(),
      message: {
        from: {
          first_name: FIRST_NAME,
          username: USERNAME,
        },
        chat: {
          id: CHAT_ID,
        },
      },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await triggerStart(contextMock as Context);

    expect(contextMock.reply).toHaveBeenCalledWith(`Hi ${FIRST_NAME}!`);
    expect(simpleDbMock.addSubscriber).toHaveBeenCalledWith(CHAT_ID, USERNAME);
  });

  it('should analyse text when bot hears text', async () => {
    const botWrapper = botWrapperFactory();
    await botWrapper.launchBot();
    const MESSAGE_TEXT = 'TEXT';
    const contextMock = {
      reply: jest.fn(),
      message: {
        text: MESSAGE_TEXT,
      },
    };
    givenQueryReturns([]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await triggerHears(contextMock);

    expect(commandServiceMock.query).toHaveBeenCalledWith(MESSAGE_TEXT);
  });

  it('should reply for each message returned from command service query', async () => {
    const botWrapper = botWrapperFactory();
    givenQueryReturns(['message1', 'message2']);
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

  it('should send message to all registered users', async () => {
    const botWrapper = botWrapperFactory();
    givenChatIds([11, 22, 33]);
    const MESSAGE = 'message';

    await botWrapper.sendToAll(MESSAGE);

    expect(simpleDbMock.getChatIdsLoki).toHaveBeenCalled();
    expect(sendMessageMock).toHaveBeenCalledTimes(3);
    expect(sendMessageMock).toHaveBeenCalledWith(11, MESSAGE, {
      parse_mode: 'HTML',
    });
    expect(sendMessageMock).toHaveBeenCalledWith(22, MESSAGE, {
      parse_mode: 'HTML',
    });
    expect(sendMessageMock).toHaveBeenCalledWith(33, MESSAGE, {
      parse_mode: 'HTML',
    });
  });

  it('should notify all subscribers for bookable saturdays', async () => {
    const botWrapper = botWrapperFactory();
    const ANSWER = 'answer1';
    const sendToAllSpy = jest.spyOn(botWrapper, 'sendToAll');
    givenQueryReturns([ANSWER]);

    await botWrapper.notifySubscribersForBookableSaturdays();

    expect(commandServiceMock.query).toHaveBeenCalledWith('saturday');
    expect(sendToAllSpy).toHaveBeenCalledWith(ANSWER);
  });
});
