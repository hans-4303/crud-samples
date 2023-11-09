// src/api/mockApi.ts
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const usersMock = new MockAdapter(axios);

// 가상 API 엔드포인트 설정
const apiUrl = "https://api.example.com";

// 모의 GET 요청 핸들링
usersMock
  .onGet(`${apiUrl}/users`)
  .reply(200, [{ id: 1, name: "Item 1", age: 30 }]);
usersMock.onGet(RegExp(`${apiUrl}/users/\\d+`)).reply((config) => {
  const itemId = Number(config.url?.split("/").pop());
  return [200, { id: itemId, name: `Item ${itemId}`, age: 30 }];
});

// 모의 POST 요청 핸들링
usersMock.onPost(`${apiUrl}/users`).reply((config) => {
  const postData = JSON.parse(config.data);
  const newItemId = Math.floor(Math.random() * 1000); // 가상 ID 생성
  return [201, { id: newItemId, ...postData }];
});

// 모의 PUT 요청 핸들링
usersMock.onPut(RegExp(`${apiUrl}/users/\\d+`)).reply((config) => {
  const itemId = Number(config.url?.split("/").pop());
  const updatedData = JSON.parse(config.data);
  return [200, { id: itemId, ...updatedData }];
});

// 모의 DELETE 요청 핸들링
usersMock.onDelete(RegExp(`${apiUrl}/users/\\d+`)).reply(204);

export default usersMock;
