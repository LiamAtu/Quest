import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HeroAppearance {
  skin: 'default' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'rainbow';
  colour: string;
  accessories: string[];
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  @Input() appearance!: HeroAppearance;
  @Input() size: number = 100;

  rainbowColour = '#7F77DD';
  private rainbowCols = ['#7F77DD','#378ADD','#1D9E75','#EF9F27','#E24B4A','#D4537E'];
  private rainbowIndex = 0;

  readonly skinMap: Record<string, any> = {
    default: { torso: null,      arms: null,      legs: '#5a5a7a', helm: false, helmFill: '',        visorFill: ''        },
    bronze:  { torso: '#D85A30', arms: '#D85A30', legs: '#993C1D', helm: true,  helmFill: '#993C1D', visorFill: '#F0997B' },
    silver:  { torso: '#85B7EB', arms: '#85B7EB', legs: '#378ADD', helm: true,  helmFill: '#378ADD', visorFill: '#E6F1FB' },
    gold:    { torso: '#EF9F27', arms: '#EF9F27', legs: '#BA7517', helm: true,  helmFill: '#BA7517', visorFill: '#FAC775' },
    diamond: { torso: '#AFA9EC', arms: '#AFA9EC', legs: '#7F77DD', helm: true,  helmFill: '#534AB7', visorFill: '#CECBF6' },
    rainbow: { torso: '#7F77DD', arms: '#D4537E', legs: '#378ADD', helm: true,  helmFill: '#1D9E75', visorFill: '#FAC775' },
  };

  get skin() {
    return this.skinMap[this.appearance?.skin ?? 'default'];
  }

  get torsoColour() {
    return this.skin.torso ?? this.appearance?.colour ?? '#7F77DD';
  }

  get armColour() {
    return this.skin.arms ?? this.appearance?.colour ?? '#7F77DD';
  }

  get legColour()   { return this.skin.legs;      }
  get helmColour()  { return this.skin.helmFill;   }
  get visorColour() { return this.skin.visorFill;  }
  get hasHelm()     { return this.skin.helm;       }
  get isRainbow()   { return this.appearance?.skin === 'rainbow'; }
  get hasShield()   { return this.appearance?.accessories?.includes('shield'); }
  get hasCape()     { return this.appearance?.accessories?.includes('cape');   }
  get hasSword()    { return this.appearance?.accessories?.includes('sword');  }
}