import { rm } from "fs/promises";
import { join } from "path";

global.beforeEach(async () => {
  // test.sqlite 가 없으면 에러가 발생하므로
  try {
    // ../test.sqlite 를 제거
    await rm(join(__dirname, "..", "test.sqlite"));
  } catch (err) {}
});
