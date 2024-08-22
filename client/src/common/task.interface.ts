export interface ITask {
  title: string,
  description: string,
  priority: "LOW" | "MEDIUM" | "HIGH",
  createdAt: Date,
  _id: string,
}
