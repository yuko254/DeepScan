// scripts/test-bcrypt.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Your current setting

async function testBcrypt() {
  const password = 'TestPassword123!';
  
  console.log('=== Bcrypt Performance Test ===\n');
  console.log(`Salt rounds: ${SALT_ROUNDS}`);
  console.log(`Password: ${password}\n`);
  
  // Test hash performance
  console.log('📊 HASH PERFORMANCE:');
  const hashStart = Date.now();
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const hashTime = Date.now() - hashStart;
  console.log(`  Hash time: ${hashTime}ms`);
  console.log(`  Hash: ${hash}\n`);
  
  // Test compare performance (correct password)
  console.log('📊 COMPARE PERFORMANCE (correct password):');
  const compareCorrectStart = Date.now();
  const correctMatch = await bcrypt.compare(password, hash);
  const compareCorrectTime = Date.now() - compareCorrectStart;
  console.log(`  Compare time: ${compareCorrectTime}ms`);
  console.log(`  Match: ${correctMatch}\n`);
  
  // Test compare performance (wrong password)
  console.log('📊 COMPARE PERFORMANCE (wrong password):');
  const wrongPassword = 'WrongPassword123!';
  const compareWrongStart = Date.now();
  const wrongMatch = await bcrypt.compare(wrongPassword, hash);
  const compareWrongTime = Date.now() - compareWrongStart;
  console.log(`  Compare time: ${compareWrongTime}ms`);
  console.log(`  Match: ${wrongMatch}\n`);
  
  // Test different salt rounds
  console.log('📊 SALT ROUNDS COMPARISON:');
  const saltRounds = [8, 10, 12, 14, 16];
  
  for (const rounds of saltRounds) {
    const start = Date.now();
    await bcrypt.hash(password, rounds);
    const time = Date.now() - start;
    console.log(`  ${rounds} rounds: ${time}ms`);
  }
  
  // Batch test (100 operations)
  console.log('\n📊 BATCH PERFORMANCE (100 operations):');
  const batchStart = Date.now();
  for (let i = 0; i < 100; i++) {
    await bcrypt.compare(password, hash);
  }
  const batchTime = Date.now() - batchStart;
  console.log(`  100 compares: ${batchTime}ms (avg ${batchTime / 100}ms per compare)`);
  
  console.log('\n✅ Test complete');
}

// Run the test
testBcrypt().catch(console.error);