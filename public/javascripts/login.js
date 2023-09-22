const vuectrl = Vue.createApp({
    data() {
        return {
            email: "",
            password: "",
            post_result: "",
        };
    },
    methods: {
        
        login() {
            const dataToSend = {
                email: this.email,
                password: this.password
            };
        
            fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.post_result = data;
                this.email = "";
                this.password = "";
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        },

        reg() {
            window.location.href = "create-account.html";
        }
    }
}).mount('#mainDiv');

