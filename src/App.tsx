import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { DefaultUser, PostingUser, UpdatingUser } from "@/types/user.type";

function App() {
  /* DefaultUser[] | null은 안 됨:
  초기 state를 []로 잡았기 때문에 동시에 null이 들어가는 것을 기대할 수 없어서 */
  const [data, setData] = useState<DefaultUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  /* PostingUser 타입 선언, id는 없어도 됨:
  POST 요청 시 생성되니까 */
  const [dataRow, setDataRow] = useState<PostingUser>({ name: "", age: 0 });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  /* EditingUser 타입을 선언하되 초기 id 값은 없음:
  GET을 통해 받아오며 편집할 수 없는 데이터이기 때문 */
  const [editedData, setEditedData] = useState<UpdatingUser>({
    name: "",
    age: 0,
  });

  /* Read 과정에서 데이터 명시해주기 */
  async function fetchData() {
    try {
      const response = await axios.get("https://api.example.com/users"); // 실제 API 대신 사용
      const { data }: { data: DefaultUser[] } = response;
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  /* 이벤트 전달 받는 편집 함수, 편집 함수는 즉시 호출되지 않고 전달 -> 실행 됨 */
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDataRow((prevState) => {
      return { ...prevState, [name]: value };
    });
  }

  /* CREATE 과정에서 데이터 명시해주기 */
  async function handlePost(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    console.log("posted: client side");

    try {
      const response = await axios.post(
        "https://api.example.com/users",
        dataRow
      );
      const newId = response.data.id;
      /* 1. 이때 data를 DefaultUser[] | null이라고 한다면 배열 스프레드 자체가 불가:
      배열이 아닐 수 있다 판정하니까, 차라리 any[] 형태라도 줘야 함

      2. state를 객체 형태로 사용한다면 스프레드로 state의 key와 value를 풀어주기:
      나머지 키와 값은 타입에 명시 되어 있다면 자연스럽게 이어짐 */
      const newData: DefaultUser[] = [...data, { ...dataRow, id: newId }];
      // 3. DefaultUser[] 타입으로 인지하고 수신
      setData(newData);
      // 4. 편집 칸 초기화
      setDataRow({ name: "", age: 0 });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  /* id를 받는 함수들은 DefaultUser 타입을 통해 id 명시되고 있음 */
  function startEditing(id: number) {
    setIsEditing(true);
    const userToEdit = data.find((el) => el.id === id);
    // find가 요소 혹은 undefined를 반환하기 때문에 prevData => 삼항 연산자 적용하였음
    setEditedData((prevData) => (userToEdit ? userToEdit : prevData));
  }

  /* 편집 함수 */
  function editingData(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setEditedData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  /* 편집 중지 함수 */
  function cancelEditing() {
    setIsEditing(false);
    setEditedData({ name: "", age: 0 });
  }

  /* UPDATE 과정에서 데이터 명시해주기 */
  async function handleUpdate(id: number) {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `https://api.example.com/users/${id}`,
        editedData
      );
      const updatedUser = response.data;
      const updatedData: DefaultUser[] = data.map((el) => {
        if (el.id === id) {
          return updatedUser;
        }
        return el;
      });
      setData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  /* DELETE 과정에서 데이터 명시해주기 */
  async function handleDelete(id: number) {
    setIsLoading(true);
    try {
      await axios.delete(`https://api.example.com/users/${id}`);
      const newData: DefaultUser[] = data.filter((el) => el.id !== id);
      setData(newData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((el) => (
            <li key={el.id}>
              {isEditing && editedData.id === el.id ? (
                <>
                  <input
                    name="name"
                    value={editedData.name}
                    onChange={editingData}
                  />
                  <input
                    name="age"
                    value={editedData.age}
                    onChange={editingData}
                  />
                  <button onClick={() => handleUpdate(el.id)}>Save</button>
                  <button onClick={() => cancelEditing()}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{el.name}</span>
                  <span>{el.age}</span>
                  <button onClick={() => startEditing(el.id)}>Edit</button>
                  <button onClick={() => handleDelete(el.id)}>Remove</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handlePost}>
        <input name="name" value={dataRow.name} onChange={handleChange} />
        <input name="age" value={dataRow.age} onChange={handleChange} />
        <button type="submit">add user</button>
      </form>
    </div>
  );
}

export default App;
