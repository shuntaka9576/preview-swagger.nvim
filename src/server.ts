import * as http from 'http';

import socketio from 'socket.io';

import { getModuleLogger } from './util/logger';
import { initPlugin } from './nvim';
import { openBrowser } from './util/open-browser';
import { routes } from './route';
import { parseSwaggerContent } from './util/swagger-ui';

const logger = getModuleLogger();

const main = async (): Promise<void> => {
  const server = http.createServer((req, res) => {
    routes(req, res);
  });

  const defaultHost = '127.0.0.1';
  const defaultPort = 9126;

  let host = defaultHost;
  let port = defaultPort;

  const plugin = await initPlugin();
  const pswagLunchIp = await plugin.nvim.getVar('pswag_lunch_ip');
  const pswagLunchPort = await plugin.nvim.getVar('pswag_lunch_port');

  if (pswagLunchIp != null) host = pswagLunchIp as string;
  if (pswagLunchPort != null) port = pswagLunchPort as number;

  await plugin.nvim.setVar('pswag_lunch_ip', host);
  await plugin.nvim.setVar('pswag_lunch_port', port);

  const connections: { [key: number]: string[] } = {};
  const io = socketio(server);
  io.on('connection', async socket => {
    const bufnr = (await plugin.nvim.call('bufnr', '%')) as number;
    connections[bufnr]
      ? connections[bufnr].push(socket.id)
      : (connections[bufnr] = [socket.id]);
    logger.debug(`connected: ${JSON.stringify(connections)}`);
    await plugin.nvim.call('pswag#rpc#refresh_content');

    socket.on('disconnect', () => {
      logger.debug('disconnected');
    });
  });

  server.listen(
    port,
    host,
    async (): Promise<void> => {
      plugin.init({
        openBrowser: async url => {
          openBrowser(url);
        },
        refreshContent: async bufnr => {
          const fileFullPath = await plugin.nvim.call('expand', '%:p');
          const bufferRows = await plugin.nvim.buffer.getLines();
          const parseSwaggerContentResponse = parseSwaggerContent({
            bufferRows: bufferRows,
            fileFullPath: fileFullPath,
          });

          if (
            !connections[bufnr] ||
            !parseSwaggerContentResponse.swaggerContent
          ) {
            logger.debug(
              `refresh faild for connections: ${connections[bufnr]}`,
            );
            logger.debug(
              `refresh faild for swaggerContent: ${parseSwaggerContentResponse.swaggerContent}`,
            );
            return;
          }

          if (!parseSwaggerContentResponse.isError) {
            connections[bufnr].forEach(id => {
              logger.debug(`refresh_content:${id}`);
              io.to(id).emit(
                'clear_error',
                parseSwaggerContentResponse.swaggerContent,
              );
              io.to(id).emit(
                'refresh_content',
                parseSwaggerContentResponse.swaggerContent,
              );
            });
          } else {
            logger.debug(`emit errmsg`);
            connections[bufnr].forEach(id => {
              io.to(id).emit(
                'parse_error',
                parseSwaggerContentResponse.errMessage,
              );
            });
          }
        },
      });

      plugin.nvim.call('pswag#rpc#open_browser');
    },
  );
};

main()
  .then(() => logger.debug('process finish'))
  .catch(err => logger.debug(`process error: ${err}`));
