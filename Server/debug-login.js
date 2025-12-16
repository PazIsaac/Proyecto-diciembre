const express = require('express');
const app = express();
app.use(express.json());

// Interceptar todas las requests POST a /api/auth/login
app.post('/api/auth/login', (req, res) => {
    console.log('📧 Email recibido:', JSON.stringify(req.body.email));
    console.log('📧 Email length:', req.body.email?.length);
    console.log('📧 Email chars:', req.body.email?.split('').map(c => `${c}(${c.charCodeAt(0)})`));
    
    res.json({ debug: 'intercepted' });
});

app.listen(3002, () => {
    console.log('🔍 Debug server running on http://localhost:3002');
    console.log('Cambia temporalmente tu frontend para apuntar a puerto 3002');
});