const { spawn } = require("child_process");
const path = require("path");

async function main() {
  const specName = process.argv[2].toUpperCase();
  if (!specName) {
    console.log("Usage: build:spec 'spec name'");
    process.exit(1);
  }
  const specPath = path.join(__dirname, "contracts", `${specName}`, "tests");
  console.log(specPath);
  // Use spawn to execute the build script asynchronously.
  const childProcess = spawn("jest", ["."], {
    cwd: specPath, // Set the working directory for the child process.
    stdio: "inherit", // Inherit stdio (input/output) from the parent process.
  });

  childProcess.on("exit", (code) => {
    if (code === 0) {
      console.log("Contract Testing completed.");
    } else {
      console.error(`Testing failed with exit code ${code}.`);
    }
  });
}

main();
