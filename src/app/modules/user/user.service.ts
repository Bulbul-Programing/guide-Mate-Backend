import bcrypt from "bcrypt";
import type { TUser } from "./user.interface";

const createUser = async (userInfo: TUser) => {

    const hashPassword = await bcrypt.hash(userInfo.password, 10);

    userInfo.password = hashPassword;
    console.log(userInfo);

    

    // const result = await prisma.$transaction(async (tnx) => {
    //     await tnx.user.create({
    //         data: {
    //             email: req.body.patient.email,
    //             password: hashPassword
    //         }
    //     });

    //     return await tnx.patient.create({
    //         data: req.body.patient
    //     })
    // })

    // return result;
}

export const userService = {
    createUser
}