import { Employee } from "../types/employee";

export const generateData = (
  count: number = 10000
): Employee[] => {
  return Array.from(
    { length: count },
    (_, index) => ({
      id: index + 1,
      name: `Employee ${index + 1}`,
      email: `employee${
        index + 1
      }@gmail.com`,
      salary:
        Math.floor(
          Math.random() * 90000
        ) + 10000,
    })
  );
};