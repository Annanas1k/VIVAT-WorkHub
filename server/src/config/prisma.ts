import { PrismaClient, Prisma } from '@prisma/client';
import path from 'path';
import fs from 'fs'

const logDir = path.join(__dirname, '../../logs')
const logFilePath = path.join(logDir, 'prisma.log')

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const writeToLogFile = (message: string) =>{
    const timestamp = new Date().toISOString()
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`, 'utf-8')
}

export const prisma = new PrismaClient({
    log: [
        {emit: 'event', level: 'query'},
        {emit: 'event', level: 'info'},
        {emit: 'event', level: 'warn'},
        {emit: 'event', level: 'error'},
    ]
});


prisma.$on('query', (e: Prisma.QueryEvent) => {
  writeToLogFile(`QUERY: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
});

prisma.$on('error', (e: Prisma.LogEvent) => {
  writeToLogFile(`ERROR: ${e.message}`);
});

prisma.$on('warn', (e: Prisma.LogEvent) => writeToLogFile(`WARN: ${e.message}`));
prisma.$on('info', (e: Prisma.LogEvent) => writeToLogFile(`INFO: ${e.message}`));






export default prisma;