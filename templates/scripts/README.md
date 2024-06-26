# Project Setup

## Prerequisites

1. Copy the `env.example` file to `.env`:

```bash
cp env.example .env
```

2. Open the `.env` file and add your own mnemonic:

```env
MNEMONIC="the trees are green and the sky is blue ..."
```

3. Save the file and proceed with running the desired script.

## Usage

There are several scripts available based on your contract selection during the creation process. To run scripts, use the following commands:

```bash
# For contract deployment
npm run command -- deploy <contract-name>

# For contract instantiation
npm run command -- instantiate <contract-name>

# For contract execution
npm run command -- execute <contract-name>

# For contract query
npm run command -- query <contract-name>
```
