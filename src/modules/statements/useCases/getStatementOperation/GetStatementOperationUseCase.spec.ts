import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let createUser: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let userId: string

let createStatement: CreateStatementUseCase
let getStatementOperation: GetStatementOperationUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let statementId: string

describe("Statement operation", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatement = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperation = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

    const { id: user_id = "" } = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@ignite.com.br",
      password: "123456"
    })

    userId = user_id

    const { id: statement_id = "" } = await createStatement.execute({
      user_id: userId,
      amount: 500,
      description: "This is a deposit statement",
      type: OperationType.DEPOSIT
    })

    statementId = statement_id
  })

  it("Should get statement operation from user", async () => {
    const operation = await getStatementOperation.execute({
      user_id: userId,
      statement_id: statementId
    })

    expect(operation.amount).toEqual(500)
  })

  it("Should not get statement operation from user if it does not exist", async () => {
    expect(async () => {
      await getStatementOperation.execute({
        user_id: "userId",
        statement_id: statementId
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should not get statement operation from user if that does not exist", async () => {
    expect(async () => {
      await getStatementOperation.execute({
        user_id: userId,
        statement_id: "statementId"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

})
