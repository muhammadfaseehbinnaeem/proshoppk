import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '03017442932',
        isAdmin: true
    },
    {
        name: 'Faseeh',
        email: 'faseeh@email.com',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '03487200251',
        isAdmin: false
    },
    {
        name: 'Hassan',
        email: 'hassan@email.com',
        password: bcrypt.hashSync('123456', 10),
        phoneNumber: '03043332199',
        isAdmin: false
    },
];

export default users;