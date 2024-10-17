# Projeto FundMe

## Requisitos para o Contrato FundMe:

- **Conversão de ETH para USD:** O contrato deve utilizar um oráculo Chainlink para converter o valor de ETH enviado para o equivalente em USD.
- **Valor Mínimo de Contribuição:** O contrato deve garantir que o valor mínimo de contribuição seja de 5 USD. Contribuições abaixo desse valor devem ser rejeitadas automaticamente.
- **Registro de Contribuições:** Cada vez que um endereço envia ETH, o contrato deve armazenar o valor da contribuição em um mapeamento que registra o total contribuído por cada doador.
- **Função de Contribuição (`fund`):** A função deve permitir que os usuários contribuam com ETH, verificando se o valor enviado atende ao mínimo exigido em USD.
- **Saque de Fundos:** Apenas o proprietário do contrato pode retirar os fundos acumulados. A função `withdraw` deve esvaziar o mapeamento de contribuições e transferir todos os fundos para o proprietário.
- **Segurança de Acesso:** Funções restritas, como a retirada de fundos, devem ser protegidas pelo modificador `onlyOwner`, garantindo que apenas o proprietário possa executá-las.
- **Oráculo de Preço:** O contrato deve ser inicializado com o endereço do Chainlink Price Feed para obter dados de preço.
- **Deploy na rede teste Sepolia:** O contrato deve ser inicializado com o endereço do Chainlink Price Feed para obter dados de preço.

