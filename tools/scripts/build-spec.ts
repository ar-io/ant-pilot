import { spawn } from 'child_process';
import path from 'path';

async function main() {
  const specName = process.argv[2].toUpperCase();
  if (!specName) {
    console.log("Usage: build:spec 'spec name'");
    process.exit(1);
  }
  const specPath = path.join(__dirname, '../../contracts', `${specName}`);
  console.log(specPath);
  console.log(`Building ${specName} contracts...`);

  // Replace "your_build_script.js" with the name of the build file you want to execute.
  const buildScript = 'build.js';

  // Use spawn to execute the build script asynchronously.
  const childProcess = spawn('node', [buildScript], {
    cwd: specPath, // Set the working directory for the child process.
    stdio: 'inherit', // Inherit stdio (input/output) from the parent process.
  });

  childProcess.on('exit', (code) => {
    if (code === 0) {
      console.log('Contract Build completed successfully.');
    } else {
      console.error(`Build failed with exit code ${code}.`);
    }
  });
}

main();
