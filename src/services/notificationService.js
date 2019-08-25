import Noty from 'noty';

export default {
  create,
  close,
};

const notifications = {};

function create({ slug, duration, timeout, type, ...props }) {
  if (slug && notifications[slug]) {
    notifications[slug].close();
  }
  let time = 6000;
  if (duration === 'short') {
    time = 4000;
  } else if (duration === 'long') {
    time = 8000;
  } else if (duration === 'veryLong') {
    time = 10000;
  }
  const notification = new Noty({
    timeout: timeout || time,
    type: type || 'success',
    ...props,
  });
  notification.show();
  if (slug) {
    notifications[slug] = notification;
  }
}

function close(slug) {
  if (notifications[slug]) {
    notifications[slug].close();
  }
}
