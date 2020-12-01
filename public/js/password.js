function passwordCheck(){
    var password = prompt("Veuillez entrer le mot de passe.");
    if(password === "##kiwax39access##"){
        window.location = "login.html";
    } else {
        while(password !== "##kiwax39access##"){
            password = prompt("Veuillez entrer le mot de passe.");
        }
        window.location = "login.html";
    }
}
window.onload=passwordCheck;