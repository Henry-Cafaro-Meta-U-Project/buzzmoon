

# Buzzmoon

## Table of Contents
1. [Overview](#Overview)
1. [Product Spec](#Product-Spec)
1. [Wireframes](#Wireframes)
1. [Schema](#Schema)

## Overview
### Description
Placeholder
### App Evaluation
- **Category:** Game
- **Mobile:** Development is prioritized for computer, but making a responsive and flexible web app should mean that mobile is a good user experience as well.
- **Story:** Create custom audio based trivia games, compete on them with your friends, compare your results to see where you rank.
- **Market:** High schoolers, college students, and older, most likely people involved in the quizbowl community. 
- **Habit:** Not especially frequent access; some people might produce weekly rounds for others to play, or a small group of people might each produce a round and then play each others.
- **Scope:** Basic functionality of compete on rounds, create rounds in browser without messing with files or technical stuff, and view results after competition. After this is complete, functionality can be expanded to more detailed statistics, different formats of game, more social aspects, etc. 

## Product Spec

### User Roles

Competitor-a user who is competing on rounds with other competitors

Creator-a user who is creating rounds of questions for other users to compete on

### User Personas


### User Stories

As a competitor, I want to be able to compare my results and see where I rank against my friends

As a competitor, I want to be able to search for rounds to play based on keywords or topics that I’m interested in.

As a competitor, I want my scores and the timing of my answers to be accurately measured, as even fractions of a second can affect my relative placement.

As a competitor, I want to be able to see detailed statistics about my performance on various categories of questions. 

As a competitor, I want fair competition and cheating by other players to be prevented.

As a creator, I want to be able to save the rounds that I’m working on and continue editing them at a later date.

As a creator, I want to be able to create either private rounds for a specific group of people or public rounds for everybody to play. 

As a creator, I want the choice to record the audio for my rounds in browser, or upload audio files from my computer. 

As a creator, I want to be able to see detailed statistics on the performance of players on the rounds I created

As a creator, I want rounds I create to be displayed to many competitors so I can get as much participation as possible. 

As a creator, I want to be able to manually review answers by competitors in my rounds to award credit for answers that may not have been counted by the machine

### 2. Screen Archetypes

* Login
* Compete View: View list of available games to play
* Game View: For each question, view the audio controls, navigate between questions, and view your current score and the results of your current game.
* Game Leaderboard: View the global statistics of how people did on the game and see how you compare to others. 

* Create View: View list of games you've created, (editing is a stretch feature), create new game
* Create Game View: View data for the game you're currently working on, title, description, etc, and view a list of questions with audio widget to record audio for each question, list of acceptable answers, etc.


### 3. Navigation

**Tab Navigation** (Tab to Screen)

* Compete {arena icon}
* Create  {pen icon}
* Profile {head icon}

**Flow Navigation** (Screen to Screen)

* Login -> Compete View, default landing screen after logging in
* Compete View -> Game View, after selecting game to play
* Compete View -> Game Leaderboard, after selecting game to view results of
* Game View -> Game Leaderboard, after game is complete
* Create View -> Create Game View, after selecting a game to edit or creating a new game



## Wireframes





## Schema 
### Models
### Database Classes


   
### Networking
#### List of network requests by screen

-Login
  - authenticate login user, sign up new user
-Compete View
  - (GET) get list of available games
-Game View
  - (GET) get question data, url to question audio;
  - (POST) send user answer to backend
-Game Leaderboard 
  -(GET) get game results
-Create View
  -(GET) get list of user's created games
-Create Game View
  -(POST) send question data and game data to backend, receive as answer cloud storage url to upload audio to
  -(POST) send question audio to url storage
   

