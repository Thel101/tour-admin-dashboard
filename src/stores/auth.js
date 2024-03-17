import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore("auth",{
    state: () =>({
        authUser : null,
        authErrors : []
    }),
    getters : {
        user : (state) => state.authUser,
        errors : (state) => state.authErrors
    },
    actions: { 
        async getToken(){
            await axios.get('/sanctum/csrf-cookie');
        },
        async getAuthenticatedUser(){
            await this.getToken(); 
            const data = await axios.get('/api/user'); 
            this.authUser = data.data;
        },
        async logIn(data)  {
            this.authErrors = [];
            await this.getToken();
            try{
               
                await axios.post('/login', {
                    'email': data.email,
                    'password': data.password
                });
                this.router.push('/');
            }
            catch(error){
                if(error.response.status === 422)
                {
                    this.authErrors = error.response.data.errors
                }
            }
       
        },
        async submitForm (data) {
            this.authErrors = [];
            await this.getToken();
            try{
                await  axios.post('/register', {
                    'name': data.name,
                    'email': data.email,
                    'password': data.password,
                    'role' : 'user',
                    'password_confirmation': data.confirm_password
                })
            this.router.push('/');
            }
            catch(error){
                if(error.response.status === 422){
                    this.authErrors = error.response.data.errors
                }
            }
           
        },
        async handleLogout(){
            await axios.post('/logout');
            this.authUser = null;
        },
        async handleForgotPassword (email) {
            this.authErrors = [];
            await this.getToken();
            try{
                await axios.post('/forgot-password',{
                    email : email
                })
            }
            catch(error){
                if(error.response.status === 422){
                    this.authErrors = error.response.data.errors
                }
            }

        }
    }
});
