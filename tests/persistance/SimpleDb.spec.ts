import fs from 'fs';
import SimpleDb, {
  CollectionName,
  SubscriberDoc,
} from '../../src/persistance/SimpleDb';
import Loki from '@lokidb/loki';

jest.mock('fs');

const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

const memoryDb: Loki = new Loki('test.db');

function simpleDbFactory() {
  return new SimpleDb(memoryDb);
}

describe('SimpleDb mit loki', () => {
  beforeEach(async () => {
    await memoryDb.removeCollection(CollectionName.SUBSCRIBERS);
  });
  it('should add subscriber', async () => {
    const simpleDb = simpleDbFactory();
    const chatId = 111;
    const username = 'user.name';

    await simpleDb.addSubscriber(chatId, username);

    const collection = await memoryDb.getCollection<SubscriberDoc>(
      CollectionName.SUBSCRIBERS,
    );
    const count = await collection.count();
    expect(count).toEqual(1);
    collection.findOne({
      chatId: 1,
    });
    const doc = await collection.findOne({ chatId });
    expect(doc).toEqual(
      expect.objectContaining({
        chatId,
        username,
      }),
    );
  });
  it('should not double insert username', () => {
    const simpleDb = simpleDbFactory();
    const chatId = 111;
    const username = 'user.name';

    simpleDb.addSubscriber(chatId, username);
    simpleDb.addSubscriber(chatId, username);

    const collection = memoryDb.getCollection<SubscriberDoc>(
      CollectionName.SUBSCRIBERS,
    );
    expect(collection.count()).toEqual(1);
    expect(collection.findOne({ chatId })).toEqual(
      expect.objectContaining({
        chatId,
        username,
      }),
    );
  });
  it('should return all chat ids in array', async () => {
    readFileSyncSpy.mockReturnValue('');
    const collection = memoryDb.addCollection<SubscriberDoc>(
      CollectionName.SUBSCRIBERS,
    );
    collection.insert({ chatId: 111, username: 'user1' });
    collection.insert({ chatId: 222, username: 'user2' });
    const simpleDb = simpleDbFactory();

    const chatIds = simpleDb.getChatIdsLoki();

    expect(chatIds).toEqual([111, 222]);
  });
});
