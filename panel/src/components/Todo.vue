<template>
  <div id="todo">
    <div class="row add-todo-button-initial">
      <span class="col">
        <div :class="{'col':todos.length>0}">
            <input class="col-md-6 new-todo m-3 p-3" type="text" v-model="doTo" @keypress.enter="addNewTodo"
                   placeholder="click and add new todo">
            <button class="col-md-3 my-3 py-3 mx-5 px-5" @click="addNewTodo">Add</button>
      </div>
      </span>
      <div class="col">
        <TransitionGroup name="list" tag="ul">
          <li class="m-2 p-2" v-for="(todo,index) in todos" :key="todo._id">
            <div class="col-9">
                <span v-if="isEditMode && index === selectedEditItemIndex" class="col-md todos">
                  <input class="todo-edit-input" type="text" v-model="selectedEditItem"
                         @keypress.enter="EditTodo(todo, index)"/>
                </span>
              <span v-if="index !== selectedEditItemIndex"
                    @click="TodoCompletedControl(todo)"
                    :class="{done:todo.completed}"
                    class="col-md todos">{{ todo.description }}
                </span>
            </div>
            <div class="col-3" style="margin-left: -18px">
                <span>
                  <button v-if="!isEditMode" :style="todo.completed ? {border:'3px solid green'} : {color:''}"
                          class="col-xs m-2 p-2 del-button" @click="DeleteTodo(todo)">Delete</button>
                  <button v-if="isEditMode"
                          :style="index !== selectedEditItemIndex? {opacity:'0'} : {opacity:'1'}"
                          class="col-xs m-2 p-2 del-button" @click="editCancelled(index)">Cancel</button>
                </span>
              <span>
                  <button v-if="!isEditMode" class="col-xs m-2 p-2 edit-button" @click="startToEdit(todo)">Edit</button>
                  <button v-if="isEditMode"
                          :style="index !== selectedEditItemIndex? {opacity:'0'} : {opacity:'1'}"
                          class="col-xs m-2 p-2 edit-button"
                          @click="EditTodo(todo, index)">Edit</button>
                </span>
            </div>
          </li>
        </TransitionGroup>
      </div>
    </div>

  </div>

</template>

<script>
import axios from "axios"


export default {
  name: "ToDo",
  data() {
    return {
      lined: false,
      isEditMode: false,
      todos: [],
      selectedEditItem: "",
      selectedEditItemIndex: null,
      doTo: "",
    }
  },
  methods: {
    addNewTodo() {
      const isEmpty = this.doTo.replace(/[^a-z0-9]/gi, '');
      if (!isEmpty.length) return;
      this.AddNewTodoItem(this.doTo);
      this.doTo = "";
    },
    DeleteTodo(todo) {
      this.todos.splice(this.todos.findIndex(t => t._id === todo._id), 1);
      this.todoDeleteItem(todo);
    },
    startToEdit(todo) {
      this.isEditMode = true;
      const index = this.todos.findIndex(t => t._id === todo._id);
      this.selectedEditItemIndex = index;
      this.selectedEditItem = this.todos[index].description;
    },
    EditTodo(todo, index) {
      if (this.selectedEditItemIndex !== index) return;
      this.todos[this.selectedEditItemIndex].description = this.selectedEditItem;
      this.selectedEditItemIndex = null;
      this.isEditMode = false;
      this.selectedEditItem = "";
      this.todoEditItem(todo);
    },
    editCancelled(index) {
      if (this.selectedEditItemIndex !== index) return;
      this.selectedEditItemIndex = null;
      this.isEditMode = false;
      this.selectedEditItem = "";
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
      const isEmpty = todo.description.replace(/[^a-z0-9]/gi, '');
      console.log("isEmpty", isEmpty)
      if (!isEmpty.length) {
        setTimeout(() => {
          location.reload();
        }, 50);
        return;
      }
      console.log("todo.description", todo.description)
      await axios.put(`/api/todoLists/${todo._id}`, {description: todo.description, completed: todo.completed});
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

.add-todo-button-initial {
  align-items: unset !important;
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
  word-break: break-all;
}

.del-button, .edit-button {
  border: none;
  border-radius: 5px;
  background-color: #f3ebeb;
  width: 60px;
  border: 3px solid #c57272;
}

.todo-edit-input {
  border: 2px solid green;
  border-radius: 5px;
  padding-left: 10px;
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

.new-todo {
  background: #f3ebeb;
  border: 3px solid #c57272;
  border-radius: 5px;
  box-shadow: 1px 0px 3px;
  color: black;
}

.new-todo:focus {
  outline: none !important;
  border: 3px solid green;
  box-shadow: 0 0 10px #719ECE;
}

button {
  width: fit-content;
  background-color: #c57272;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 2px 3px;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  align-items: center;
}
</style>