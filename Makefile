.PHONY: setup build test spec-check clean

setup:
	npm install

build:
	npm run build

# Runs tests in Docker as requested
test:
	docker build -t chimera-test .
	docker run --rm chimera-test npm test

spec-check:
	npx tsx scripts/spec-check.ts

clean:
	rm -rf dist node_modules
