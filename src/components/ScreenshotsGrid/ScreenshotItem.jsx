import React from 'react';
import { Link } from 'react-router-dom';
import ModerationBox from './ModerationBox';
import EditScreenshotLink from './EditScreenshotLink';
import helperService from '../../services/helperService';

export default ({ screenshot, canModerateScreenshots, canEditScreenshots }) => (
  <div
    className="ScreenshotsGrid_item"
    to={`/screenshot/${screenshot.id}`}
    title={screenshot.name}
  >
    <Link to={`/screenshot/${screenshot.id}`}>
      <div
        style={{
          backgroundImage: `url(${screenshot.imageUrl})`,
        }}
        className="ScreenshotsGrid_item_image"
      >
        {canEditScreenshots && (
          <ScreenshotApprovalStatus
            approvalStatus={screenshot.approvalStatus}
            refusalReason={screenshot.refusalReason}
          />
        )}
      </div>
    </Link>
    <div className="ScreenshotsGrid_item_legend">
      {canEditScreenshots ? (
        <div style={{ float: 'right' }}>
          <EditScreenshotLink screenshot={screenshot} />
        </div>
      ) : null}
      <p className="ScreenshotsGrid_item_legend_name">
        #{screenshot.id} - {screenshot.gameCanonicalName}{' '}
        {screenshot.year ? `(${screenshot.year})` : null}
      </p>
      {(screenshot.alternativeNames || []).map(name => (
        <p key={name}>
          ou{' '}
          <span className="ScreenshotsGrid_item_legend_alternativeName">
            {name}
          </span>
        </p>
      ))}
      {!canModerateScreenshots && screenshot.solvedAt ? (
        <p>Résolu le {helperService.formatDate(screenshot.solvedAt)}</p>
      ) : (
        <p>Ajouté le {helperService.formatDate(screenshot.createdAt)}</p>
      )}
      {canModerateScreenshots ? (
        <ModerationBox screenshot={screenshot} />
      ) : null}
    </div>
  </div>
);

function ScreenshotApprovalStatus({ approvalStatus, refusalReason }) {
  if (approvalStatus === 'approved') {
    return (
      <p className="ScreenshotsGrid_item_image_approvalStatus -approved">
        Approuvé
      </p>
    );
  }
  if (approvalStatus === 'waiting') {
    return (
      <p className="ScreenshotsGrid_item_image_approvalStatus -waiting">
        En attente...
      </p>
    );
  }
  if (approvalStatus === 'refused') {
    return (
      <p className="ScreenshotsGrid_item_image_approvalStatus -refused">
        Refusé ({refusalReasonToText(refusalReason)})
      </p>
    );
  }
  return null;
}

function refusalReasonToText(refusalReason) {
  if (refusalReason === 'alreadySubmitted') {
    return 'Image similaire déjà proposée';
  }
  if (refusalReason === 'badQuality') {
    return 'Qualité insuffisante';
  }
  if (refusalReason === 'existsInGoogleImage') {
    return 'Réponse trouvable avec Google Image';
  }
  if (refusalReason === 'gameNotFamousEnough') {
    return 'Jeu pas assez connu';
  }
  if (refusalReason === 'notAGame') {
    return "Ce n'est pas un jeu";
  }
  if (refusalReason === 'tooMuchOfThisGame') {
    return 'Jeu déjà trop présent sur le site';
  }
  if (refusalReason === 'spam') {
    return 'Spam';
  }
  return 'Raison non spécifiée';
}
