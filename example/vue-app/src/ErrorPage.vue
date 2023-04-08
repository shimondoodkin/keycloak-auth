<template>
  <div class="error-page">
    <div>Error Page</div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="returnToMainPage()">Return to Main Page</button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    returnUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    returnToMainPage() {
      window.location.href = this.returnUrl;
    },
  },
};
</script>

<style>
.error-page {
  text-align: center;
  margin: 50px auto;
}
h1 {
  font-size: 36px;
  margin-bottom: 20px;
}
p {
  font-size: 18px;
  margin-bottom: 20px;
}
button {
  font-size: 16px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0062cc;
}
</style>