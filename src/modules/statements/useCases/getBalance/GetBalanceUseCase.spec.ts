import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let createUser: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let userId: string

let createStatement: CreateStatementUseCase
let getBalance: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository

describe("Balance", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatement = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getBalance = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)

    const { id = "" } = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@ignite.com.br",
      password: "123456"
    })

    userId = id

    await createStatement.execute({
      user_id: userId,
      amount: 500,
      description: "This is a deposit statement",
      type: OperationType.DEPOSIT
    })

    await createStatement.execute({
      user_id: userId,
      amount: 150,
      description: "This is a withdraw statement",
      type: OperationType.WITHDRAW
    })
  })

  it("Should get balance from user", async () => {
    const balance = await getBalance.execute({ user_id: userId })

    expect(balance.balance).toEqual(350)
  })

  it("Should not get balance from user if it does not exist", async () => {
    expect(async () => {
      await getBalance.execute({ user_id: "userId" })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })

})
