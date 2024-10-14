import { DataTypes, json, Sequelize } from "sequelize";
import express from 'express';

const app = express();
const port = 8080;

app.use(express.json());

app.post("/eventos", async (req, res) => {
    crearTablaEventos();
    try {
        const {nombre, fecha, ubicacion} = req.body;

        if (!nombre || !fecha || !ubicacion) {
            return res.status(400).json("Se necesita llenar todos los campos.")
        }
        await crearEvento(nombre, fecha, ubicacion);
        res.status(201).json({mensaje:'Evento creado.'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Evento no creado"})
    }
})

app.get("/eventos", async (req,res) => {
    try {
        const eventos = await consultarEventos()
        res.json(eventos);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema al consultar eventos.' });
    }
})

app.get("/eventos/:id", async(req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json("ID requerido.")
    }
    try {
        const evento = await consultarEvento(id)
        if(evento){
            res.status(200).json(evento);
        } else {
            res.status(400).json({error:"Evento no existe"});
        } 
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error al hacer la consulta."})
        
    }
});

app.put("/eventos/:id", async(req,res) => {
    const id = req.params.id;
    try {
        const {nombre, fecha, ubicacion} = req.body;
        if (!nombre || !fecha || !ubicacion) {
            return res.status(400).json("Error de datos.")
        }
        await editarEvento(id, {nombre:nombre, fecha:fecha, ubicacion:ubicacion})
        res.status(201).json({mensaje:'Evento editado.'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error al editar evento."})
    }

})

app.delete("/eventos/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const evento = await consultarEvento(id)
        if (evento) {
            borrarEvento(id)
            res.status(200).json({mensaje:"Evento borrado"})
        } else {
            res.status(404).json({mensaje:"Evento ya fue borrado."})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error al borrar evento."})
        
    }
})

app.post("/reservas", async (req, res) => {
    crearTablaReservas();
    try {
        const {evento_id, nombre_usuario, cantidad_boletos, fecha_reserva} = req.body;
        const evento = await consultarEvento(evento_id)
        if (!evento_id || !nombre_usuario || !cantidad_boletos || !fecha_reserva) {
            return res.status(400).json("Se necesita llenar todos los campos.")
        }
        if (!evento || evento.length === 0) {
            return res.status(400).json("No puedes crear en un evento que no existe.")
        } else {
        crearReserva(evento_id, nombre_usuario, cantidad_boletos, fecha_reserva);
        res.status(201).json({mensaje:'Reserva creada.'})}
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Reserva no creada"})
    }
})

app.get("/reservas", async (req,res) => {
    try {
        const reservas = await consultarReservas()
        res.json(reservas);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema al consultar reservas.' });
    }
})

app.get("/reservas/:id", async(req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json("ID requerido.")
    }
    try {
        const evento = await consultarReserva(id)
        if(evento){
            res.status(200).json(evento);
        } else {
            res.status(400).json({error:"Reserva no existe"});
        } 
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error al hacer la consulta."})
        
    }
});

app.put("/reservas/:id", async(req,res) => {
    const id = req.params.id;
    try {
        const {evento_id, nombre_usuario, cantidad_boletos, fecha_reserva} = req.body;

        if (!evento_id || !nombre_usuario || !cantidad_boletos || !fecha_reserva) {
            return res.status(400).json("Error de datos.")
        }
        await editarReserva(id, {evento_id:evento_id, nombre_usuario:nombre_usuario, cantidad_boletos:cantidad_boletos, fecha_reserva:fecha_reserva})
        res.status(201).json({mensaje:'Reserva editada.'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error al editar reserva."})
    }

})

app.delete("/reservas/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const reserva = await consultarReserva(id)
        if (reserva) {
            borrarReserva(id)
            res.status(200).json({mensaje:"Reserva borrada"})
        } else {
            res.status(404).json({mensaje:"Reserva ya fue borrada."})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error al borrar reserva."})
        
    }
})

const db = new Sequelize(
    "eventos",
    "root",
    "",
    {
        "host":"localhost",
        "dialect":"mysql"
    }
)




const eventos_tabla = db.define("eventos", {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING
    },
    fecha:{
        type:DataTypes.DATEONLY
    },
    ubicacion:{
        type:DataTypes.STRING
    }
})

const reservas_tabla = db.define("reservas", {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    evento_id:{
        type:DataTypes.INTEGER,
        references: {
            model: eventos_tabla,
            key: 'id'
        }
    },
    nombre_usuario:{
        type:DataTypes.STRING
    },
    cantidad_boletos:{
        type:DataTypes.INTEGER
    },
    fecha_reserva:{
        type:DataTypes.DATEONLY
    }
})

async function crearTablaEventos() {
    try {
        await eventos_tabla.sync()
    } catch (error) {
        console.log(error)
    }
}

async function crearEvento(nombre, fecha, ubicacion){
    try {
        const data = eventos_tabla.build({nombre:nombre, fecha:fecha, ubicacion:ubicacion})
        await data.save()
    } catch (error) {
        console.log(error)
    }
}

async function consultarEventos() {
    try {
        const data = await eventos_tabla.findAll();
        return data
    } catch (error) {
        console.log(error)
    }   
}

async function consultarEvento(id) {
    try {
        const data = await eventos_tabla.findAll({
            where: {
                id:id
            }
        })
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function editarEvento(id, datos) {
    try {
        await eventos_tabla.update(datos, {
            where: {
                id: id
            }
        });
        console.log("Evento actualizado correctamente");
    } catch (error) {
        console.log(error);
    }

}

async function borrarEvento(id) {
    try {
        await eventos_tabla.destroy(
            {
                where:{
                    id:id
                },
            },
        );
    } catch (error) {
        console.log(error)
        
    }
}

async function crearTablaReservas() {
    try {
        reservas_tabla.belongsTo(eventos_tabla, {
            foreignKey: 'evento_id'
        });
        await reservas_tabla.sync()
    } catch (error) {
        console.log(error)
    }
}

async function crearReserva(evento_id, nombre_usuario, cantidad_boletos, fecha_reserva){
    try {
        const data = reservas_tabla.build({evento_id:evento_id, nombre_usuario:nombre_usuario, cantidad_boletos: cantidad_boletos, fecha_reserva: fecha_reserva})
        await data.save()
    } catch (error) {
        console.log(error)
    }
}

async function consultarReservas() {
    try {
        const data = await reservas_tabla.findAll();
        return data;
    } catch (error) {
        console.log(error)
    }   
}

async function consultarReserva(id) {
    try {
        const data = await reservas_tabla.findAll({
            where: {
                id:id
            }
        })
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function editarReserva(id, datos) {
    try {
        console.log("Accediendo a base de datos.")
        await reservas_tabla.update(datos, {
            where: {
                id: id
            }
        })
       console.log( "Reserva actualizada correctamente");
    } catch (error) {
        console.log(error);
    }
}

async function borrarReserva(id) {
    try {
        await reservas_tabla.destroy(
            {
                where:{
                    id:id
                },
            },
        );
    } catch (error) {
        console.log(error)
        
    }
}



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })