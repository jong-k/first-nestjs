import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("Authentication System", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("handles a signup request", async () => {
    const email = "test@test.com";

    const res = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: email, password: "tester" })
      .expect(201);
    const { id, email: email_1 } = res.body;
    expect(id).toBeDefined();
    expect(email_1).toEqual(email_1);
  });

  it("signup as a new user the get the currently logged in user", async () => {
    const email = "test@test.com";

    const res = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email, password: "testtest" })
      .expect(201);

    // 서버 응답의 쿠키 꺼내기
    const cookie = res.get("Set-Cookie");

    const { body } = await request(app.getHttpServer())
      .get("/auth/whoami")
      .set("Cookie", cookie) // 쿠키 설정 (그냥)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
