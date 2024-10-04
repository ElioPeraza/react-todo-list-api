import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const api_url_username = 'https://playground.4geeks.com/todo/users/elio'; //Modificar el nombre de usuario con el valor del usuario que crearon
  const [username, setUsername] = useState('');
  const [usertodos, setUserTodos] = useState({});
  const [inputvalue, setInputValue] = useState('')
  const [flagerror, setFlagError] = useState(false);

  useEffect(() => {
    getListTodos();
    //return () => '';
  }, []);

  const getListTodos = async () => {
    const response = await fetch(api_url_username);
    if (response.ok) {
      const data = await response.json();
      setUsername(data.name);
      setUserTodos(data.todos);
      console.log(data);
    } else {
      console.log('Error: ', response.status, response.statusText);
      setFlagError(true);
      console(flagerror);
      return { error: { status: response.status, statusText: response.statusText } };
    }
  };

  const createData = async () => {
    const dataToSend = {
      "label": inputvalue,
      "is_done": false
    };

    try {
      const response = await fetch('https://playground.4geeks.com/todo/todos/elio', {
        method: 'POST',
        body: JSON.stringify(dataToSend),  // la variable dataToSend puede ser un 'string' o un {objeto} que proviene de algún lugar más arriba en nuestra aplicación
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        getListTodos(); //agrega a la lista
        setInputValue(''); //Limpia el imput
        return data;
      } else {
        console.log('error al agregar tarea ', response.status, response.statusText);
      }
    } catch(error) {
      console.log('Error al realizar el POST', error)
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
        method: 'DELETE',
        body: JSON.stringify(usertodos.filter(todo => todo.id !== todoId)), //filtrado del arreglo
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setUserTodos(usertodos.filter(todo => todo.id !== todoId)); // elimina y actualiza
      } else {
        console.log('Error al eliminar la tarea', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud DELETE:', error);
    }
  };
  


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <main>
      <header className='header'>
        <h1>Todo List</h1>
      </header>
      {flagerror ?
        <section className='error-notice'>
          <div class="oaerror danger">
            <strong>Error:</strong> Ha ocurrido un error en la carga del listado de tareas
          </div>

        </section>
        :
        <>
          <section className='todo-input-section'>
            <div className='todo-input-wrapper'>
              <input
                type='text'
                id='todo-input'
                placeholder='Escribe la tarea'
                value={inputvalue}
                onChange={handleInputChange} />
              <button id='add-button' onClick={createData}>Agregar</button>
            </div>
          </section>

          <section className='todo-list-section'>
            {usertodos && usertodos.length ?
              <ul id='todo-list'>
                {usertodos.map((todo) =>
                  <li className='todo-item' key={todo.id}>
                    <span className='task-text'>{todo.label}</span>
                    <button className='complete-button'>Marcar como hecha</button>
                    <button className='delete-button'
                    onClick={() => deleteTodo(todo.id)}>Eliminar</button>
                  </li>
                )}
              </ul>
              :
              <div className="dots"></div>
            }
          </section>
        </>
      }
    </main>
  );
}

export default App;


