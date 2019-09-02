### v12.2.2

- Fix 0/10 rated screenshot display
- Display screenshot ratings in numerals
- Add "scoreTooLow" option for refusal

### v12.2.1

- Better "existsInGoogleImage" text reason for users

## v12.2.0

- Players can check their screenshots on google image directly after upload
- Fix moderation texts
- Delete uploaded images after 20 minutes

## v12.1.0

- Using new screenshots grid lazy loading for moderation
- Prevent users from editing approved screenshots
- bugfixes

# v12.0.0 - Search screenshots in user space, Shortcuts, dependencies upgrade

- Better screenshots grid with loading on scroll and search
- Add shortcuts (j,k,enter,escape) on guess screenshot page
- Fix ranking notif bug
- Update to React 16.9
- Remove lodash dependency (keep only debounce)
- babel-eslint dependency moved to devDependencies

### v11.1.2

- No more showing viewed screenshots in email alerts
- Fix date bug in email alerts
- Prevent SQL exploits by using "replacement" sequelize tool for raw queries

### v11.1.1

- Last displayed sreenshot is now last moderated, not last by id

## v11.1.0

- Add notificationService in frontend for cleaner notif management
- More notification for new rakings
- Add notification when viewing screenshots that the user has already seen

# v11.0.0 - ViewedScreenshots

- Add ViewScreenshots table, to register screenshots seen by a user
- Showing in priority unseen screenshots to the user
- Rewrite if "exclude" screenshot system (now using localstorage) so the user should not see the same screenshots twice
- Code cleaning

## v10.4.0

- Add reasons for refusing screenshots
- `approvalStatus` is now an enum
- Fix bug when refusing screenshot the users scores where not updated

## v10.3.0

- Add robots.txt & sitemap
- Add discord and github in footer
- Fix typos
- Add text and titles for SEO

### v10.2.1

- Fix typos
- Registration popup stays for 12sec instead of 20

## v10.2.0

- Add filters in user added screenshots (all, accepted, refused, waiting)
- Non logged in users can now see the "add screenshots" link
- Focus on regitration rather than log in
- Prevent users to update images on accepted screenshots

## v10.1.0

- Fetch smaller images in user space and moderation space
- Better registration popups
- Fix ranking bugs

### v10.0.2

- Add check on google image link

### v10.0.1

- Fix images link in emails (moderation + marketing)
- Email updates: don't send screenshots that the user has already solved

# v10.0.0 - ScreenshotImage !

- ScreenshotImages table added to better store Cloudinary data
- Moderators can now edit screenshots
- Users can now choose their email update frequencies on registration

### v9.3.4

- New ranking board
- Fix ranking when score is the same

### v9.3.3

- Better error logs
- Unsubscribe from emails token no longer expires

### v9.3.2

- Fixes #58
- Fixes #59

### v9.3.1

- Fixes #55 (email subject when only one new shot)
- Now email updates works with new approved screenshots that where uploaded a long time ago
- When a moderator uploads a screenshot, moderatedBy and moderatedAt are filled
- Fix header active indicator

## v9.3.0

- New ranking system
- Alert when new rank
- Fix registration bug

### v9.2.2

- Bigger icon button on smartphones

### v9.2.1

- Fix mobile design (footer & email setting)

## v9.2.0

- Now able to edit username & email
- Add footer

### v9.1.1

- Fix bug where regular user could see a the "moderation" link

## v9.1.0

- Add ASAP option for email updates

### v9.0.3

- Fix email unsub token bug

### v9.0.2

- Add loader when loading solved & added screenshots

### v9.0.1

- Add default value "weekly" for new screenshots updates
- Remove email mention on register page

# v9.0.0 - Crons!

- Add crons
- Add New Screenshot Email Updates
- Add Noty (notifications in frontend)
- Bug fixes

## v8.2.0

- Remove service workers (they will be back)

### v8.1.2

- Fix password change
- Better 404 page

### v8.1.1

- Fix sequelize v5 bugs

## v8.1.0

- Aesthetics
- Translate page titles into french
- Remove duplicates from alternatives names
- Security dependencies updates

### v8.0.2

- Display loading message when loading moderation screenshots
- Not loading all moderation screenshots at once
- Not loading modetaions screenshots twice when useless

### v8.0.1

- Fix screenshot edit

# v8.0.0 - Emails to moderators

- Upgraded dependencies
- Rearranged emails javascript files
- Now sending an email to moderators when a new screenshot has been submitted

### v7.0.7

- Translate ranking suffixes into french

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
