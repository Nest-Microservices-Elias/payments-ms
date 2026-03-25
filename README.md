## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Stripe
- prueba de webhooks
https://dashboard.stripe.com/acct_1TEJBcA0wqV6ZnYC/test/workbench/webhooks

1. Descarga la CLI de Stripe e inicia sesión con tu cuenta de Stripe.
```bash
stripe logiin
```
2. Envía eventos a tu destino
```bash
stripe listen --forward-to localhost:3003/payments/webhook
```
3. Activar eventos con la CLI
```bash
stripe trigger payment_intent.succeeded
```

- configuracion de stripeWebhook para los secrets y etc (payments.service.ts)
https://docs.stripe.com/webhooks/quickstart


## HookDeck

1. Isntalar HookDeck
```bash
npm install hookdeck-cli -g
```
2. Inicia sesión
```bash
hookdeck login
```
3. Activar eventos 
```bash
hookdeck listen 3003 stripe-to-localhost --path /payments/webhook```
```
