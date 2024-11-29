import express from 'express';
const server = express();
const porta = 3000;

server.use(express.json());

let autores = [];

server.get("/autores", (req, res) => {
    res.json(autores); 
});

server.get("/autores/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const autor = autores.find((autor) => autor.id === id); 
    if (!autor) {
        return res.status(404).json({ mensagem: "Autor não encontrado" }); 
    }
    res.json(autor);
});

server.post("/autores", (req, res) => {
    const novoAutor = req.body; 
    const erros = autenticacaoAutores(novoAutor);
    if (erros.length > 0) {
        return res.status(400).json(erros); 
    }
    autores.push(novoAutor); 
    res.status(201).json(novoAutor);
});

function autenticacaoAutores(autor) {
    const erros = [];
    if (!autor.nome || autor.nome.length < 3 || autor.nome.length > 100) { 
        erros.push("Nome do autor deve conter entre 3 e 100 caracteres");
    }
    return erros; 
}

let livros = [];

server.get("/autores/:id/livros", (req, res) => {
    const autorId = parseInt(req.params.id);
    const livrosAutor = livros.filter(livro => livro.autorId === autorId);
    if (livrosAutor.length > 0) {
        res.json(livrosAutor);
    } else {
        res.status(404).json({ message: "Livros não encontrados" });
    }
});
    server.post("/autores/:id/livros", (req,res) =>{
        const livro = req.body;
        const autorId = parseInt(req.params.id);
        if(!livro.titulo || !autorId){
            return res.status(400).json({ mensagem: "Título e autor são obrigatórios" });
        }
        const autorExistente = autores.find(a => a.id === autorId);
    if (!autorExistente) {
        return res.status(404).json({ mensagem: "Autor não encontrado." });
    }
        livro.autorId = autorId;
        livros.push(livro);
        res.status(201).json(livro);
    });

server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});