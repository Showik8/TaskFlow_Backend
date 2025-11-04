import { addProject } from "../controllers/projectController";

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("projectController", () => {
  it("addProject returns 400 when title missing", async () => {
    const req: any = {
      body: {
        description: "d",
        members: [],
        createdBy: "507f191e810c19729de860ea",
      },
    };
    const res = mockRes();

    await addProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title and createdBy are required",
    });
  });
});
