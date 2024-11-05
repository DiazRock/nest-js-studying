import { User } from "src/typeorm/entities/User";
import { CreatePaymentDto } from "./dtos/CreatePayment.dto";
import { Payment } from "src/typeorm/entities/Payments";

const createPaymentDto: CreatePaymentDto = { 
    userId: "userId", 
    amount: 100, 
    label: "test" 
};

const badPaymentDto: CreatePaymentDto = { 
    userId: "userId", 
    amount: -100, 
    label: "test" 
};

const overPaymentDto: CreatePaymentDto = { 
    userId: "userId", 
    amount: 600, 
    label: "test" 
};

const firstUser: User = {
    username: 'firstUser',
    displayName: 'pass',
    email: 'test@',
    id: 'userId',
    payments: [],
    balance: 500,
    role: "user",
    canRead: false,
    canWrite: false,
    password: 'testpassword'
};

const secondUser: User = {
    username: 'secondUser',
    displayName: 'pass',
    email: 'test@',
    id: 'secondUser',
    payments: [],
    balance: 500,
    role: "user",
    canRead: false,
    canWrite: false,
    password: 'testpassword1'
};

const paymentResponse1: Payment = { 
    id: '1', 
    ...createPaymentDto, 
    user: firstUser, 
    createdAt: new Date() 
};

const paymentResponse2: Payment = { 
    id: '2', 
    ...createPaymentDto, 
    user: secondUser, 
    createdAt: new Date() 
};

 export const TestData = {
    createPaymentDto: createPaymentDto,
    badPaymentDto: badPaymentDto,
    overPaymentDto: overPaymentDto,
    payments: [ paymentResponse1, paymentResponse2 ]
}