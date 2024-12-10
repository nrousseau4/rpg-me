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
    this.updateSeed();
  }

  static get properties() {
    return {
      ...super.properties,
      accessories: { type: Number },
      base: { type: Number },
      face: { type: Number },
      faceItem: { type: Number },
      hair: { type: Number },
      pants: { type: Number },
      shirt: { type: Number },
      skin: { type: Number },
      hatColor: { type: Number },
      hat: { type: String },
      fire: { type: Boolean },
      walking: { type: Boolean },
      circle: { type: Boolean },
      seed: { type: String },
    };
  }

  static get styles() {
    return [super.styles,
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
    `];
  }

  loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const seed = params.get('seed');
    if (seed && seed.length === 10) {
      this.seed = seed;
      this.accessories = parseInt(seed[0]);
      this.base = parseInt(seed[1]);
      this.face = parseInt(seed[2]);
      this.faceItem = parseInt(seed[3]);
      this.hair = parseInt(seed[4]);
      this.pants = parseInt(seed[5]);
      this.shirt = parseInt(seed[6]);
      this.skin = parseInt(seed[7]);
      this.hatColor = parseInt(seed[8]);
    }
    this.fire = params.get('fire') === 'true';
    this.walking = params.get('walking') === 'true';
    this.circle = params.get('circle') === 'true';
    if (params.get('hat')) {
      this.hat = params.get('hat');
    }
  }

  updateSeed() {
    this.seed = `${this.accessories}${this.base}${this.face}${this.faceItem}${this.hair}${this.pants}${this.shirt}${this.skin}${this.hatColor}`;
    this.updateUrl();
  }

  updateUrl() {
    const params = new URLSearchParams();
    params.set('seed', this.seed);
    params.set('hat', this.hat);
    if (this.fire) params.set('fire', 'true');
    if (this.walking) params.set('walking', 'true');
    if (this.circle) params.set('circle', 'true');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  handleInputChange(property, event) {
    let value;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else if (event.detail?.selected !== undefined) {
      value = event.detail.selected;
    } else {
      value = parseInt(event.target.value);
    }
    
    this[property] = value;
    
    if (property !== 'hat' && property !== 'fire' && property !== 'walking' && property !== 'circle') {
      this.updateSeed();
    } else {
      this.updateUrl();
    }
    this.requestUpdate();
  }

  async shareCharacter() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard.');
    } catch (err) {
      alert('Share link: ' + url);
    }
  }

  firstUpdated() {
    super.firstUpdated();
    const baseCombo = this.shadowRoot.querySelector('#base');
    const hatCombo = this.shadowRoot.querySelector('#hat');
    if (baseCombo) baseCombo.value = this.base.toString();
    if (hatCombo) hatCombo.value = this.hat;
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="character-panel">
          <rpg-character
            .accessories="${this.accessories}"
            .base="${this.base}"
            .face="${this.face}"
            .faceItem="${this.faceItem}"
            .hair="${this.hair}"
            .pants="${this.pants}"
            .shirt="${this.shirt}"
            .skin="${this.skin}"
            .hatColor="${this.hatColor}"
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
            <wired-slider id="accessories" min="0" max="9" .value="${this.accessories}" @change="${(e) => this.handleInputChange('accessories', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="face">Face (0-5)</label>
            <wired-slider id="face" min="0" max="5" .value="${this.face}" @change="${(e) => this.handleInputChange('face', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="faceItem">Face Item (0-9)</label>
            <wired-slider id="faceItem" min="0" max="9" .value="${this.faceitem}" @change="${(e) => this.handleInputChange('faceItem', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="hair">Hair Style (0-9)</label>
            <wired-slider id="hair" min="0" max="9" .value="${this.hair}" @change="${(e) => this.handleInputChange('hair', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="pants">Pants (0-9)</label>
            <wired-slider id="pants" min="0" max="9" .value="${this.pants}" @change="${(e) => this.handleInputChange('pants', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="shirt">Shirt (0-9)</label>
            <wired-slider id="shirt" min="0" max="9" .value="${this.shirt}" @change="${(e) => this.handleInputChange('shirt', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="skin">Skin Tone (0-9)</label>
            <wired-slider id="skin" min="0" max="9" .value="${this.skin}" @change="${(e) => this.handleInputChange('skin', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="hatColor">Hat Color (0-9)</label>
            <wired-slider id="hatColor" min="0" max="9" .value="${this.hatColor}" @change="${(e) => this.handleInputChange('hatColor', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
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

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(RpgMe.tag, RpgMe);