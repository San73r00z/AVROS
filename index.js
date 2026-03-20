const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const PORT = 3000;



const server = http.creteServer(app)
const io = new Server(server, {});


app.use(cors());//cambio
app.use(express.json());

let tareasNuevas = [];

app.get('/',(req, res) => {    
    res.send('Backend funcionando');
});

app.post('/task', (req, res) => {
    try {
        const tareaNueva = req.body;


        if(!tareaNueva.title){
            console.log(tareaNueva);
            return res.json({success: false, mensaje: 'titulo es requerido'});
        }

        const duplicados = tareasNuevas.find(itemTarea =>
            itemTarea.title.toLowerCase() === tareaNueva.title.toLowerCase()
        );

        if(duplicados) {
            return res.json({success: false, mensaje: 'La tarea ya fue creada ' + tareaNueva.title});
        }

        const nuevaTareaObj = {
            id: Math.random(),
            title: tareaNueva.title,
            completed: false,
            createdAt: Date.now() 
        }

        tareasNuevas.push(nuevaTareaObj);
        return res.json({success: true, mensaje: 'Tarea agregada con exito'});
    }
    catch (e){
        console.log(e)
        return res.json({success: false, mensaje: e});
    } 
});

app.get('/tasks',(req, res) => {    
    res.json(tareasNuevas);
});

app.put('/tasks/:id/complete',(req, res) => {    
    res.json(tareasNuevas);
});


io.on('connection', (socket) => {
    console.log(socket);ß

    socket.on('disconnect', () => {
        console.log('Desconectado de socket');     
    })
});

app.set('io', io);

app.listen(PORT, () =>{
    console.log('Inicio de back correcto' + PORT);
});

