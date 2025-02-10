
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req) => {
  console.log("The login method in the service got invoked");

  const { email, password } = req.body;

  try {
    // Check if the email is provided
    if (!email || !password) {
      return {
        message: "Email and password are required",
        success: false,
        status: 400, // Bad Request
      };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found:", email);
      return {
        message: "User not found",
        success: false,
        status: 400, // Not Found
      };
    }
    // Check if the password matches
    if (user.password !== password) {
      console.log("Incorrect password for user:", email);
      return {
        message: "Incorrect password",
        success: false,
        status: 401, // Unauthorized
      };
    }

    // If everything is correct, return success
    return {
      message: "Login successful",
      success: true,
      data: user,
      status: 200, // OK
    };
  } catch (error) {
    console.error("Error in getUser service:", error);

    // Handle different types of errors
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        message: "Database error occurred",
        success: false,
        error: error.message,
        status: 500, // Internal Server Error
      };
    } else if (error instanceof PrismaClientValidationError) {
      return {
        message: "Validation error",
        success: false,
        error: error.message,
        status: 400, // Bad Request
      };
    } else {
      return {
        message: "An unexpected error occurred",
        success: false,
        error: error.message,
        status: 500, // Internal Server Error
      };
    }
  } finally {
    // Disconnect Prisma client (optional)
    await prisma.$disconnect();
  }
};



