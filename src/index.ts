import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'
import { type } from 'os'
import { stringify } from 'querystring'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id // nao precisa identificar o tipo, params sempre vem como string

        const result = accounts.find((account) => account.id === id)

        if (!result) {
            res.status(404)
            //res.statusCode = 404
            throw new Error("Conta não encontrada. Verifique a `id`.")
        }

        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        res.send(error.message);
    }
});

app.delete("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        if (id[0] !== "a") {
            res.status(400)
            throw new Error("`id` inválido. Deve iniciar com a letra `a`.")
        }

        const accountIndex = accounts.findIndex((account) => account.id === id)

        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
            res.status(200).send("Item deletado com sucesso")
        } else {
            res.status(404).send("Conta não existe. verifique o `id`")
        }

    } catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
});

app.put("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id
        const newOwnerName = req.body.ownerName
        const newBalance = req.body.balance
        const newType = req.body.type


        if (newId !== undefined) {
            if (newId[0] !== "a") {
                res.status(400)
                throw new Error("A `id` deve se iniciar com a letra `a`")
            }{
            if (newOwnerName.length < 2) {
                res.status(400)
                throw new Error("O `ownerName` deve ter no minimo 2 caracteres")
            }
        }

        }

        if (newBalance !== undefined) {
            if (typeof newBalance !== "number") {
                res.status(400)
                throw new Error("`balance` deve ser do tipo `number`")
            }
            if (newBalance < 0) {
                res.status(400)
                throw new Error("`balance` deve ter valor maior ou igual a zero")
            }
        }

        if (newType !== undefined) {
            if (
                newType !== ACCOUNT_TYPE.GOLD &&
                newType !== ACCOUNT_TYPE.BLACK &&
                newType !== ACCOUNT_TYPE.PLATINUM
            ) {
                res.status(400)
                throw new Error("`type` deve ser um tipo válido: Ouro, Platina ou Black")
            }
        }

        const account = accounts.find((account) => account.id === id)

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type

            account.balance = isNaN(newBalance) ? account.balance : newBalance
        }

        res.status(200).send("Atualização realizada com sucesso")
    } catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
});

//  Para fixar, agora é sua vez de implementar as seguintes validações:
// req.body.id (newId)
// string que inicia com a letra ‘a’

// req.body.ownerName (newOwnerName)
// string com no mínimo 2 caracteres