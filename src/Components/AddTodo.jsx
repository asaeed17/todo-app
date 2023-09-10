import { useState } from "react";
import { Button, Input } from "antd";
import { useDispatch } from "react-redux";
import { createTodo } from "../features/todoSlice";

const AddTodo = () => {
    const dispatch = useDispatch(); //brings data to the store
    const [todo, setTodo] = useState({title : ""});
    
    const handleAdd = (e) => {
      e.preventDefault();

        dispatch(createTodo({title : todo.title}));
        setTodo({title : ""}); //clear form input
        
        // console.log("state: ", data)
    }
  
    return (
      <form onSubmit={handleAdd}>

        <div>

          <Input type='text' placeholder='Enter ToDo' value={todo.title} onChange={(e) => setTodo({title : e.target.value})} required />
          <div>
            <Button className="button-add" onClick={handleAdd} style={{marginTop : 5}} required>Add ToDo</Button> {/* CHECK EMPTY INPUT!! */}
          </div>
          <p></p>
          
        </div>

      </form>
    )
  }

  export default AddTodo;