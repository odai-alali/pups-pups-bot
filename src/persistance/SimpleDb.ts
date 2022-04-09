import { Collection, Loki } from '@lokidb/loki';
import { hashCode } from '../utils';

export enum CollectionName {
  SUBSCRIBERS = 'subscribers',
}

export declare type SentAnswerHash = {
  date: Date;
  hash: number;
};

export declare type SubscriberDoc = {
  chatId: number;
  username: string;
  sentAnswersHashes: SentAnswerHash[];
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
      subscriberCollection.insert({ chatId, username, sentAnswersHashes: [] });
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

  getAllChatIds(): number[] {
    const subscriberCollection = this.getSubscriberCollection();

    return subscriberCollection.find().map((subscriber) => subscriber.chatId);
  }

  addAnswerHashForChatId(id: number, answer: string): void {
    this.getSubscriberCollection().findAndUpdate(
      { chatId: id },
      (subscriber) => {
        subscriber.sentAnswersHashes.push({
          date: new Date(),
          hash: hashCode(answer),
        });
      },
    );
  }

  answerHashExists(id: number, answer: string): boolean {
    const subscriber = this.getSubscriberCollection().findOne({ chatId: id });
    if (subscriber) {
      return (
        subscriber.sentAnswersHashes.findIndex(
          (sentAnswerHash) => sentAnswerHash.hash === hashCode(answer),
        ) > -1
      );
    }
    return false;
  }
}

export default SimpleDb;
