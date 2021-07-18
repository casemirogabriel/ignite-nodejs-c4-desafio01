import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUser: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("User creation", () => {

  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should create user", async () => {
    const user = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@ignite.com.br",
      password: "123456"
    })

    expect(user).toHaveProperty("id")
  })

  it("Should not create user if e-mail is already being used", () => {
    expect(async () => {
      await createUser.execute({
        name: "Gabriel",
        email: "gabriel@ignite.com.br",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })

})
