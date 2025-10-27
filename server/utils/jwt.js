import jwt from "jsonwebtoken"

export const signToken = (user) => {
    const secret = process.env.JWT_SECRET;
    console.log("JWT_SECRET:", secret);

    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            username: user.username
        },
        secret,
        {expiresIn: "10m", algorithm: "HS256"}
    );
};