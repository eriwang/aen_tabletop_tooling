import { AttributeStats } from 'attribute_stats';
import { Attribute, AttackType, DamageType, Skills, Stats, EvasiveStatType } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStats } from 'resistance_stats';




export class Character {
    attributeStats: AttributeStats;
    resistanceStats: ResistanceStats;
    stats: Record<Stats, number>;
    weapon: Weapon;
    profile: Profile;

    /**constructor(attrStats: AttributeStats, resStats: ResistanceStats, weap: Weapon, bonuses: SkillBonuses) {
        this.attributeStats = attrStats;
        this.resistanceStats = resStats;
        this.weapon = weap;
        this.skillBonus = bonuses;
        this.health = this.attributeStats.get(Attribute.Constitution) * 
    }*/

    constructor(unitName: string, profileName: string){
        this.attributeStats = new AttributeStats(unitName);
        this.profile = new Profile(profileName);
        this.resistanceStats = new ResistanceStats(this.profile.armor);

        this.stats = {} as Record <Stats, number>;

        this.stats[Stats.HP] = this.attributeStats.get(Attribute.Constitution) * this.profile.hpPerCon;
        this.stats[Stats.FP] = this.attributeStats.get(Attribute.Intelligence) * this.profile.fpPerInt;
        this.stats[Stats.FOR] = this.attributeStats.getEvasiveStat(EvasiveStatType.Fortitude);
        this.stats[Stats.REF] = this.attributeStats.getEvasiveStat(EvasiveStatType.Reflex);
        this.stats[Stats.WILL] = this.attributeStats.getEvasiveStat(EvasiveStatType.Willpower);
        
        //this.stats[Stats.Movement] = ??? where should come from unit stats or profile?

    
    }

    getSkillTotal(skill: Skills): number{

        let multiplier: number = 4;
        let bonus: number = this.profile.getSkillBonus(skill) * multiplier;


        switch(skill){
            case Skills.Endurance:
                return this.attributeStats.get(Attribute.Constitution) + bonus;

            case Skills.Athletics:
                return this.attributeStats.get(Attribute.Strength) + bonus;

            case Skills.Acrobatics:
            case Skills.SleightOfHand:
                return this.attributeStats.get(Attribute.Dexterity) + bonus;

            case Skills.Nature:
            case Skills.Religion:
            case Skills.Medicine:
            case Skills.Stealth: //Should this be wisdom?
            case Skills.Survival:
                return this.attributeStats.get(Attribute.Wisdom) + bonus;
            
            case Skills.Arcana:
            case Skills.History:
            case Skills.Investigation:
            case Skills.Culture:
                return this.attributeStats.get(Attribute.Intelligence) + bonus;

            case Skills.Deception:
            case Skills.Intimidation:
            case Skills.Performance:
            case Skills.Persuasion:
            case Skills.Insight:
                return this.attributeStats.get(Attribute.Charisma) + bonus;
        }

    }

    getScalingFactor() : number {
        return Math.ceil(
            this.attributeStats.get(this.weapon.attribute) *
            this.weapon.attributeMultiplier
        );
    }

}