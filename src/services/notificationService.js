import Noty from 'noty';

export default {
  create,
  close,
};

const notifications = {};

function create({ slug, timeout, type, ...props }) {
  if (notifications[slug]) {
    notifications[slug].close();
  }
  notifications[slug] = new Noty({
    timeout: timeout || 6000,
    type: type || 'success',
    ...props,
  });
  notifications[slug].show();
}

function close(slug) {
  if (notifications[slug]) {
    notifications[slug].close();
  }
}
