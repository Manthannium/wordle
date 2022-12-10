# 🎲 Wordle Game 🎲 
### Play here - https://wordle-manthannium.vercel.app/
![game](https://github.com/Manthannium/wordle/blob/main/images/gamesnap.png)

Alternate link - https://wordle-rho-lake.vercel.app/ 

# 🎮 Technologies Used
![image](https://user-images.githubusercontent.com/82395430/206865895-5a45d318-8114-4dee-b335-13892f4c5712.png)

# 💎 New features
- Programmer-friendly Dark UI with cool animations
- Virtual keyboard with sound effects
- Dictionary API for fetching hint

# 🏆 Scoring scheme
- Each guess will cost 20 points
- Green boxes will increment score 4-fold
- Yellow boxes will increment score 2-fold
- Clicking hints will divide your score

# 🎯 Formula for calculating score
```
x = trial number
y = green boxes
z = yellow boxes
t = hint clicks
score = (2*(10*(7-x) + 2*y + z - 20))/(1 + t)
```

### Made with ♥️ by [Manthan](https://github.com/Manthannium)
