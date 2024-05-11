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
        'Authorization': tokenStorage,
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
        'Authorization': tokenStorage,
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
        'Authorization': tokenStorage,
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
          'Authorization': tokenStorage,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    console.log(response.status());
    expect(response.status()).toBe(200);
  });
});
