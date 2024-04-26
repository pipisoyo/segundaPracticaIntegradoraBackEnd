const form = document.getElementById('registerForm');
form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (response.status === 201) {
            alert("Usuario registrado exitosamente.");
            window.location.replace("/login");
        } else {
            document.getElementById("emailError").innerText = "El usuario ya existe";
            document.getElementById("emailError").style.display = "block";    
            return response.json();
        }
    })
    .then((data) => {
        if (data && data.error) {
            //eliminar ant errores
            const existingErrorMessage = document.querySelector('#emailError .error-message');
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }

            const errorMessage = document.createElement('div');
            errorMessage.textContent = data.message; 
            errorMessage.style.color = 'red';
            errorMessage.classList.add('error-message'); 
            const emailErrorContainer = document.querySelector('#emailError');
            emailErrorContainer.appendChild(errorMessage);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});