export const wrapExpressMiddlewareForSocketIO = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);
