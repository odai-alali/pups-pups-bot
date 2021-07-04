import fs from 'fs';
import path from 'path';

// const OLD_CHAT_IDS_FILE = path.resolve(__dirname + '/../_data/chatIds');

export const CHAT_IDS_FILE = path.resolve(__dirname + '/../../_data/chatIds');

class SimpleDb {
  private readonly chatIds: number[];

  constructor() {
    // this.migrateFromOldFile();
    this.chatIds = this.loadChatIds();
  }

  private static createChatIdsIfNotExists() {
    if (!fs.existsSync(CHAT_IDS_FILE)) {
      fs.writeFileSync(CHAT_IDS_FILE, '');
    }
  }

  public getChatIds(): number[] {
    return this.chatIds;
  }

  public addChatId(id: number): void {
    if (this.chatIds.includes(id)) return;
    this.chatIds.push(id);
    fs.writeFileSync(CHAT_IDS_FILE, this.chatIds.join('\n'));
  }

  private loadChatIds(): number[] {
    SimpleDb.createChatIdsIfNotExists();
    const content = fs.readFileSync(CHAT_IDS_FILE, 'utf-8');
    return content
      .split('\n')
      .map((id) => parseFloat(id))
      .filter((id) => !isNaN(id));
  }
}

export default SimpleDb;
