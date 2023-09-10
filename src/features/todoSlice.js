import { createSlice } from "@reduxjs/toolkit";
import { useState, useEffect } from "react";
import { query, collection, onSnapshot } from "firebase/firestore";
import db from "../firebase";

const todosDB = db.collection("todos");
const initialState = {todos: {title : ""}};

export const FetchTodo = () => {
    const [todos, setTodos] = useState([]); //initially todos is an empty list

    // fetch firestore data
    useEffect(() => {
        const cur_query = query(collection(db, "todos"));
        const collectionToArray = onSnapshot(cur_query, (querySnapshot) => {  //onSnapshot listens to the desired firestore document
            let todosArray = [];
            
            querySnapshot.forEach(doc => {
                todosArray.push({ ...doc.data(), id: doc.id });
                // console.log("data: ", doc.data(), "id: ", doc.id);
            });

        setTodos(todosArray);
        
        });
        
        return () => collectionToArray();   //useEffect returns this cleanup function
    }, []); // [] means useEffect will only run once

    return todos;
}

export const todoSlice = createSlice({
    name : "todos",
    initialState,
    reducers : {
        createTodo : (state, action) => {
            todosDB.add(action.payload);    
            console.log("todo added to firestore");
        },
        editTodo : (state, action) => {
            todosDB.doc(action.payload.id).update(action.payload);
            console.log("todo edited in firestore");
        },
        deleteTodo : (state, action) => {
            todosDB.doc(action.payload.id).delete();
            console.log("todo deleted from firestore");
        },
        
    }
});

export const { createTodo, editTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;