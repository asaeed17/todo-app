import './App.css';
import AddTodo from './Components/AddTodo';

import { useState } from 'react';
import { Button, Input, Modal, message, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteTodo, editTodo, FetchTodo } from './features/todoSlice';

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchedText, setSearchedText] = useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  
  const todos = FetchTodo();
  // console.log("todos array: ", todos);

  const dispatch = useDispatch();

  const columns = [
    {
      key: '1',
      title: 'Todo',
      dataIndex: 'title',
      filteredValue: [searchedText],
      onFilter : (value, record) => { //for searching 
        return record.title.toLowerCase().includes(value.toLowerCase());
      },
      sorter : (record1, record2) => {  //for sorting
        return (record1.title).localeCompare(record2.title);  
      }
    },
    {
      key: '2',
      title: 'Actions',
      render: (record) => {
        return( 
        <>
        <EditOutlined onClick={() => {onEditTodo(record)}}/>
        <DeleteOutlined onClick={() => {onDeleteTodo(record)}} style={{color: "red", marginLeft: 15}}/>
        </>
      )}
    }
  ]

  //ui edit clicked
  const onEditTodo = (record) => {
    console.log("record", record);
    setIsEditing(true);
    setEditingTodo({...record}); //copy of record being edited 
  }
  
  //reset editing properties (cancel/finish editing)
  const resetEditing = () => {
    setIsEditing(false);
    setEditingTodo(null);
  }

  //ui delete clicked
  const onDeleteTodo = (record) => {
    Modal.confirm({
      title : "Are you sure you want to delete this ToDo?",
      onOk: () => {
        dispatch(deleteTodo(record));
      }
    });
  }

  //deleted selected todos
  const deleteSelectedRecords = () => {
    if (selectedRecords.length === 0) {
      messageApi.info("No ToDos have been selected!");
      // alert("No ToDos have been selected!");
    }
    else {
      // console.log("Selected Records", selectedRecords);
      const titleMessage = `Are you sure you want to delete these ToDos? (${selectedRecords.length} ToDos selected)`;
      Modal.confirm({
        title: titleMessage,
        
        onOk: () => {
          selectedRecords.forEach((todoID) => {
            dispatch(deleteTodo({id : todoID}));
            setSelectedRecords([]);
            })
        }
    })
  }
  }

  return (
    <div className="App">
      <header className='App-header'>
      <h1>ToDo App</h1>
      <div>
        <AddTodo />
        
        <Input.Search
          placeholder='Search ToDo'
          style={{marginBottom: 5}}
          onSearch={(value) => setSearchedText(value)}
          onChange={(e) => setSearchedText(e.target.value)} /> {/* search while typing */}
      </div>
      <Table columns={columns} dataSource={todos} pagination={{pageSize : 5}} rowSelection={{
        type: 'checkbox',
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_NONE,
          Table.SELECTION_INVERT,
        ],
        onChange: (keys) => {
          setSelectedRecords(keys)
          // console.log("checkboxes", keys)
      }}} rowKey="id"></Table>
      <Modal
        title="Edit ToDo"
        open={isEditing} //open when isEditing is true
        okText="Save"
        onCancel={resetEditing}
        onOk={() => {
          dispatch(editTodo(editingTodo));
          resetEditing();
          }}>

          <Input value={editingTodo?.title} onChange={(e) => {
            setEditingTodo({id : editingTodo.id, title: e.target.value})
          }}/>

        </Modal>
        
        {contextHolder /* popup message for deleting multiple records */} 
        <Button onClick={deleteSelectedRecords} style={{color:"red", marginTop: 10}}>Delete Selected ToDos</Button>
      </header>
    </div>
  );
}

export default App;