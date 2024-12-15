import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "wired-elements";

export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "rpg-me";
  }

  constructor() {
    super();
    this.accessories = 0;
    this.base = 1;
    this.face = 0;
    this.faceItem = 0;
    this.hair = 0;
    this.pants = 0;
    this.shirt = 0;
    this.skin = 0;
    this.hatColor = 0;
    this.hat = 'none';
    this.fire = false;
    this.walking = false;
    this.circle = false;
    this.seed = '';
    this.loadFromUrl();
  }

  static get properties() {
    return {
      ...super.properties,
      accessories: { type: Number, reflect: true },
      base: { type: Number, reflect: true },
      face: { type: Number, reflect: true },
      faceItem: { type: Number, reflect: true },
      hair: { type: Number, reflect: true },
      pants: { type: Number, reflect: true },
      shirt: { type: Number, reflect: true },
      skin: { type: Number, reflect: true },
      hatColor: { type: Number, reflect: true },
      hat: { type: String, reflect: true },
      fire: { type: Boolean, reflect: true },
      walking: { type: Boolean, reflect: true },
      circle: { type: Boolean, reflect: true },
      seed: { type: String },
    };
  }

  // Keeping your existing styles unchanged
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
        }

        .wrapper {
          display: inline-flex;
        }

        .character-panel {
          background: var(--ddd-theme-default-slateMaxLight);
          padding: var(--ddd-spacing-4);
          width: 600px;
        }

        .controls-panel-1 {
          background: var(--ddd-theme-default-navy40);
          padding: var(--ddd-spacing-4);
          width: 400px;
        }

        .controls-panel-2 {
          background: var(--ddd-theme-default-navy40);
          padding: var(--ddd-spacing-4);
          width: 400px;
          justify-content: center;
        }

        wired-item {
          opacity: 1;
        }

        .input-group {
          margin-bottom: var(--ddd-spacing-4);
        }

        .input-group label {
          display: block;
          margin-bottom: var(--ddd-spacing-2);
        }

        .seed-display {
          margin-top: var(--ddd-spacing-4);
          margin-right: var(--ddd-spacing-4);
        }

        .share-button {
          margin-top: var(--ddd-spacing-4);
        }

        wired-checkbox {
          margin: var(--ddd-spacing-2) 0;
        }

        @media (max-width: 768px) {
          .wrapper {
            flex-direction: column;
            align-items: center;
          }

          .character-panel {
            max-width: 100%;
            padding: var(--ddd-spacing-2);
          }

          .controls-panel {
            width: 100%;
            padding: var(--ddd-spacing-2);
          }

          wired-slider {
            width: 100%;
          }

          wired-radio {
            display: block;
            margin-bottom: var(--ddd-spacing-2);
          }

          .input-group {
            width: 100%;
          }

          .share-button {
            width: 100%;
          }
        }

        @media (min-width: 769px) {
          .wrapper {
            flex-direction: row;
          }

          .character-panel {
            width: 600px;
          }

          .controls-panel {
            width: 400px;
          }
        }
      `
    ];
  }

  loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const seed = params.get('seed');
    if (seed && seed.length === 10) {
      this.seed = seed;
      // Parse the seed into individual values and force numeric conversion
      this.accessories = Number(seed[0]);
      this.base = Number(seed[1]) === 5 ? 5 : 1;
      this.face = Number(seed[2]);
      this.faceItem = Number(seed[3]);
      this.hair = Number(seed[4]);
      this.pants = Number(seed[5]);
      this.shirt = Number(seed[6]);
      this.skin = Number(seed[7]);
      this.hatColor = Number(seed[8]);
      
      // Force an update after setting all properties
      this.requestUpdate();
    }

    // Load boolean values
    this.fire = params.get('fire') === 'true';
    this.walking = params.get('walking') === 'true';
    this.circle = params.get('circle') === 'true';
    
    // Load hat value
    const hat = params.get('hat');
    if (hat && this.isValidHat(hat)) {
      this.hat = hat;
    }
  }

  isValidHat(hat) {
    const validHats = ['none', 'bunny', 'coffee', 'construction', 'cowboy', 
                      'education', 'knight', 'ninja', 'party', 'pirate', 'watermelon'];
    return validHats.includes(hat);
  }

  updateSeed() {
    // Create the seed string
    this.seed = `${this.accessories}${this.base}${this.face}${this.faceItem}${this.hair}${this.pants}${this.shirt}${this.skin}${this.hatColor}0`;
    this.updateUrl();
  }

  updateUrl() {
    const params = new URLSearchParams();
    params.set('seed', this.seed);
    if (this.hat !== 'none') {
      params.set('hat', this.hat);
    }
    if (this.fire) params.set('fire', 'true');
    if (this.walking) params.set('walking', 'true');
    if (this.circle) params.set('circle', 'true');
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  handleInputChange(property, event) {
    if (event.target.tagName.toLowerCase() === 'wired-checkbox') {
      this[property] = event.target.checked;
    } else if (property === 'base') {
      const value = event.detail.selected;
      this[property] = value === "5" ? 5 : 1;
      this.requestUpdate();
    } else if (property === 'hat') {
      this[property] = event.detail.selected;
    } else if (event.detail?.selected !== undefined) {
      this[property] = Number(event.detail.selected);
    } else {
      this[property] = Number(event.target.value);
    }
    
    if (!['hat', 'fire', 'walking', 'circle'].includes(property)) {
      this.updateSeed();
    } else {
      this.updateUrl();
    }
  }

  async shareCharacter() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Share link: ' + url);
    }
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="character-panel">
          <rpg-character
            .accessories="${this.accessories}"
            .base="${this.base}"
            .face="${this.face}"
            .faceitem="${this.faceItem}"
            .hair="${this.hair}"
            .pants="${this.pants}"
            .shirt="${this.shirt}"
            .skin="${this.skin}"
            .hatcolor="${this.hatColor}"
            .hat="${this.hat}"
            ?fire="${this.fire}"
            ?walking="${this.walking}"
            ?circle="${this.circle}"
            height="400"
            width="400"
          ></rpg-character>
          <div class="seed-display">
            Character Seed: ${this.seed}
          </div>
        </div>

        <div class="controls-panel-1">
          <div class="input-group">
            <label for="base">Character Type</label>
            <wired-combo id="base" .value="${this.base}" @selected="${(e) => this.handleInputChange('base', e)}">
              <wired-item value="1">Male</wired-item>
              <wired-item value="5">Female</wired-item>
            </wired-combo>    
          </div>

          <div class="input-group">
            <label for="accessories">Accessories (0-9)</label>
            <wired-slider id="accessories" min="0" max="9" .value="${this.accessories}" @change="${(e) => this.handleInputChange('accessories', e)}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="face">Face (0-5)</label>
            <wired-slider id="face" min="0" max="5" .value="${this.face}" @change="${(e) => this.handleInputChange('face', e)}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="faceItem">Face Item (0-9)</label>
            <wired-slider id="faceItem" min="0" max="9" .value="${this.faceItem}" @change="${(e) => this.handleInputChange('faceItem', e)}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="hair">Hair Style (0-9)</label>
            <wired-slider id="hair" min="0" max="9" .value="${this.hair}" @change="${(e) => this.handleInputChange('hair', e)}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="pants">Pants (0-9)</label>
            <wired-slider id="pants" min="0" max="9" .value="${this.pants}" @change="${(e) => this.handleInputChange('pants', e)}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="shirt">Shirt (0-9)</label>
            <wired-slider id="shirt" min="0" max="9" .value="${this.shirt}" @change="${(e) => this.handleInputChange('shirt', e)}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="skin">Skin Tone (0-9)</label>
            <wired-slider id="skin" min="0" max="9" .value="${this.skin}" @change="${(e) => this.handleInputChange('skin', e)}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="hatColor">Hat Color (0-9)</label>
            <wired-slider id="hatColor" min="0" max="9" .value="${this.hatColor}" @change="${(e) => this.handleInputChange('hatColor', e)}"></wired-slider>
          </div>
        </div>

        <div class="controls-panel-2">
          <div class="input-group">
            <label for="hat">Hat Style</label>
            <wired-combo id="hat" .value="${this.hat}" @selected="${(e) => this.handleInputChange('hat', e)}">
              <wired-item value="none">None</wired-item>
              <wired-item value="bunny">Bunny</wired-item>
              <wired-item value="coffee">Coffee</wired-item>
              <wired-item value="construction">Construction</wired-item>
              <wired-item value="cowboy">Cowboy</wired-item>
              <wired-item value="education">Education</wired-item>
              <wired-item value="knight">Knight</wired-item>
              <wired-item value="ninja">Ninja</wired-item>
              <wired-item value="party">Party</wired-item>
              <wired-item value="pirate">Pirate</wired-item>
              <wired-item value="watermelon">Watermelon</wired-item>
            </wired-combo>
          </div>

          <div class="input-group">
            <wired-checkbox ?checked="${this.fire}" @change="${(e) => this.handleInputChange('fire', e)}">On Fire</wired-checkbox>
          </div>

          <div class="input-group">
            <wired-checkbox ?checked="${this.walking}" @change="${(e) => this.handleInputChange('walking', e)}">Walking</wired-checkbox>
          </div>

          <div class="input-group">
            <wired-checkbox ?checked="${this.circle}" @change="${(e) => this.handleInputChange('circle', e)}">Show Circle</wired-checkbox>
          </div>

          <wired-button class="share-button" @click="${this.shareCharacter}">Share Character</wired-button>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(RpgMe.tag, RpgMe);