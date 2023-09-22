// TODO:
// Impliment degree courses, pre_requisites, incompatibles
// free to use the arrays in vue for form input

const vuectrl = Vue.createApp({
    data() {
        return {
            placeholder: "Result placeholder",
            stream: [],
            level: [],
            course: [],
            degree: [],
            degree_course: [],
            type: ["core", "elective","core & elective", "project", "core & project", "elective & project", "core, elective & project"],
            term: ["Semester 1", "Semester 2", "All year"],
            pre_requisites: [],
            incompatibles: [],
            errorMessage: null
        };
    },
    methods: {
        
        doSearching() {
            console.log("Searching...");
            },
        doLogin() {
            console.log("login...");
            window.location.href = "login.html";
        },
        dataUpdate(){
            vuectrl.fetchData("/api/course_streams", "stream");
            vuectrl.fetchData("/api/degree_levels", "level");
            vuectrl.fetchData("/api/courses", "course");
            vuectrl.fetchData("/api/degrees", "degree");
            // vuectrl.fetchData("/api/degree_courses", "degree_course");
            // vuectrl.fetchData("/api/pre_requisites", "pre_requisite");
            // vuectrl.fetchData("/api/incompatibles", "incompatibles");
        },
        fetchData(target_loc, dest_var){
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    if (req.response) {
                        
                        vuectrl[dest_var] = JSON.parse(req.response);
                    }
                }else{
                    vuectrl.errorMessage = "Error fetching data from " + target_loc + ". Status: " + req.status;
                }
            };
            req.open("GET", target_loc);
            req.send();
        }
    }
}).mount('#mainDiv');

vuectrl.dataUpdate();



