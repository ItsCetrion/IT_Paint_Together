document.querySelector(".form").addEventListener("submit", async function(event){
    event.preventDefault();
    const User = {
        login: this.login.value,
        password: this.password.value
    }
    const isValid = await Login(User);
    console.log(isValid);
    redirection(isValid)
});

function redirection(isValid) {
    if (isValid) {
        // window.location.href = "http://localhost:3000/home";
        window.location.href = "https://it-paint-together.onrender.com/home";
    }
    else {
        notification()
    }
}

function notification() {
    const notification = document.createElement('div');
    notification.className = 'notificationInBody';
    notification.textContent = 'Неверный логин или пароль!';
    document.querySelector("main").appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}
