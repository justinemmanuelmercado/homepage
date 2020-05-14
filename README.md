# homepage

[Video Demo](https://www.youtube.com/watch?v=bOyyGtwD0z8)

React app that serves as my browser homepage and new tab page. Can store links as a Quicklink (**QL**) or a Bookmarks(**BM**)

Can be partially navigated by keyboard (See 'Site Usage -> Shortcut Keys')

Built with
* react
* node/express
* typescript
* postgres
* love and care

## BMs and QLs
### QLs
* QLs are supposed to be your most visited sites ex: https://www.reddit.com, https://www.github.com
* Only shown as the site's favicon. Contains no other information, derives its name from the site's hostname

### BMs
* BMs are for links you'd like to visit again someday but you also need to store it with more information or categorization
* Can be stored with a name, text description and tags
* Can be sorted with tags

## Installing and running on your own server
*I'm sorry but this was never meant to be used by anyone else but I will try to explain what is needed to have this run on your own machine*

*Feel free to contact me if you're having trouble getting this installed*

### Prereqs
node/npm/typescript/postgres/docker

### Instructions
1. Clone this repo
2. Fill in the `.env` of both `/frontend` and `/backend` using their respective `.env.example` files
3. Fill in the `.docker-compose.yml` file in `/backend` using the `.docker-compose.yml.example` file
4. Run `sh deploy.sh` in `/`

@todo Test this out on a new system

## Site Usage
### Shortcut keys
#### Works on both QLs and BMs tab
* Up: Open `QLs` tab
* Down: Open `BMs` tab
* 1 - 5: Opens the link in the same tab according to their place (1st link is 1, 5th link is 5)
* Shift + 1 -5: Same as above except link opens in a different tab
z* Left - Right: Next and previous page

#### Only works on QLs tab
*none yet*
#### Only works on BMs tab
*none yet*

### Adding QLs
1. On the QLs tab enter the URL of the site
2. When the form detects a  valid URL, it sends a request to the site to grab the URL of its favicon
3. During this time you should see a spinner to indicate that it is currently requesting the icon. If you save the link before the spinner stops, the icon will not be saved with the URL
4. Press the plus button

### Adding BMs
1. On the BMs tab click the "Add Bookmark" button to open the new bookmark form
2. Fill in the form and just like with adding QLs, once the form detects  a valid URL it sends a request to the URL to get its metadata
3. The requested metadata will then fill in the thumbnail, name and description forms for you.

    a. It will not replace any filled forms already
    
    b. No options to replace the thumbnail as of now

4. Fill in your tags (note: your BMs can be filtered by tags), entering a new tag is done by pressing the enter button and deleting tags is done by clicking the entered tag
5. Click saved

### Navigation
#### QLs tab

@todo

#### BMs tab

@todo

## User accounts
**As of now** there is no way to add new accounts without running a command through `npm` or manually inserting into the DB.

### Creating Accounts manually through npm
*If you want to have your own account on my currently running instance of homepage, feel free to send me a message with your preferred `username` and `password`. Be aware though that links will be stored in plaintext, which means **I CAN SEE EVERYTHING YOU SAVE***

This can only be done with access to the server running the app. In the `/homepage/backend` folder run the following command
```shell
npm run user:new -u <username> -p <password>
```
that should run a node script that adds a new user to your database ***(BEWARE: PASSWORD IS STORED IN PLAINTEXT. I AM A LAZY DEV. SORRY!)***.


## Contact

ej@ejmercado.com
