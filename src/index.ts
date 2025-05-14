import express, {Express, Request, Response} from 'express'

const app: Express = express();
const port: number = parseInt('3000');

app.get('/', (req: Request, res: Response) => {
    res.send('¡Hola desde Express con TypeScript!');
  });

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
})