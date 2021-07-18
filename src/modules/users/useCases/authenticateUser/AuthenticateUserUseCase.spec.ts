import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let createUser: CreateUserUseCase
let authenticateUser: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("User authentication", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUser = new AuthenticateUserUseCase(inMemoryUsersRepository)

    await createUser.execute({
      name: "Gabriel",
      email: "gabriel@ignite.com.br",
      password: "123456"
    })
  })

  it("Should authenticate user", async () => {
    const authentication = await authenticateUser.execute({
      email: "gabriel@ignite.com.br",
      password: "123456"
    })

    expect(authentication).toHaveProperty("token")
  })

  it("Should not authenticate user if e-mail is incorrect", () => {
    expect(async () => {
      await authenticateUser.execute({
        email: "gabriel@ignite.com",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate user if password is incorrect", () => {
    expect(async () => {
      await authenticateUser.execute({
        email: "gabriel@ignite.com.br",
        password: "654321"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
