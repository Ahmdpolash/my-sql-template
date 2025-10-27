import { Prisma } from "@prisma/client";
import { IGenericErrorMessage } from "../interface/error";

const handleValidationError = (error: Prisma.PrismaClientValidationError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: "",
      message: error.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleValidationError;
