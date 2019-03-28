### v7.0.6

- Change Cloudinary quality to 90%

### v7.0.5

- Fix display for screenshot waiting for approval on small screens
- Check for username length in react form
- Reset recaptcha if form submit comes back in error
- Fix display of header of screenshot page on very small screens

### v7.0.4

- Now catching crashes

### v7.0.3

- Fix #44

### v7.0.2

- Fix #42
- Fix #43

### v7.0.1

- Fix "Jouer" link active style 

# v7.0.0 - I'm not a robot

- Robot test by recaptcha when registering and submitting a new screenshot
- Error messages now red on login related pages

### v6.0.1

- User cannot rate their own screenshot

# v6.0.0 - Ratings!

- Now possible to rate screenshots
- Upload score is showned on ranking page
- Fix next/prev bug when clicking random button

## v5.3.0

- Add prev/next links next to screenshot id
- Add back button

## v5.2.0

- More compact mobile display
- Better homepage welcome text
- Fix english text

## v5.1.0

- Add nb total screenshots in ranking + explanation about completeness
- Screenshot footer no longer overlaps with image
- Moderators can now verify if game exists in jeuxvideo.com

### v5.0.2

- Add screenshot rules
- Remove points when rejecting an accepted screenshot
- Fix go back after edit
- Fix css

### v5.0.1

- Moderation screenshots now appear in reversed order (lastest first)
- Fix games titles with accents in user space

# v5.0.0 - French... French everywhere

- Translate the whole game into french
- John Does hidden from screenshot stats
- Fix edit screenshot
- Go back after editing a screenshot

### v4.4.1

- Replace query-string with qs

## v4.4.0

- Moderators can edit screenshots
- Moderators can view all screenshots

## v4.3.0

- Alternative scoring: formula is solved / (total - added)
- Fix homepage when no screenshot added yet
- Fix approve / disapprove already moderated screenshots
- Fix account page infinite loader when no screenshot solved / added

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
