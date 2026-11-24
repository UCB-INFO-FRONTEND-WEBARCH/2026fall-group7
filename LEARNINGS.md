# LEARNINGS

## Team name and members

**Team:** Group 7

| Member | Role |
| --- | --- |
| Yaelle Tang | Design and prototype (design, HTML, CSS), Google Calendar API |
| Alejandro (Alex) Rodriguez | Design and prototype (design, HTML, CSS) |
| Gujri Singh | React and data persistence |
| Patrick Ruan | Presentation |

**Timeline**

| Task | Who | Due |
| --- | --- | --- |
| Design and prototype (design, HTML, CSS) | Yaelle, Alex | Friday, Nov 13 |
| JavaScript and APIs: React and data persistence | Gujri | Friday, Nov 20 |
| JavaScript and APIs: Google Calendar API | Yaelle | Friday, Nov 20 |
| Testing | Everyone | Sunday, Nov 22 |
| Presentation | Patrick | Friday, Nov 27 |

## Our original goal and how much we achieved

**Original goal:** build a web app that helps students keep track of their internship and job applications. In our proposal, we planned that users could:

1. Add an application by pasting a job posting link. An LLM would read the page and fill in the company, role, deadline and job description. Users could also enter the details by hand.
2. Get an editable checklist of materials for each application (resume, cover letter, portfolio, and so on).
3. Update the status of each application as it moves forward.
4. See all deadlines and interviews on a timeline and a calendar.
5. Add these dates to Google Calendar.

**What we achieved:** we built goals 2, 3, 4 and 5, and the manual part of goal 1.

We decided **not** to build the LLM part (reading a job link). We found that it needs:

- a small server, because browsers can't read most job sites directly, and an API key must never be in front-end code
- a paid LLM API key
- extra work for many job sites (for example LinkedIn) that need a login or don't show their content to other programs

This was too much for the time we had, and the class only asks for one external API. So users type the company and role themselves, and the job link is saved as a normal field.

## What our project does

**Application Tracker** is a React web app for students who are applying for internships and jobs.

- **Home page:** shows every deadline, interview, online assessment and offer date as a **timeline** (grouped by week) or as a **monthly calendar**. A **"Next 7 days"** panel shows what is coming soon.
- **Applications page:** shows all applications as a **list** (with search, status filters and sorting) or as a **board** with one column for each status.
- **Application detail page:** for one application, users can:
  - change its status (Submitted, Under Review, First/Second/Third Round, Offer, Denied)
  - tick off, rename, delete or add items in the materials checklist
  - add or delete key dates (deadline, interview, assessment, take-home, offer)
  - write notes and see the job description
- **Add and Edit form:** a pop-up form to add a new application or edit one. Company and role are required. A default materials checklist is created and users can change it.
- **Google Calendar (external API):** users can add one date or sync all upcoming dates to their own Google Calendar. The app remembers which dates were already added, so nothing is added twice.
- **Saved data:** all applications and dates are saved in the browser's **localStorage**, so they are still there after a refresh or after closing the browser.
- **Phone layouts:** every page has a mobile layout with a bottom navigation bar.

**Tools:** React, Vite, React Router, localStorage, Google Calendar API, Google Identity Services.

## What we learned

### Yaelle

**Design: start with the design system, not the full page.**
When I started designing, I drew whole pages straight away. Later I noticed that the pages didn't match each other: colors, font sizes, spacing and buttons were a little different on each page. I had to go back and build the base first: colors, fonts, spacing, and small components like buttons, cards and badges. After that, I built the pages again from these pieces. Next time I will start with the design system and the components, and only then design full pages. This also made the move to code easier, because each component in the design became a React component, and the design values became CSS variables in `tokens.css`.

**Google Calendar API: it works, but only in Testing mode.**
I connected the app to Google Calendar. I learned how to set up a Google Cloud project, turn on the Calendar API, set up the OAuth consent screen, and create a Client ID. In the app, users sign in with Google in a pop-up and the app gets an access token. The token only lasts about one hour, so the app asks the user to sign in again when it runs out.

The biggest limit is that our Google app is still in **Testing mode**. This means only the Google accounts that we add to the "Test users" list (up to 100) can sign in. Other people can use the rest of the app, but Google blocks their sign-in. To open it to everyone, Google must review and approve the app, because calendar access is a "sensitive" permission. This review needs a privacy policy and can take weeks, so we decided to stay in Testing mode and add our teammates, the TAs and the instructor as test users.

I also learned to think about what happens when things go wrong. For example, if a user closes the sign-in pop-up during "Sync", the app should stop and show one message, not open a new pop-up for every date.

### Alex

_(To be written by Alex.)_

### Gujri

For my part, I turned our static mockup into a working React app and made the data save between app visits. I thought the persistence and saving data part would be the hardest, but it was actually pretty quick. What took more thinking was figuring out how to structure the data, and what should be saved versus what should just reset when you refresh. Actually building and using the app also gave me a different view than the mockups. Once I tested it as a new user, I noticed small details that needed to be added or adjusted, like a way to remove a date, or making the materials checkboxes clearer. I also learned how much coordinating with teammates matters. Breaking my work into smaller chunks and leaving clear notes made it easier to avoid overriding anyone's work and to hand off the Google Calendar part smoothly.

### Patrick

_(To be written by Patrick.)_
