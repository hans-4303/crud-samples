import { useEffect, useState, ChangeEvent, FormEvent, Fragment } from "react";
import axios from "axios";
import { DefaultUser, UpdatingUser, EditingUser } from "@/types/user.type";

function App() {
  const [data, setData] = useState<DefaultUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataRow, setDataRow] = useState<UpdatingUser>({ name: "", age: 0 });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<EditingUser>({
    name: "",
    age: 0,
  });

  async function fetchData() {
    try {
      const response = await axios.get("https://api.example.com/users"); // 실제 API 대신 사용
      const { data } = response;
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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDataRow((prevState) => {
      return { ...prevState, [name]: value };
    });
  }

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
      // 스프레드로 dataRow의 key와 value를 풀어주기
      const newData = [...data, { ...dataRow, id: newId }];
      // 데이터 형태 맞춤
      setData(newData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function startEditing(id: number) {
    setIsEditing(true);
    const userToEdit = data.find((el) => el.id === id);
    // find가 요소 혹은 undefined를 반환하기 때문에 prevState => 삼항 연산자 적용하였음
    setEditedData((prevState) => (userToEdit ? userToEdit : prevState));
  }

  function editingData(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setEditedData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditedData({ name: "", age: 0 });
  }

  async function handleUpdate(id: number) {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `https://api.example.com/users/${id}`,
        editedData
      );
      const updatedUser = response.data;
      const updatedData = data.map((el) => {
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

  async function deleteData(id: number) {
    setIsLoading(true);
    try {
      await axios.delete(`https://api.example.com/users/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDelete(id: number) {
    deleteData(id);
    const newData = data.filter((el) => el.id !== id);
    setData(newData);
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data &&
            data.map((el) => (
              <Fragment key={el.id}>
                <li>
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
                      <button onClick={() => handleDelete(el.id)}>
                        Remove
                      </button>
                    </>
                  )}
                </li>
              </Fragment>
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
