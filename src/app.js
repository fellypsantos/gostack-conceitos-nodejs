const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const projectExists = (request, response, next) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) return response.status(400).json({ error: 'Project not found.' });

  return next();
}

app.use('/repositories/:id', projectExists);

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {url, title, techs} = request.body;
  const repo = {
    id: uuid(),
    url,
    title,
    likes: 0,
    techs,
  }

  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {url, title, techs} = request.body;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  const likes = repositories[repoIndex].likes;

  const updatedRepository = {
    id,
    url,
    likes,
    title,
    techs,
  }

  repositories[repoIndex] = updatedRepository;
  return response.json(updatedRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repoIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", projectExists, (request, response) => {
  const {id} = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);
  const repository = repositories[repoIndex];

  repositories[repoIndex].likes += 1;
  return response.json({ likes: repository.likes });

});

module.exports = app;
