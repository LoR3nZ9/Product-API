const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs');


let products = {};
let productIdCounter = 1;

fastify.get('/product.html', async (request, reply) => {
    const filePath = path.join(__dirname, 'product.html');
    if (fs.existsSync(filePath)) {
        reply.type('text/html').send(fs.readFileSync(filePath, 'utf8'));
    } else {
        reply.code(404).send({ message: 'File not found' });
    }
});

fastify.post('/api/products', async (request, reply) => {
    const product = request.body;
    const id = productIdCounter++;
    product.id = id;
    products[id] = product;
    return product;
});


fastify.get('/api/products', async (request, reply) => {
    return Object.values(products);
});


fastify.get('/api/products/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const product = products[id];
    if (product) {
        return product;
    } else {
        reply.code(404).send({ message: 'Product not found' });
    }
});


fastify.put('/api/products/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const updatedProduct = request.body;
    if (products[id]) {
        updatedProduct.id = id;
        products[id] = updatedProduct;
        return updatedProduct;
    } else {
        reply.code(404).send({ message: 'Product not found' });
    }
});


fastify.delete('/api/products/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    if (products[id]) {
        delete products[id];
        reply.code(204).send();
    } else {
        reply.code(404).send({ message: 'Product not found' });
    }
});


fastify.get('/', async (request, reply) => {
    return { message: 'Welcome to the API!' };
});


fastify.listen(7000, '0.0.0.0', (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});
