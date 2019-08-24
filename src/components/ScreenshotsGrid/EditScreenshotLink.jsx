import React from 'react';
import queryString from 'qs';

export default function EditScreenshotLink({ screenshot }) {
  return <a href={generateEditLink(screenshot)}>Modifier</a>;
}

function generateEditLink(screenshot) {
  return `/modifier/${screenshot.id}?${queryString.stringify({
    name: screenshot.gameCanonicalName,
    alternativeNames: screenshot.alternativeNames,
    year: screenshot.year || '',
    url: screenshot.imageUrl,
  })}`;
}
