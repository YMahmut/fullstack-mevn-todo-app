<template>
  <div id="card-body">
      <appHeader/>
      <Todo/>
  </div>
</template>

<script>
import appHeader from "./Header"
import ToDo from "./Todo";
export default {
  name: "appBody",
  components:{
    appHeader:appHeader,
    Todo:ToDo,
  }
}
</script>

<style scoped>
#card-body{


  background-color: #d9bcbc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  text-align: center;
  min-height: 100vh;
  padding:10px;
}
</style>