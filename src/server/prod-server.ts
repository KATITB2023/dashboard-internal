import { loadEnvConfig } from '@next/env';
import http from 'http';
import { parse } from 'url';
import next from 'next';
import { updatePinPerUnitSchedule } from '~/server/cron-job/update-pin-per-unit';
import { env } from '~/env.cjs';

// Load environment variables from .env before doing anything else
loadEnvConfig(process.cwd());

const port = env.PORT;
const dev = env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto === 'http') {
      // Redirect to ssl
      const host = req.headers.host ?? '';
      const url =
        (req.headers.url instanceof Array
          ? req.headers.url[0]
          : req.headers.url) ?? '';

      res.writeHead(303, {
        location: `https://${host}${url}`
      });
      res.end();

      return;
    }

    const parsedUrl = parse(req.url ?? '', true);
    void handle(req, res, parsedUrl);
  });

  // Start Schedule (schedule is only run on production)
  updatePinPerUnitSchedule.start();

  console.log(
    `Server listening at http://localhost:${port} as ${
      dev ? 'development' : env.NODE_ENV
    }`
  );

  process.on('SIGTERM', () => {
    console.log('SIGTERM');

    // Stop Schedule
    updatePinPerUnitSchedule.stop();
  });

  server.listen(port);
});
