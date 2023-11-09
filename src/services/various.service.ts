// src/services/various.service.ts
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mock = new MockAdapter(axios);

// 가상 API 엔드포인트 설정
const apiUrl = "https://api.example.com";

// "users" 엔드포인트
mock.onGet(`${apiUrl}/users`).reply(200, [{ id: 1, name: "Item 1", age: 30 }]);
mock.onGet(RegExp(`${apiUrl}/users/\\d+`)).reply((config) => {
  const itemId = Number(config.url?.split("/").pop());
  return [200, { id: itemId, name: `Item ${itemId}`, age: 30 }];
});
mock.onPost(`${apiUrl}/users`).reply((config) => {
  console.log("posted: server side");
  const postData = JSON.parse(config.data);
  const newItemId = Math.floor(Math.random() * 1000); // 가상 ID 생성
  return [201, { id: newItemId, ...postData }];
});
mock.onPut(RegExp(`${apiUrl}/users/\\d+`)).reply((config) => {
  const itemId = Number(config.url?.split("/").pop());
  const updatedData = JSON.parse(config.data);
  return [200, { id: itemId, ...updatedData }];
});
mock.onDelete(RegExp(`${apiUrl}/users/\\d+`)).reply(204);

export default mock;
