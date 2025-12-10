import { CommandResult } from "@leancodepl/cqrs-client-base"

export interface CqrsClient {
  createQuery<TQuery, TResult>(type: string): (dto: TQuery) => Promise<TResult>
  createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(
    type: string,
    errorCodes: TErrorCodes,
  ): (dto: TCommand) => Promise<CommandResult<TErrorCodes>>
}
