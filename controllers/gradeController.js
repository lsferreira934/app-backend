import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const stundent = db.gradeModel; // recebe do model para distribuir entre as funções

const create = async (req, res) => {
  const stundent = new stundent({
    name: req.body.name,
    subject: req.body.subject,
    type: req.body.type,
    value: req.body.value,
  });

  try {
    const data = await stundent.save();
    res.send(data);
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    //procurar todos
    const data = await stundent.find({ condition });
    // verificação
    if (!data) {
      res.status(404).send('Estudante não enconstrado.');
    }

    res.send(data);
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    //procurar um
    const data = await stundent.findById({ _id: id });

    // verificação
    if (!data) {
      res.status(404).send('Estudante não enconstrado.');
    }

    res.send(data);
    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    //procurar um e atualiza
    const data = stundent.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    // verificação
    if (!data) {
      res.status(404).send('Estudante não enconstrado para atualizar.');
    }

    res.send(data);

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    //procurar um e remove
    const data = stundent.findByIdAndRemove({ _id: id });

    // verificação
    if (!data) {
      res.status(404).send('Estudante não enconstrado para excluir.');
    }

    res.send('Estudante excluido com sucesso!.');

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    //remove tudos
    const data = stundent.deleteMany();

    // verificação
    if (!data) {
      res.status(404).send('Estudante não enconstrado para atualizar.');
    }

    res.send('Estudantes excluidos com sucesso!.');

    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll }; // exportando para app
