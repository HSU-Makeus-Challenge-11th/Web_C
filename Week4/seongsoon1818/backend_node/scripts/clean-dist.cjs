const { rmSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const projectRoot = resolve(__dirname, '..');
const outputDirectory = resolve(projectRoot, 'dist');

if (dirname(outputDirectory) !== projectRoot) {
  throw new Error('Build output must stay inside the backend project.');
}

// 파일 이동 전의 JavaScript가 새 빌드에 섞이지 않도록 출력 폴더만 정리합니다.
rmSync(outputDirectory, { recursive: true, force: true });
