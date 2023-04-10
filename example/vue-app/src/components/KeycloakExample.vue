<template>
  <h1>Keycloak vue3 example</h1>
  <div class="keycloak">
    <div v-if="profile"> Hello  {{ (profile.firstName + profile.firstName).trim()||profile.username }}  {{profile.lastName}}</div>
    <div v-if="hasRole"> has role </div>

    <br/>

    <button @click="fetchData">Fetch Data</button>
    <br />
    <div v-if="loading">loading</div>
    <div v-if="data">result: <b><pre>{{ data }}</pre></b></div>
    <div v-if="error">error: <b><pre>{{ error }}</pre></b></div>
    <br />
    <button @click="logout">logout</button> &nbsp;  
    <button @click="account">account</button> &nbsp;  
    <button @click="see_profile2">see profile</button> &nbsp;  

  </div>
</template>

<script>

import {authFetchText,authFetchJSON,authFetch} from 'keycloak-js-util'

export default {
  data() {
    return {
      data: this.data||null,
      error: this.error||null,
      loading: this.loading||null,
      hasRole: this.hasRole||null,
      profile: this.profile||null,
    };
  },
  async mounted() {
      await this.load_profile()
      await this.load_check_role()
  },
  methods: {
    async fetchData() {
      try {
        this.error=false
        this.loading=true

        this.data = await authFetchText('http://localhost:8082/v1/test')
        // this.data = await authFetchJSON('http://localhost:8082/v1/test')
        // const result = await authFetch('http://localhost:8082/v1/test')
        // this.data = await result.json()

      } catch(e){
        this.error=e.message
      }
      finally {
        this.loading=false
      }
      
    },
    logout() {
      window.keycloak.logout();
    },
    account() {
      window.keycloak.accountManagement();
    },

    async see_profile2() {
      this.data =  JSON.stringify( await window.keycloak.loadUserProfile() ,null,2);
    },

    async load_profile() {
      this.profile = await window.keycloak.loadUserProfile();
    },
    async load_check_role() {
      this.hasRole = await keycloak.hasRealmRole('default-roles-keycloak-demo') // permissions  by groups
      // await keycloak.hasResourceRole(role, resource) // permissions role to resource
    },
  },
};
</script>
  
<style scoped>
.keycloak {margin-top:30px;}
.keycloak b {brackground-color:lightgray}
@media (min-width: 1024px) {

}
</style>
