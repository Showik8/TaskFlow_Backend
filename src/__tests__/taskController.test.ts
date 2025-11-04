import mongoose from "mongoose";
import { createTask, updateTaskStatus } from "../controllers/taskController";
import { Task } from "../models/Task";

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("taskController", () => {
  afterEach(() => jest.clearAllMocks());

  it("createTask returns 400 when title missing", async () => {
    const req: any = {
      body: {
        title: "   ",
        description: "d",
        projectId: "507f191e810c19729de860ea",
        assignedTo: [],
        status: "todo",
      },
    };
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title and projectId are required",
    });
  });

  it("updateTaskStatus returns 400 for invalid status", async () => {
    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    jest.spyOn(Task, "findById").mockResolvedValue({ save: jest.fn() } as any);

    const req: any = {
      params: { id: "507f191e810c19729de860ea" },
      body: { status: "bad" },
    };
    const res = mockRes();

    await updateTaskStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid status value" });
  });
});
