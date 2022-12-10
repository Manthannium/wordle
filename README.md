# Wordle Game
### https://wordle-manthannium.vercel.app/

Alternate link - https://wordle-rho-lake.vercel.app/ 

### Technologies Used


### New features
- Programmer-friendly Dark UI with cool animations
- Virtual keyboard with sound effects
- Hint feature revealing word's meaning
- 

### Scoring scheme
- Each guess will cost 20 points
- Green boxes will increment score 4-fold
- Yellow boxes will increment score 2-fold
- Clicking hints will divide your score
```
x = trial number
y = green boxes
z = yellow boxes
t = hint clicks
score = (2*(10*(7-x) + 2*y + z - 20))/(1 + t)
```


