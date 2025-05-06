const { z } = require('zod');

const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: " password is required" }),
  phone: z.string().regex(/^\d{9,10}$/, { message: "Phone must be 9 or 10 digits" }),
});
module.exports = userSchema;
