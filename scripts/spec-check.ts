import fs from 'fs';
import path from 'path';

const REQUIRED_SPECS = [
    'specs/_meta.md',
    'AGENTS.md',
    'ANTIGRAVITY',
    'skills/README.md'
];

const REQUIRED_DIRS = [
    'src/agents',
    'src/common',
    'skills',
    'tests'
];

function checkSpecs() {
    console.log('[SPEC-CHECK] Starting compliance verification...');
    let passed = true;

    REQUIRED_SPECS.forEach(file => {
        if (!fs.existsSync(file)) {
            console.error(`[FAIL] Missing required specification file: ${file}`);
            passed = false;
        } else {
            console.log(`[PASS] Found spec: ${file}`);
        }
    });

    REQUIRED_DIRS.forEach(dir => {
        if (!fs.existsSync(dir)) {
            console.error(`[FAIL] Missing required directory: ${dir}`);
            passed = false;
        } else {
            console.log(`[PASS] Found directory: ${dir}`);
        }
    });

    if (passed) {
        console.log('[SUCCESS] Project aligns with core structural specifications.');
        process.exit(0);
    } else {
        console.error('[ERROR] Specification compliance failed.');
        process.exit(1);
    }
}

checkSpecs();
