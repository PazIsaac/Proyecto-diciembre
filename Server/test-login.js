async function testLogin() {
    try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'aarontec.tarea@gmail.com',
                contraseña: '123456'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Login exitoso:', data);
        } else {
            console.log('❌ Error en login:', data);
        }
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
    }
}

testLogin();