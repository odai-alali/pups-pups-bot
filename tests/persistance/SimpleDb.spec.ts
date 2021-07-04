import fs from 'fs';
import SimpleDb, { CHAT_IDS_FILE } from '../../src/persistance/SimpleDb';

jest.mock('fs');

const existSyncSpy = jest.spyOn(fs, 'existsSync');
const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
const writeFileSync = jest.spyOn(fs, 'writeFileSync');

describe('SimpleDb', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    existSyncSpy.mockRestore();
    existSyncSpy.mockRestore();
    writeFileSync.mockRestore();
  });

  it('should create db file if does not exist', () => {
    existSyncSpy.mockReturnValue(false);
    readFileSyncSpy.mockReturnValue('');

    new SimpleDb();

    expect(writeFileSync).toHaveBeenCalledWith(CHAT_IDS_FILE, '');
  });

  it('should load db file', () => {
    existSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue('1\n2');
    const simpleDb = new SimpleDb();

    const chatIds = simpleDb.getChatIds();

    expect(existSyncSpy).toHaveBeenCalledWith(CHAT_IDS_FILE);
    expect(readFileSyncSpy).toHaveBeenCalledWith(CHAT_IDS_FILE, 'utf-8');
    expect(chatIds).toEqual([1, 2]);
  });

  it('should add chat id to the db', () => {
    const CHAT_ID = 111;
    existSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue('');
    const simpleDb = new SimpleDb();

    simpleDb.addChatId(CHAT_ID);

    expect(writeFileSync).toHaveBeenCalledWith(CHAT_IDS_FILE, `${CHAT_ID}`);
  });

  it('should not write file if chat id already exists', () => {
    const CHAT_ID = 111;
    existSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(`${CHAT_ID}`);
    const simpleDb = new SimpleDb();

    simpleDb.addChatId(CHAT_ID);

    expect(writeFileSync).not.toHaveBeenCalled();
  });
});
