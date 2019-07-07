const template = require('../template');

module.exports = ({ user, screenshots, unsubscribeLink, userSpaceLink }) => ({
  subject: `${screenshots.length} nouveaux screenshots ont été ajoutés !`,
  text: `Bonjour ! ${screenshots.length} nouveaux screenshots ont été ajoutés sur le site. Allez les voir !`,
  html: template.body(`
    <div style="text-align: center;">
      ${template.p(`Bonjour ${user.username},`)}
      ${template.p(
        `${screenshots.length} nouveaux screenshots ont été ajouté sur guess-the-game.com.`
      )}
      ${template.p(
        'Si vous en connaissez, soyez le premier ou la première à les résoudre en cliquant dessus !'
      )}
      ${screenshots
        .map(
          screenshot => `
            <div style="display:inline-block;width:320px;margin:10px;">
              <a href="${screenshot.siteUrl}" target="_blank">
                <img style="max-width: 100%;" src="${screenshot.imageUrl}" alt="${screenshot.siteUrl}" /><br/>
                #${screenshot.id}
              </a>
            </div>
        `
        )
        .join('')}
    </div>
    ${template.p(
      `Vous pouvez changer la fréquence d'envoi de ces emails dans <a target="_blank" href="${userSpaceLink}">votre espace perso</a>.`
    )}
    ${template.p(
      `Si vous ne souhaitez plus recevoir ces emails du tout, <a target="_blank" href="${unsubscribeLink}">cliquez sur ce lien.</a>`
    )}
  `),
});
