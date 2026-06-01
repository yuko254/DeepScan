import type { Request, Response, NextFunction } from 'express';

export function missingResourceMiddleware(req: Request, res: Response, next: NextFunction) {
  const isBrowser = req.headers.accept?.includes('text/html') &&
    !req.headers.accept?.includes('application/json');

  if (isBrowser) {
    res.status(404).send(html);
  } else {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
      statusCode: 404
    });
  }
}

const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          h1 {
            font-size: 6rem;
            margin: 0;
            font-weight: 700;
          }
          p {
            font-size: 1.5rem;
            margin: 1rem 0;
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>Oops! The page you're looking for doesn't exist.</p>
        </div>
      </body>
      </html>
    `