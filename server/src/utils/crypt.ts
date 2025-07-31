import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const comparePassword = async (password: string, hashedPassword: string) => {
    if (!password || !hashedPassword) {
        console.log("hashed password", hashedPassword);
        console.log("password", password);
        throw new Error("Password or hashed password is missing");
    }
    return await bcrypt.compare(password, hashedPassword);
}

export {
    hashPassword,
    comparePassword
};
