## v4.2.0

- Better random screenshots: you see all unseen screenshots without repetition (with 200 unseen sc max)
- Validation button more obvious
- Improved buttons on mobile so that the validation button will not be confused with "next screenshot" button
- CSS naming fix

### v4.1.3

- Fix count of added screenshots for moderators

### v4.1.2

- Now only picture of last added screenshot is clickable. Closes #17

### v4.1.1

- Update scores after screenshot deletion
- Various other bug fixes

## v4.1.0

- New screenshots from moderators are now automatically approved
- Bugfixes

### v4.0.1

- Fix #19 - /user/* should not be accessible when not logged
- Fix "no screenshots" messages in user space

# v4.0.0 - Moderation

- New uploaded screenshots needs to be approved by moderators
- Non-approved screenshots are excluded from the game
- Moderators can see the list of screenshots waiting to be approved

### v3.0.1

- Add licence & licence file

# v3.0.0 - User space

- Add user space with menu
  - Can view user data
  - Can view solved screenshots
  - Can view added screenshots
- Logout now from user space
- More consistant namings ("screenshot posted" => "added screenshot" ; "screenshot found" => "solved screenshot")
- Various bug fixes

### v2.2.5

- Remove title from homepage
- Tweak h1 / h2

### v2.2.4

- Remove swipe to change screenshot because of zoom bugs

### v2.2.3

- Fix user could solved several times the same screenshot
- Show screenshot's name when solving on small screens

### v2.2.2

- Fix "add screenshot" header selected link
- Fix "remove screenshot" link on small devices

### v2.2.1

- Fix add screenshot page design

## v2.2.0

- User can delete his screenshots
- Fix screenshot page when screenshot does not exist
- Fix user password field on login page

## v2.1.0

- Add seo meta title & description
- Update pwa assets

### v2.0.1

- Fix homepage "uploaded by"
- Fix smallscreen screenshot top info

# v2.0.0 - Redesign

- Complete redesign
- Add ranking page
- Add "last screenshot added" page

## v1.2.0

- Prefixing all api calls with /api so we can host the api on the same domain name as the main site

### v1.1.1

- Fix fatal error when guessing screenshots while not logged in

## v1.1.0

- Password recovery & email settings
- Autofocus guess input on play page
- Fix "try another" button when 1 screenshot left to be solved

# v1.0.0

- Login & registration
- Screenshots Upload
- Play page
- Homepage with players' ranking
