import express from 'express';

const middleware = () => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
  };
};

export default middleware;