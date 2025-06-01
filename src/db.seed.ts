import mongoose from 'mongoose';
import { OrderSchema } from './order/schemas/order.schema';
import { PreorderSchema } from './preorder/schemas/preorder.schema';
import { UserSchema } from './user/schemas/user.schema';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://root:password@localhost:27017/preorder-manager?authSource=admin';

const User = mongoose.model('User', UserSchema);
const Preorder = mongoose.model('Preorder', PreorderSchema);
const Order = mongoose.model('Order', OrderSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  await Preorder.deleteMany({});
  await Order.deleteMany({});

  // 1. Create users
  const users = await User.insertMany([
    { email: 'luffy@onepiece.com', fullName: 'Monkey D. Luffy', enabled: true },
    { email: 'ash@pokemon.com', fullName: 'Ash Ketchum', enabled: true },
    { email: 'tai@digimon.com', fullName: 'Taichi Yagami', enabled: true },
    { email: 'jace@mtg.com', fullName: 'Jace Beleren', enabled: true },
    { email: 'mimi@digimon.com', fullName: 'Mimi Tachikawa', enabled: true },
  ]);

  // 2. Create preorders
  const now = new Date();
  const preorders = await Preorder.insertMany([
    {
      productSKU: 'OP-001',
      productName: 'One Piece Booster Box',
      price: 89.99,
      releaseDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30),
      closeDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 20),
      available: true,
      tags: ['ONEPIECE'],
    },
    {
      productSKU: 'PKM-001',
      productName: 'Pokemon Elite Trainer Box',
      price: 49.99,
      releaseDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 40),
      closeDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 25),
      available: true,
      tags: ['POKEMON'],
    },
    {
      productSKU: 'DIGI-001',
      productName: 'Digimon Card Game Starter Deck',
      price: 24.99,
      releaseDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 15),
      closeDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
      available: true,
      tags: ['DIGIMON'],
    },
    {
      productSKU: 'MTG-001',
      productName: 'MTG Commander Deck',
      price: 39.99,
      releaseDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 60),
      closeDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 50),
      available: true,
      tags: ['MTG'],
    },
    {
      productSKU: 'PKM-002',
      productName: 'Pokemon Booster Box',
      price: 99.99,
      releaseDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 35),
      closeDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 28),
      available: true,
      tags: ['POKEMON'],
    },
  ]);

  // 3. Create orders (at least 3 per preorder, users can have multiple orders per preorder)
  const orders: any[] = [];
  for (const preorder of preorders) {
    for (let i = 0; i < 3; i++) {
      const user =
        users[(i + preorder._id.getTimestamp().getDate()) % users.length];
      orders.push({
        preorder: preorder._id,
        user: user._id,
        quantity: Math.floor(Math.random() * 5) + 1,
      });
    }
    // Add a second order for the first user for each preorder
    orders.push({
      preorder: preorder._id,
      user: users[0]._id,
      quantity: Math.floor(Math.random() * 5) + 1,
    });
  }
  await Order.insertMany(orders as any);

  console.log('Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
