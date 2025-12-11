const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Create default user
    console.log('Creating users...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ledger.com' },
      update: {},
      create: {
        email: 'admin@ledger.com',
        name: 'Admin User',
        password: 'admin123', // In production, hash this!
        role: 'admin',
      },
    });
    
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@ledger.com' },
      update: {},
      create: {
        email: 'user@ledger.com',
        name: 'Regular User',
        password: 'user123', // In production, hash this!
        role: 'user',
      },
    });
    
    console.log('✓ Created 2 users');
    
    // Create parties
    console.log('Creating parties...');
    const parties = await Promise.all([
      prisma.party.upsert({
        where: { id: 'party-1' },
        update: {},
        create: {
          id: 'party-1',
          name: 'Rajesh Traders',
          phone: '9876543210',
          email: 'rajesh@example.com',
          address: 'Shop No. 12, Market Street, Mumbai, Maharashtra 400001',
          notes: 'Regular customer, prefers cash payments',
          createdBy: adminUser.id,
        },
      }),
      prisma.party.upsert({
        where: { id: 'party-2' },
        update: {},
        create: {
          id: 'party-2',
          name: 'Suresh & Co',
          phone: '9123456789',
          email: 'suresh@example.com',
          address: 'Building A-5, Industrial Area, Delhi 110001',
          notes: 'Premium client, bulk orders',
          createdBy: adminUser.id,
        },
      }),
      prisma.party.upsert({
        where: { id: 'party-3' },
        update: {},
        create: {
          id: 'party-3',
          name: 'Priya Enterprises',
          phone: '9988776655',
          email: 'priya@example.com',
          address: 'Tech Park, Whitefield, Bangalore 560066',
          notes: '',
          createdBy: regularUser.id,
        },
      }),
      prisma.party.upsert({
        where: { id: 'party-4' },
        update: {},
        create: {
          id: 'party-4',
          name: 'Amit Materials',
          phone: '9111222333',
          email: 'amit@example.com',
          address: 'Warehouse 7, Pimpri, Pune 411018',
          notes: 'Bulk orders, monthly billing',
          createdBy: adminUser.id,
        },
      }),
      prisma.party.upsert({
        where: { id: 'party-5' },
        update: {},
        create: {
          id: 'party-5',
          name: 'Deepak Trading',
          phone: '9444555666',
          email: 'deepak@example.com',
          address: 'Anna Nagar, Chennai 600040',
          notes: '',
          createdBy: regularUser.id,
        },
      }),
    ]);
    
    console.log('✓ Created 5 parties');
    
    // Create buying transactions
    console.log('Creating buying transactions...');
    await prisma.transaction.create({
      data: {
        type: 'buy',
        date: new Date('2025-12-01'),
        partyId: parties[0].id,
        phone: '9876543210',
        totalWeight: 40,
        totalPayment: 17550,
        notes: 'Good quality material',
        createdBy: adminUser.id,
        buyItems: {
          create: [
            { hnyColor: 25, blackColor: 15 }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'buy',
        date: new Date('2025-12-03'),
        partyId: parties[2].id,
        phone: '9988776655',
        totalWeight: 50,
        totalPayment: 21400,
        notes: '',
        createdBy: regularUser.id,
        buyItems: {
          create: [
            { hnyColor: 30, blackColor: 20 }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'buy',
        date: new Date('2025-12-05'),
        partyId: parties[4].id,
        phone: '9444555666',
        totalWeight: 40,
        totalPayment: 17660,
        notes: '',
        createdBy: regularUser.id,
        buyItems: {
          create: [
            { hnyColor: 22, blackColor: 18 }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'buy',
        date: new Date('2025-12-07'),
        partyId: parties[1].id,
        phone: '9123456789',
        totalWeight: 44,
        totalPayment: 19232,
        notes: 'Partial payment received',
        createdBy: regularUser.id,
        buyItems: {
          create: [
            { hnyColor: 28, blackColor: 16 }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'buy',
        date: new Date('2025-12-09'),
        partyId: parties[3].id,
        phone: '9111222333',
        totalWeight: 43,
        totalPayment: 18866,
        notes: 'Cash payment',
        createdBy: regularUser.id,
        buyItems: {
          create: [
            { hnyColor: 24, blackColor: 19 }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'buy',
        date: new Date('2025-12-11'),
        partyId: parties[0].id,
        phone: '9876543210',
        totalWeight: 43,
        totalPayment: 19270,
        notes: '',
        createdBy: adminUser.id,
        buyItems: {
          create: [
            { hnyColor: 26, blackColor: 17 }
          ]
        }
      }
    });
    
    console.log('✓ Created 6 buying transactions');
    
    // Create selling transactions
    console.log('Creating selling transactions...');
    await prisma.transaction.create({
      data: {
        type: 'sell',
        date: new Date('2025-12-02'),
        partyId: parties[1].id,
        phone: '9123456789',
        totalWeight: 30,
        totalPayment: 14100,
        notes: '',
        createdBy: adminUser.id,
        sellItems: {
          create: [
            { 
              itemCode: 'SHOES-HNY-001',
              payment: 14100,
              shoesHny: 15,
              sheetHny: 5,
              shoesBlack: 8,
              sheetBlack: 2
            }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'sell',
        date: new Date('2025-12-04'),
        partyId: parties[3].id,
        phone: '9111222333',
        totalWeight: 27,
        totalPayment: 12870,
        notes: 'Urgent delivery required',
        createdBy: adminUser.id,
        sellItems: {
          create: [
            { 
              itemCode: 'SHEET-BLK-001',
              payment: 12870,
              shoesHny: 10,
              sheetHny: 5,
              shoesBlack: 7,
              sheetBlack: 5
            }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'sell',
        date: new Date('2025-12-06'),
        partyId: parties[0].id,
        phone: '9876543210',
        totalWeight: 32,
        totalPayment: 15100,
        notes: 'Premium grade material',
        createdBy: adminUser.id,
        sellItems: {
          create: [
            { 
              itemCode: 'MIXED-001',
              payment: 15100,
              shoesHny: 12,
              sheetHny: 6,
              shoesBlack: 9,
              sheetBlack: 5
            }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'sell',
        date: new Date('2025-12-08'),
        partyId: parties[2].id,
        phone: '9988776655',
        totalWeight: 27,
        totalPayment: 13035,
        notes: '',
        createdBy: adminUser.id,
        sellItems: {
          create: [
            { 
              itemCode: 'SHOES-BLK-001',
              payment: 13035,
              shoesHny: 11,
              sheetHny: 5,
              shoesBlack: 8,
              sheetBlack: 3
            }
          ]
        }
      }
    });
    
    await prisma.transaction.create({
      data: {
        type: 'sell',
        date: new Date('2025-12-10'),
        partyId: parties[4].id,
        phone: '9444555666',
        totalWeight: 32,
        totalPayment: 15226,
        notes: '',
        createdBy: adminUser.id,
        sellItems: {
          create: [
            { 
              itemCode: 'PREMIUM-001',
              payment: 15226,
              shoesHny: 13,
              sheetHny: 6,
              shoesBlack: 9,
              sheetBlack: 4
            }
          ]
        }
      }
    });
    
    console.log('✓ Created 5 selling transactions');
    
    console.log('\n✅ Database seeded successfully!');
    console.log(`   - 2 users`);
    console.log(`   - 5 parties`);
    console.log(`   - 11 transactions (6 buy, 5 sell)`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
