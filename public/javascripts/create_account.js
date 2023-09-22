const vuectrl = Vue.createApp({
    data() {
        return {
            email: "",
            password: "",
            post_result: "",
        };
    },
    methods: {
        
        reg() {
            console.log("create new");
            const dataToSend = {
                email: this.email,
                password: this.password
            };
        
            fetch('/users/reg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.post_result = data
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        },

        login() {
            console.log("already have");
            window.location.href = "login.html";
        },

       
    }
}).mount('#mainDiv');

