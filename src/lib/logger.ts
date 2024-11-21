import pino, { Logger } from "pino";
import pretty from "pino-pretty";

// Colocar no next.config.mjs para funcionar no Next.js
// experimental: {
//   serverComponentsExternalPackages: ["pino", "pino-pretty"],
// },

// Configura o transport para gravar logs formatados no arquivo
const prettyFileTransport = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: false, // Desabilita cores no arquivo
    translateTime: "SYS:standard", // Adiciona timestamp formatado
    ignore: "pid,hostname", // Remove pid e hostname
    destination: "./log.log", // Especifica o arquivo de destino
  },
});

// Stream de logs
const streams = [
  {
    stream: pretty(), // Saída formatada no console
  },
  {
    stream: prettyFileTransport,
  },
];

// Configura o logger
export const logger: Logger =
  process.env["NODE_ENV"] === "production"
    ? // JSON em produção
      pino({ level: "warn" }, pino.multistream(streams))
    : // Pretty print em desenvolvimento
      pino(
        {
          level: "debug",
        },
        pino.multistream(streams)
      );
