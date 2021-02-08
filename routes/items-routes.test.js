process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require('../app');
let items = require("../fakeDb");

let pickles = { name: "pickles", price: 1.59 };

beforeEach(() => {
    items.push(pickles);
});

afterEach(() => {
    // make sure this *mutates*, not redefines, 'items'
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [pickles] });
    });
});

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: pickles })
    });
});


describe("POST /items", () => {
    test("Creating an item", async () => {
        const res = await request(app).post("/items").send({ name: "donuts", price: 0.39 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": { name: "donuts", price: 0.39 } });

    });
});

describe("PATCH /items/:name", () => {
    test("Updating an item", async () => {
        const res = await request(app).patch(`/items/${pickles.name}`).send({ name: "hot pickle", price: 1.42 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: { name: "hot pickle", price: 1.42 } });
    });
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).patch(`/items/sdjk`).send({ name: "hot pickle" });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            error: {
                message: "Item not found",
                status: 404
            }
        });
    });
});

describe("DELETE /cats/:name", () => {
    test("Delete a single cat", async () => {
        const res = await request(app).delete(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });
    });
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).delete(`/items/sdjk`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            error: {
                message: "Item not found",
                status: 404
            }
        });
    });
});




