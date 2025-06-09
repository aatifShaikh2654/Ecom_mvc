const readlineSync = require("readline-sync");
const bcrypt = require("bcryptjs");
const prisma = require("./db/prisma");

const createAdminUser = async () => {
    try {
        const name = readlineSync.question("Name: ");
        const email = readlineSync.question("Email Address: ");
        const phone = readlineSync.question("Phone Number: ");
        const password = readlineSync.question("Password: ", { hideEchoBack: true, mask: "*" });

        if (!email || !phone || !password || !name) {
            console.log("All fields are required.");
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { phone }] },
        });

        if (existingUser) {
            console.log("Email or phone number already in use.");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                phone,
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        console.log("Super User created successfully.");
    } catch (error) {
        console.error("Error creating super user:", error);
    }
};

createAdminUser();
