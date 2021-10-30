/*

How do I calculate to hit?

- roll (1d20)
- weaponToHit = someCharStat * weapToHitMultiplier - weapHitDifficultyClass
- attackerToHit = roll + weaponToHit
- defenderEvade = charFortitude or charReflex or charWillpower
- if attackerToHit >= defenderEvade

What information do I need to calculate this?

- roll
- attacker stats:
    - character attribute stats (value of CON, STR, DEX, WIS, INT, CHA)
    - weapon primary attribute (enum of attribute))
    - weapon to hit multiplier (self-explanatory, can be 1)
    - weapon difficulty class
    - weapon attack type (enum of strike, projectile, curse)
- defender stats:
    - character attribute stats (value of CON, STR, DEX, WIS, INT, CHA)

What would be nice to output?

- Did it hit or not (duh)
- Final attacker total stat
- Defender stat

What's out of scope for v1?

- Crits will add 10 to attackerToHit
- Eventually probs some passives that modify to hit in certain situations, both for attacker/defender(s)

 */
