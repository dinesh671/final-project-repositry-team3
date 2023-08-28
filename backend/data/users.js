import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Nihanth',
    email: 'nihanth@email.com',
    password: bcrypt.hashSync('123456', 10),
    
  },
  {
    name: 'Dinesh',
    email: 'dinesh@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
