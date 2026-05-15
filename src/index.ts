import express from 'express';
import cors from "cors"
import { sql } from './database/postgres';

const app = express()
app.use(express.json());
app.use(cors({
    origin: "*"
}))

interface Entries {
    id:number,
    data: string
}

app.get("/", async (req: express.Request, res: express.Response) => {
    return res.json({
        cod: "Ok - ts",
        message: "Server is running!"
    });
})

app.put("/access", async (req: express.Request, res: express.Response) => {
    try {
        const result = await sql`insert into acessos (code) values ('')
        RETURNING ID`;
        return res.status(201).json({ 
            mensagem: "Criado com sucesso!",
            acessos: result[0].id + 800
        })
    } catch (err) {
        return res.status(500).json({ 
            mensagem: "Internal Server Error.",
        })
    }
})

app.get("/access", async (req: express.Request, res: express.Response) => {
    try {
        const acessos = await sql`select count(*) as acessos from acessos`;
        if (acessos.length <= 0) {
            return res.status(204).json({ mensagem: "nenhum resultado encontrado" })
        }
        return res.json(acessos[0]);
    } catch {
        return res.status(404).json({ mensagem: "Não foi possivel consultar!" })
    }
})

app.get("/show", async (req: express.Request,res: express.Response) => {
    try {
        const acessos:Entries[] = await sql`SELECT ID, to_char(CREATED_AT, 'DD/MM/YYYY hh24:mm:ss') AS DATA FROM ACESSOS ORDER BY ID DESC LIMIT 20`;
        if (acessos.length <= 0) {
            return res.status(204).json({ mensagem: "nenhum resultado encontrado" })
        }
        return res.json(acessos);
    } catch {
        return res.status(404).json({ mensagem: "Não foi possivel consultar!" })
    }
})

const port = process.env.PORT || 3333
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})