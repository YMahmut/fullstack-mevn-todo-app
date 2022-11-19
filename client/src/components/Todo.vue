<template>
  <div id="todo">
    <div class="row">
      <div class="add-todo-button-center" :class="{'col':todos.length>0}">
        <NewTodo class="m-5 p-3" @sendNewToDo="AddNewTodoItem($event)"/>
      </div>
      <div class="col">
          <TransitionGroup name="list" tag="ul" >
            <li class="m-2 p-2" v-for="(todo,index) in todos" :key="todo._id">
              <div class="col-8">
                <span  v-if="isEditMode && index === selectedEditItemIndex" class="col-md todos">
                  <input class="todo-edit-input" type="text" v-model="selectedEditItem" />
                </span>
                <span v-if="index !== selectedEditItemIndex"
                      @click="TodoCompletedControl(todo)"
                      :class="{done:todo.completed}"
                      class="col-md todos">{{ todo.description }}
                </span>
              </div>
              <div class="col-4">
                <span>
                  <button v-if="!isEditMode"  class="col-xs m-2 p-2 del-button" @click="DeleteTodo(todo)">Delete</button>
                  <button v-if="isEditMode  && index === selectedEditItemIndex"  class="col-xs m-2 p-2 del-button" @click="editCancelled()">Cancel</button>
                </span>
                <span>
                  <button v-if="!isEditMode" class="col-xs m-2 p-2 edit-button" @click="startToEdit(todo)">Edit</button>
                  <button v-if="isEditMode" class="col-xs m-2 p-2 edit-button" @click="EditTodo(todo)">Edit</button>
                </span>
              </div>
            </li>
          </TransitionGroup>
      </div>
    </div>

  </div>

</template>

<script>
import NewTodo from "./NewTodo"
import axios from "axios"


export default {
  components: {
    NewTodo
  },
  name: "ToDo",
  data() {
    return {
      lined: false,
      isEditMode:false,
      todos: [],
      selectedEditItem:"",
      selectedEditItemIndex:null,
    }
  },
  methods: {
    DeleteTodo(todo) {
      this.todos.splice(this.todos.findIndex(t => t._id === todo._id), 1);
      this.todoDeleteItem(todo);
    },
    startToEdit(todo){
      this.isEditMode=true;
      const index=this.todos.findIndex(t => t._id === todo._id);
      this.selectedEditItemIndex=index;
      this.selectedEditItem=this.todos[index].description;
    },
    EditTodo(todo) {
      this.todos[this.selectedEditItemIndex].description=this.selectedEditItem;
      this.selectedEditItemIndex=null;
      this.isEditMode=false;
      this.selectedEditItem="";
      this.todoEditItem(todo);
    },
    editCancelled() {
      this.selectedEditItemIndex=null;
      this.isEditMode=false;
      this.selectedEditItem="";
    },
    TodoCompletedControl(todo) {
      todo.completed = !todo.completed;
      this.todoCompletedViseVersa(todo._id, todo.completed);
    },
    async AddNewTodoItem(e) {
      await axios.post(`/api/todoLists`, {description: e, completed: false});
      const response = await axios.get('/api/todoLists');
      this.todos = response.data;
    },
    async todoCompletedViseVersa(todoId, todoCompleted) {
      await axios.put(`/api/todoLists/${todoId}`, {completed: todoCompleted});
    },
    async todoDeleteItem(todo) {
      await axios.delete(`/api/todoLists/${todo._id}`);
    },
    async todoEditItem(todo) {
      await axios.put(`/api/todoLists/${todo._id}`,{description: todo.description, completed: todo.completed});
    }
  },
  async mounted() {
    const response = await axios.get('/api/todoLists');
    this.todos = response.data;
  }

}
</script>

<style scoped>
#todo {
  position: relative;
  width: 100%;
}

.add-todo-button-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
}
ol, ul {
  padding-left: 0rem !important;
}

li {
  list-style: none;
  background-color: #c57272;
  border-radius: 5px;
  box-shadow: 1px 2px 3px #000;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.todos {
  margin-right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: start;
  position: relative;
  width: 87%;
  user-select: none;
}

.del-button, .edit-button {
  border: none;
  border-radius: 5px;
  background-color: #f3ebeb;
  width: 60px;
}
.todo-edit-input{
  border: none;
  border-radius: 5px;
}
li > span {
  flex-direction: column;
  text-align: start;
}

.done {
  text-decoration-line: line-through;
  text-decoration-color: #e3b6ba;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.75s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>