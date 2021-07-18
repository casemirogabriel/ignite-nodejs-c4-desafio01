import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createUser: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let userId: string

let createStatement: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository

describe("Statement creation", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatement = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

    const { id = "" } = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@ignite.com.br",
      password: "123456"
    })

    userId = id
  })

  it("Should create a statement", async () => {
    const statement = await createStatement.execute({
      user_id: userId,
      amount: 100,
      description: "This is a deposit statement",
      type: OperationType.DEPOSIT
    })

    expect(statement).toHaveProperty("id")
  })

  it("Should not create a statement if user does not exist", async () => {
    expect(async () => {
      await createStatement.execute({
        user_id: "userId",
        amount: 100,
        description: "This is a deposit statement",
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Should not create a withdraw statement if funds are insufficient", async () => {
    expect(async () => {
      await createStatement.execute({
        user_id: userId,
        amount: 200,
        description: "This is a withdraw statement",
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

})
