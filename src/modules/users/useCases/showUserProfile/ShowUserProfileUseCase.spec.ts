import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let createUser: CreateUserUseCase
let showUserProfile: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let userId: string

describe("User profile show", () => {

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfile = new ShowUserProfileUseCase(inMemoryUsersRepository)

    const { id = "" } = await createUser.execute({
      name: "Gabriel",
      email: "gabriel@ignite.com.br",
      password: "123456"
    })

    userId = id
  })

  it("Should show user profile", async () => {
    const { id } = await showUserProfile.execute(userId)

    expect(id).toEqual(userId)
  })

  it("Should not show user profile if it does not exist", () => {
    expect(async () => {
      await showUserProfile.execute("userId")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })

})
