# Garage Management System

The Garage Management System is a robust solution tailored for automotive repair shops and garages, aiming to optimize their operations. It offers efficient management of customers, vehicles, services, inventory, and billing, streamlining garage management processes.

## Getting started

To get started developing in the browser, click this button:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/dacadeorg/icp-message-board-contract)

If you rather want to use GitHub Codespaces, click this button instead:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/dacadeorg/icp-message-board-contract?quickstart=1)

**NOTE**: After `dfx deploy`, when developing in GitHub Codespaces, run `./canister_urls.py` and click the links that are shown there.

If you prefer running VS Code locally and not in the browser, click "Codespaces: ..." or "Gitpod" in the bottom left corner and select "Open in VS Code" in the menu that appears.
If prompted, proceed by installing the recommended plugins for VS Code.

To develop fully locally, first install [Docker](https://www.docker.com/get-started/) and [VS Code](https://code.visualstudio.com/) and start them on your machine.
Next, click the following button to open the dev container locally:

[![Open locally in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/dacadeorg/icp-message-board-contract)

## Prerequisities

1. Install `nvm`:

- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`

2. Switch to node v20:

- `nvm install 20`
- `nvm use 20`

3. Install build dependencies:

## For Ubuntu and WSL2

```
sudo apt-get install podman
```

## For macOS:

```
xcode-select --install
brew install podman
```

4. Install `dfx`

- `DFX_VERSION=0.16.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"`

5. Add `dfx` to PATH:

- `echo 'export PATH="$PATH:$HOME/bin"' >> "$HOME/.bashrc"`

6. Create a project structure:

- create `src` dir
- create `index.ts` in the `src` dir
- create `tsconfig.json` in the root directory with the next content

```
{
    "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "strictPropertyInitialization": false,
        "strict": true,
        "target": "ES2020",
        "moduleResolution": "node",
        "allowJs": true,
        "outDir": "HACK_BECAUSE_OF_ALLOW_JS"
    }
}
```

- create `dfx.json` with the next content

```
{
  "canisters": {
    "day_care": {
      "type": "custom",
      "main": "src/index.ts",
      "candid": "src/index.did",
      "candid_gen": "http",
      "build": "npx azle day_care",
      "wasm": ".azle/day_care/day_care.wasm",
      "gzip": true,
      "metadata": [
        {
            "name": "candid:service",
            "path": "src/index.did"
        },
        {
            "name": "cdk:name",
            "content": "azle"
        }
    ]
    }
  }
}

```

where `day_care` is the name of the canister.

6. Create a `package.json` with the next content and run `npm i`:

```
{
  "name": "day_care",
  "version": "0.1.0",
  "description": "Internet Computer message board application",
  "dependencies": {
    "@dfinity/agent": "^0.21.4",
    "@dfinity/candid": "^0.21.4",
    "azle": "^0.21.1",
    "express": "^4.18.2",
    "uuid": "^9.0.1"
  },
  "engines": {
    "node": "^20"
  },
  "devDependencies": {
    "@types/express": "^4.17.21"
  }
}

```

7. Run a local replica

- `dfx start --host 127.0.0.1:8000`

#### IMPORTANT NOTE

If you make any changes to the `StableBTreeMap` structure like change datatypes for keys or values, changing size of the key or value, you need to restart `dfx` with the `--clean` flag. `StableBTreeMap` is immutable and any changes to it's configuration after it's been initialized are not supported.

- `dfx start --host 127.0.0.1:8000 --clean`

8. Deploy a canister

- `dfx deploy`
  Also, if you are building an HTTP-based canister and would like your canister to autoreload on file changes (DO NOT deploy to mainnet with autoreload enabled):

```
AZLE_AUTORELOAD=true dfx deploy
```

9. Stop a local replica

- `dfx stop`

## Interaction with the canister

When a canister is deployed, `dfx deploy` produces a link to the Candid interface in the shell output.

Candid interface provides a simple UI where you can interact with functions in the canister.

On the other hand, you can interact with the canister using `dfx` via CLI:

### get canister id:

- `dfx canister id <CANISTER_NAME>`
  Example:
- `dfx canister id day_care`
  Response:

```
bkyz2-fmaaa-aaaaa-qaaaq-cai
```

Now, the URL of your canister should like this:

```
http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000
```

With this URL, you can interact with the canister using an HTTP client of your choice. We are going to use `postman`.

To interact with the `day_care` canister using Postman, you need to perform HTTP requests to the canister's URL.

To interact with the `day_care` canister, refer to the [day_care canister Postman documentation](https://documenter.getpostman.com/view/31819605/2sA3JRaf7z).
