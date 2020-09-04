import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // adicionado cor para ligação do back para o fronte
import { gradeRouter } from './routes/gradeRouter.js';
import { db } from './models/index.js';

(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    process.exit();
  }
})();

const app = express();
app.use(express.json());
app.use(gradeRouter);

//define o dominio de origem para consumo do servico
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cors pegando o endereço do front para conexão
app.use(
  cors({
    origin: 'https://newapp-frontend.herokuapp.com/grade',
  })
);

app.get('/', (req, res) => {
  res.send('API em execucao');
});

app.listen(process.env.PORT || 8081, () => {});
