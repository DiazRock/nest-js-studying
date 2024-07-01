const { execSync } = require('child_process');

async function runDockerCompose() {
  console.log('Starting Docker Compose...');
  execSync('docker-compose up -d', { stdio: 'inherit' });

  console.log('Waiting for NATS to be ready...');
  const maxRetries = 10;
  let retries = 0;
  let isReady = false;

  while (retries < maxRetries && !isReady) {
    try {
      const logs = execSync('docker-compose logs nats').toString();
      if (logs.includes('Server is ready')) {
        isReady = true;
        console.log('NATS is ready!');
      } else {
        retries++;
        console.log(`NATS not ready yet. Retrying... (${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Error checking NATS readiness:', error);
      process.exit(1);
    }
  }

  if (!isReady) {
    console.error('NATS did not start in time.');
    process.exit(1);
  }
}

async function runE2ETests() {
  try {
    await runDockerCompose();
    console.log('Running e2e tests...');
    execSync('jest --config jest-e2e.json', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running e2e tests:', error);
    process.exit(1);
  } finally {
    console.log('Stopping Docker Compose...');
    execSync('docker-compose down', { stdio: 'inherit' });
  }
}

runE2ETests();