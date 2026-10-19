# Run your own copy of OpenBEP

The public site at [openbep.com](https://openbep.com) is there to try OpenBEP. A real BEP holds private information: names, security clearances, references, activity logs, contract amounts. For real projects, run your own copy on your own computers or network.

OpenBEP is two plain web pages (`app/bep-builder.html` and `app/scorecard.html`). There is no server, no database and no installation. Each page keeps its work in the browser that opened it.

## What leaves your computer

- **Project data:** nothing. The pages never send your project anywhere.
- **Fonts:** the pages load three fonts from Google Fonts, which tells Google your IP address but nothing about the project. To stop it, delete the two `fonts.googleapis.com` lines at the top of each page. The pages then use the computer's own fonts.

## Option 1: one computer

1. Download the repository: on [GitHub](https://github.com/SamuelAB/openbep), click **Code**, then **Download ZIP**, and unzip it. Or run `git clone https://github.com/SamuelAB/openbep.git`.
2. Open `app/bep-builder.html` in Chrome, Edge or Firefox (double-click it).
3. Bookmark the page. Your work is kept in that browser, on that computer, for that user profile.

Clearing the browser's site data erases the work. Use **Save project file** often as a backup.

## Option 2: a team

1. Put the `app` folder on a web server inside your network. Any server that serves plain files works (IIS, nginx, Apache, an internal static site). No configuration is needed.
2. Everyone opens the page from that internal address.
3. To work on the same project, one person clicks **Save project file** and puts the file in the team's shared folder (a Teams channel, SharePoint, a network drive). The next person clicks **Open project file**, makes changes and saves it back.

Treat the project file like the BEP itself. Keep it where only the project team can read it, because it contains every person's private details.

If you can't run a web server, sync the `app` folder to each computer (for example through OneDrive or a network drive) and open the file locally as in option 1. A SharePoint library usually downloads an `.html` file instead of showing it, so don't open the page straight from SharePoint.

## Things to avoid

- **GitHub Pages for real projects.** A Pages site is public on most GitHub plans, even when the repository is private.
- **Emailing the project file.** Use the team's shared folder, so the latest version stays in one place and survives staff turnover.
- **Public file links.** "Anyone with the link" sharing on OneDrive, Google Drive or Dropbox exposes the private details.

## Updating

Download the repository again, or run `git pull`, and replace the `app` folder. Saved work is not affected, because it lives in the browser and in your project files, not in the page. Save a project file before updating, just in case.

## Live co-editing

There is no live co-editing in a self-hosted copy yet: one person edits the project file at a time. If your team needs live co-editing, [open an issue](https://github.com/SamuelAB/openbep/issues) so we know.

---

## En bref (français)

Le site public [openbep.com](https://openbep.com) sert à essayer OpenBEP. Pour un vrai projet, qui contient des renseignements privés, installez votre propre copie : téléchargez le dépôt depuis GitHub et ouvrez `app/bep-builder.html` dans votre navigateur, ou placez le dossier `app` sur un serveur web interne. Aucune donnée du projet ne quitte l’ordinateur. Pour travailler en équipe, enregistrez le fichier du projet dans le dossier partagé de l’équipe (Teams, SharePoint, lecteur réseau), jamais par courriel ni par un lien public.
