import { AttributeStats } from 'attribute_stats';
import { Attribute, AttackType, DamageType, Skills, Stats, EvasiveStatType } from 'base_game_enums';
import { Profile } from 'profile';
import { ResistanceStats } from 'resistance_stats';
import { Weapon } from 'weapon';


export class Character {
    attributeStats: AttributeStats;
    resistanceStats: ResistanceStats;
    stats: Record<Stats, number>;
    weapon: Weapon;
    profile: Profile;

    constructor(unitName: string, profileName: string){
        this.attributeStats = AttributeStats.buildAttributesUnit(unitName);
        this.profile = new Profile(profileName);
        this.resistanceStats = ResistanceStats.buildResistancesArmor(this.profile.armor);

        this.stats = {} as Record <Stats, number>;

        this.weapon = new Weapon('Dagger');

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

}