import { registerUser, loginUser } from "../controllers/authController";
import { User } from "../models/User";
import bcrypt from "bcrypt";

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

jest.mock("jsonwebtoken", () => ({ sign: () => "token" }));

describe("authController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("registerUser returns 400 if user exists", async () => {
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ _id: "1" } as any);

    const req: any = {
      body: { name: "Test", email: "a@b.com", password: "123" },
    };
    const res = mockRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User Already Exists" });
  });

  it("loginUser returns 401 on invalid password", async () => {
    jest.spyOn(User, "findOne").mockResolvedValueOnce({
      _id: "1",
      name: "T",
      email: "a@b.com",
      password: "hashed",
    } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);

    const req: any = { body: { email: "a@b.com", password: "wrong" } };
    const res = mockRes();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });
});
