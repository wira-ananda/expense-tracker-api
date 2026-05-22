import 'reflect-metadata';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const server = express();

let isReady = false;

function getAllowedOrigins() {
  const frontendUrl = process.env.FRONTEND_URL || '';
  const clerkAuthorizedParties = process.env.CLERK_AUTHORIZED_PARTIES || '';

  return [
    'http://localhost:3000',
    'https://expensetracker-system-dashboard.vercel.app',
    ...frontendUrl.split(','),
    ...clerkAuthorizedParties.split(','),
  ]
    .map((origin) => origin.trim())
    .filter(Boolean);
}

server.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

async function bootstrap() {
  if (isReady) return;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.init();
  isReady = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await bootstrap();
  return server(req, res);
}