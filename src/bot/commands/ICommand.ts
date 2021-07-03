import { Context } from 'telegraf';

interface ICommand {
  command: (ctx: Context) => Promise<void>;
}

export default ICommand;
