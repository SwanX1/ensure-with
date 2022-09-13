#!/usr/bin/env node
import { exec } from 'child_process';
import fs from 'fs/promises';

const ensureFile = process.argv[2];
const ensureCommand = process.argv[3];
const execCommand = process.argv[4];

void (async function main() {
  if (!(await exists(ensureFile))) {
    console.log(`File \x1b[1m'${ensureFile}'\x1b[22m does not exist, running ensure command.`);
    console.debug(`\x1b[90m$ ${ensureCommand}\x1b[39m`);
    const child = exec(ensureCommand, {
      cwd: process.cwd(),
      env: process.env,
    });
    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);
    const status = await childExit(child);
    if (status !== 0) {
      console.error(
        `Process exited with \x1b[33m${typeof status === 'number' ? 'exit code' : 'signal'} ${status}\x1b[39m`
      );
      process.exitCode = typeof status === 'number' ? status : 1;
      return;
    }
    if (!(await exists(ensureFile))) {
      console.error(`Command did not ensure file \x1b[1m'${ensureFile}'\x1b[22m!`);
      process.exitCode = 1;
      return;
    }
  }
  console.debug(`\x1b[90m$ ${execCommand}\x1b[39m`);
  const child = exec(execCommand, {
    cwd: process.cwd(),
    env: process.env,
  });
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);
  const status = await childExit(child);
  if (status !== 0) {
    console.error(
      `Process exited with \x1b[33m${typeof status === 'number' ? 'exit code' : 'signal'} ${status}\x1b[39m`
    );
    process.exitCode = typeof status === 'number' ? status : 1;
    return;
  }
})();

async function exists(path) {
  try {
    await fs.stat(path);
  } catch (err) {
    return false;
  }
  return true;
}

/** @returns {Promise<number | NodeJS.Signals>} */
function childExit(child) {
  return new Promise(r => child.on('exit', (code, signal) => r(code ?? signal)));
}
