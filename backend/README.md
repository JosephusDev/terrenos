# Sistema de Reserva Fundiária Urbana (RFU)

Este é um sistema de gestão de reservas fundiárias urbanas desenvolvido com Node.js, Express e TypeScript. O sistema permite gerenciar espaços, utentes (usuários) e reservas fundiárias.

## Estrutura do Projeto

```
├── src/
│   ├── app.ts                 # Arquivo principal da aplicação
│   ├── config/
│   │   └── database.ts        # Configuração da conexão com o banco de dados
│   ├── controllers/
│   │   ├── Espaco.ts          # Controlador para gestão de espaços
│   │   ├── Reserva.ts         # Controlador para gestão de reservas
│   │   ├── Utente.ts          # Controlador para gestão de utentes
│   │   └── authController.ts  # Controlador para autenticação
│   ├── middlewares/
│   │   └── authMiddleware.ts  # Middleware para proteção de rotas
│   ├── routes/
│   │   ├── Espaco.ts          # Rotas para gestão de espaços
│   │   ├── Reserva.ts         # Rotas para gestão de reservas
│   │   ├── Utente.ts          # Rotas para gestão de utentes
│   │   └── authRoutes.ts      # Rotas para autenticação
│   └── types.ts               # Definição de tipos personalizados
```

## Modelagem do Banco de Dados

### Entidades e Atributos

#### Utilizador
- **id**: Identificador único (PK)
- **utilizador**: Nome de usuário
- **senha**: Senha criptografada
- **nivel**: Nível de acesso do usuário

#### Utente
- **id**: Identificador único (PK)
- **nome**: Nome do utente
- **telemovel**: Número de telefone móvel
- **bi**: Número do Bilhete de Identidade
- **data_nascimento**: Data de nascimento
- **endereco**: Endereço do utente

#### Reserva
- **id**: Identificador único (PK)
- **nome**: Nome da reserva fundiária

#### Espaco
- **id**: Identificador único (PK)
- **numero_espaco**: Número do espaço
- **tipo**: Tipo do espaço
- **dimensao**: Dimensão do espaço
- **quarteirao**: Quarteirão onde o espaço está localizado
- **data_aquisicao**: Data de aquisição do espaço
- **id_utente**: Referência ao utente proprietário (FK)
- **id_reserva**: Referência à reserva a que pertence (FK)

### Relacionamentos

1. **Utente - Espaco**: Um utente pode ter vários espaços (1:N)
   - Um utente pode ser proprietário de múltiplos espaços
   - Um espaço pertence a apenas um utente

2. **Reserva - Espaco**: Uma reserva contém vários espaços (1:N)
   - Uma reserva fundiária pode conter múltiplos espaços
   - Um espaço pertence a apenas uma reserva

### Visões (Views)

O sistema utiliza as seguintes visões para consultas específicas:

- **ver_espacos**: Exibe informações detalhadas sobre os espaços, incluindo dados da reserva e do utente
- **ver_reservas**: Exibe informações detalhadas sobre as reservas
- **ver_utentes_sem_espaco**: Exibe utentes que ainda não possuem espaços atribuídos

## Funcionalidades

### Autenticação
- Registro de novos usuários
- Login com geração de token JWT
- Proteção de rotas com middleware de autenticação

### Gestão de Utentes
- Cadastro de novos utentes
- Atualização de dados de utentes
- Exclusão de utentes
- Listagem de utentes
- Listagem de utentes sem espaços atribuídos

### Gestão de Reservas
- Cadastro de novas reservas fundiárias
- Atualização de dados de reservas
- Exclusão de reservas
- Listagem de reservas
- Contagem de utentes beneficiados por reserva

### Gestão de Espaços
- Cadastro de novos espaços
- Exclusão de espaços
- Listagem de espaços
- Contagem de espaços por tipo

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **TypeScript**: Superset tipado de JavaScript
- **MySQL**: Sistema de gerenciamento de banco de dados
- **JWT**: JSON Web Tokens para autenticação
- **bcryptjs**: Biblioteca para criptografia de senhas
- **CORS**: Middleware para habilitar o Cross-Origin Resource Sharing

## Configuração

O sistema utiliza variáveis de ambiente para configuração, que devem ser definidas em um arquivo `.env` na raiz do projeto:

```
PORT=8800
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=sua_chave_secreta
```