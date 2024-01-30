![realtor](https://github.com/psparsa/realtor/assets/57572461/981cc5cd-9cd1-491a-84e4-a562d447867e)

### Realtor
This project was an exercise while learning Nest.js concepts, aiming to provide a hands-on experience in implementing a REST API for a real estate-related website. 


### Prerequisites
- [Node.js](https://nodejs.org/en) <= v18
- [Docker](https://www.docker.com) <= v4

### Development:


1. Populate the `.env` file:

```bash
cp .env.example .env
# then set the environment variables in the .env
```

2. Start the development server:

```bash
docker compose -f docker-compose.dev.yml up
```

3. Access the API:

After starting the development server, you can send requests to the API at: http://127.0.0.1:3000

5. Additional Resources:

Prisma Studio:  http://127.0.0.1:5555

phpMyAdmin: http://127.0.0.1:8080
