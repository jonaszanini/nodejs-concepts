const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { url, title, techs } = request.body;
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

    if (repositoryIndex < 0) return response.status(400).json({ error: "Repository not found" });

    const repository = {
        id,
        url,
        title,
        techs,
        likes: repositories[repositoryIndex].likes,
    };

    repositories[repositoryIndex] = repository;

    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

    if (repositoryIndex > 0) {
        repositories.splice(repositoryIndex, 1);
        return response.status(204).json(repositories);
    }

    return response.status(400).json({ error: "No repository found with this ID" });
});

app.post("/repositories/:id/like", validateId, (request, response) => {
    const { id } = request.params;

    const repository = repositories.find((repo) => repo.id === id);

    repository.likes++;

    return response.json(repository);
});

function validateId(request, response, next) {
    const { id } = request.params;

    if (!repositories.find((repo) => repo.id === id)) {
        return response.status(400).json({ error: "id not found" });
    }

    return next();
}

module.exports = app;
