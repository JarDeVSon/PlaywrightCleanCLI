# Introduction

API testing is a cornerstone of modern software development, ensuring that the backbone of your application is robust and reliable. However, the process can become cumbersome without the right tools and practices. One way to streamline your API testing workflow is by leveraging a clean Command Line Interface (CLI). This project will dive into how you can improve your API testing workflow using a clean CLI, with code examples in Playwright and TypeScript.

## Why CLI for API Testing?

- Speed and Flexibility: CLI tools are lightweight and fast, allowing you to run tests quickly without the overhead of a GUI.
- Automation: CLI tools can be easily integrated into CI/CD pipelines, making automation a breeze.
- Customization: You can tailor CLI commands to fit your specific needs, making your workflow more efficient.

## Setting Up Your Environment

Before diving into code, ensure you have Node.js and npm installed. Then, install Playwright with TypeScript:

`npm init playwright@latest`

Also, install the ts-node package to execute TypeScript on Node.js without precompiling directly:

`npm install ts-node`

Writing Your First API Test with Playwright
Playwright is generally used for end-to-end testing of web apps, but it can also be used for API testing. Here’s a simple example:

```
import { test, expect } from "@playwright/test";


let tokenStorage: any;
let id: any;
const API_URL = process.env.API_URL;

test.describe("Suite de testes API ServRest", async () => {
  test.beforeEach("Before Each Hook - Storage token", async ({ request }) => {
    console.log(API_URL)
    const response = await request.post(`${API_URL}/login`, {
      data: {
        email: "fulano@qa.com",
        password: "teste",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(response.status()).toBe(200);
    let responseBody = await response.json();
    tokenStorage = responseBody.authorization;
    return tokenStorage;
  });

  test("GET ALL API Request", async ({ request }) => {
    const response = await request.get(`${API_URL}/usuarios`);

    console.log(response);
    console.log(response.status());
    expect(response.status()).toBe(200)
  });

  test("POST API Request", async ({ request }) => {
    const response = await request.post(`${API_URL}/usuarios`, {
      headers: {
        Authorization: tokenStorage,
        "Content-Type": "application/json",
      },
      data: {
        nome: "Fulano da Silva",
        email: Math.random(1) + "beltrano@qa.com.br",
        password: "teste",
        administrador: "true",
      },
    });

    console.log(response.json());
    console.log(response.status());
    expect(response.status()).toBe(201);
    let responseBody = await response.json();
    id = responseBody._id;
  });

  test("GET ONE SINGLE API Request", async ({ request }) => {
    const response = await request.get(`${API_URL}/usuarios/${id}`, {
      headers: {
        Authorization: tokenStorage,
        "Content-Type": "application/json",
      },
    });

    console.log(response);
    console.log(response.status());
    expect(response.status()).toBe(200);
  });
  test("PUT API Request", async ({ request }) => {
    const response = await request.put(`${API_URL}/usuarios/${id}`, {
      data: {
        nome: "Fulano da Silva 1",
        email: Math.random(1) + "beltrano@qa.com.br",
        password: "teste",
        administrador: "true",
      },
      headers: {
        Authorization: tokenStorage,
        "Content-Type": "application/json",
      },
    });

    console.log(response);
    console.log(response.status());
    expect(response.status()).toBe(200);
  });

  test("DELETE API Request", async ({ request }) => {
    const response = await request.delete(`${API_URL}/usuarios/${id}`,
      {
        headers: {
          Authorization: tokenStorage,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    console.log(response.status());
    expect(response.status()).toBe(200);
  });
});

```

## Building a CLI Helper
1. Let’s imagine such a structure of tests. 

- tests/
    - api.spec.ts
        - postUser
        - getUser
        - updateUser
        - deleteUser

Each sub-folder under the service would contain the suite tests for the respective endpoints.

2. Create a new TypeScript file, runTests.ts, and add the following code:

```

import { execSync } from 'child_process';
type Environments = {
  [key: string]: string;
};
export const environments: Environments = {
  dev: 'https://sandbox.example/dev',
  sit: 'https://sandbox.example/sit’,
  uat: 'https://sandbox.example/uat’,
  prod: 'https://sandbox.example’,
};
const env = process.argv[2] || 'dev';
const suite = process.argv[3] || '';
const apiUrl = environments[env];
const command = `API_URL=${apiUrl} npx playwright test tests/${suite}`;
execSync(command, { stdio: 'inherit' });

```

3. Add a script to your package.json to run the CLI tool:

```
{
  "scripts": {
    "test.api": "ts-node tests/runTests.ts"
  }
}

```

Examples:

Run all tests for the UAT environment:

`npm run test.api uat`

Run tests for the SIT environment for api.spec.ts suite:

`npm run test.api sit api.spec.ts`

## Advanced CLI Features: Cross-Platform Scalability with cross-env

One of the challenges in scaling your test execution script across different platforms is dealing with environment variables. In Unix-based systems like Linux and macOS, setting an environment variable directly in the script is straightforward. However, the same syntax won’t work on a Windows machine, leading to script failures. This is where the cross-env package comes into play. Using cross-env to set environment variables ensures that your script is platform-agnostic.

Install cross-env package:

`npm install ts-node cross-env`

Let’s modify the script only at this line:

const command = `cross-env API_URL=${apiUrl} npx playwright test tests/${suite}`;