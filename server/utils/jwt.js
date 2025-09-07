import jwt from "jsonwebtoken"

export const signToken = (user) => {
    const secret = process.env.JWT_SECRET;
    console.log("JWT_SECRET:", secret);

    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            username: user.user_name
        },
        secret,
        {expiresIn: "20m", algorithm: "HS256"}
    );
};