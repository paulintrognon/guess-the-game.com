module.exports = {
  body: content => `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <div style="padding: 20px;">
        <div style="margin: auto;max-width: 900px;padding:20px;background-color:white;">
          ${content}
          <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin-top: 15px;">
            Merci et à bientôt sur <a href="https://guess-the-game.com">guess-the-game.com</a> !
          </p>
        </div>
      </div>
      <div style="font-family: sans-serif; padding-bottom: 20px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
        <a href="https://guess-the-game.com" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">Email automatique envoyé par Guess the Game</a>
      </div>
    </body>
  </html>
  `,
  p: content => `
  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
      ${content}
  </p>
  `,
};
