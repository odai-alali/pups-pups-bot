import { Collection, Loki } from '@lokidb/loki';

export enum CollectionName {
  SUBSCRIBERS = 'subscribers',
}

export declare type SubscriberDoc = {
  chatId: number;
  username: string;
};

class SimpleDb {
  private readonly dbInstance: Loki;
  constructor(dbInstance: Loki) {
    this.dbInstance = dbInstance;
  }

  addSubscriber(chatId: number, username: string): void {
    const subscriberCollection = this.getSubscriberCollection();
    const existingSubscriber = subscriberCollection.by('username', username);

    if (existingSubscriber) {
      existingSubscriber.chatId = chatId;
      subscriberCollection.update(existingSubscriber);
    } else {
      subscriberCollection.insert({ chatId, username });
    }
  }

  private getSubscriberCollection(): Collection<SubscriberDoc> {
    const collection = this.dbInstance.getCollection<SubscriberDoc>(
      CollectionName.SUBSCRIBERS,
    );
    if (!collection) {
      return this.dbInstance.addCollection<SubscriberDoc>(
        CollectionName.SUBSCRIBERS,
        {
          unique: ['username'],
        },
      );
    }
    return collection;
  }

  getChatIdsLoki(): number[] {
    const subscriberCollection = this.getSubscriberCollection();

    return subscriberCollection.find().map((subscriber) => subscriber.chatId);
  }
}

export default SimpleDb;
