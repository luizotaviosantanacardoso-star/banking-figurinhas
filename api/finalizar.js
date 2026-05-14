const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
// Serve os arquivos estáticos do front-end (coloque seu HTML numa pasta chamada 'public')
app.use(express.static('public')); 

app.post('/api/finalizar', async (req, res) => {
    const { total, email } = req.body;

    // Configurações da API conforme os dados coletados na imagem
    const url = 'https://pix.evopay.cash/v1/account/transactions';
    const token = '89b08ebe-e1fe-484b-863e-564082b82d32'; // Seu Token Real inserido de forma segura

    const dadosTransacao = {
        amount: total, // Recebe dinamicamente o valor total acumulado no carrinho
        callbackUrl: `https://seu-site-de-figurinhas.com/webhook/evopay` // Mude para o seu link de notificações
    };

    try {
        const response = await axios.post(url, dadosTransacao, {
            headers: {
                'API-Key': token,
                'Content-Type': 'application/json'
            }
        });

        // Devolve o objeto contendo o qrCodeText para o front-end exibir na tela
        return res.json(response.data);

    } catch (error) {
        console.error('Erro na comunicação com a Evopay:', error.response ? error.response.data : error.message);
        return res.status(500).json({ 
            success: false, 
            message: error.response ? error.response.data.message : "Erro interno no servidor." 
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor ativo na porta 3000. Pronto para processar checkouts Pix.');
});